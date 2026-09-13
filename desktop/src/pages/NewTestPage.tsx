import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Camera, CheckCircle2, CircleDashed, FlaskConical, Image as ImageIcon, RefreshCw, ShieldAlert } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';
import LocationCaptureCard from '@/components/LocationCaptureCard';
import { getCurrentFrontendSession } from '@/services/auth';
import {
  configurationOptions,
  getConfigurationById,
  getInitialWorkflowState,
  getNextStep,
  getPreviousStep,
  getProvenanceBadge,
  getResultBadge,
  workflowSteps,
} from '@/state/newTestWorkflow';
import type { CameraState, CapturedImageData, LocationData, LocationState, NewTestWorkflowStep, WorkflowResultState } from '@/types/newTestWorkflow';

export default function NewTestPage() {
  const [workflow, setWorkflow] = useState(getInitialWorkflowState());
  const currentObjectUrlRef = useRef<string | null>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(currentObjectUrlRef.current);
        } catch {
          // Safe ignore
        }
        currentObjectUrlRef.current = null;
      }
    };
  }, []);

  const currentStepIndex = workflowSteps.findIndex((step) => step.key === workflow.currentStep);
  const selectedConfiguration = useMemo(
    () => getConfigurationById(workflow.selectedConfigurationId),
    [workflow.selectedConfigurationId],
  );
  const selectedConfigurationName = selectedConfiguration?.name ?? 'Unavailable';
  const selectedConfigurationVersion = selectedConfiguration?.version ?? 'Unavailable';
  const analysisStages = workflow.analysisState?.stages ?? [];
  const analysisMessage = workflow.analysisState?.message ?? 'Analysis is unavailable in the current frontend because the CV and model pipeline is not connected yet.';
  const provenanceStatus = workflow.provenanceState?.status ?? 'UNAVAILABLE';
  const provenanceMessage = workflow.provenanceState?.message ?? 'Blockchain provenance is unavailable in the current frontend.';
  const evidenceRecordState = workflow.evidenceRecordState ?? {};
  const evidenceRecordResult = evidenceRecordState.result ?? 'UNAVAILABLE';
  const evidenceRecordLocation = evidenceRecordState.location || 'Unavailable';
  const evidenceRecordRecordId = evidenceRecordState.recordId || 'Unavailable';
  const evidenceRecordConfigurationName = evidenceRecordState.configurationName || 'Unavailable';
  const evidenceRecordVersion = evidenceRecordState.version || 'Unavailable';
  const evidenceRecordTimestamp = evidenceRecordState.timestamp || 'Unavailable';
  const evidenceRecordOperator = evidenceRecordState.operator || 'Unavailable';
  const evidenceRecordDevice = evidenceRecordState.device || 'Unavailable';
  const capturedImage = workflow.capturedImage ?? null;

  const canGoNext = useMemo(() => {
    switch (workflow.currentStep) {
      case 'configuration':
        return true;
      case 'instructions':
        return true;
      case 'capture':
        return workflow.captureState === 'CAPTURED' && Boolean(workflow.capturedImage);
      case 'review':
        return Boolean(workflow.capturedImage);
      case 'analysis':
        return true;
      case 'result':
        return true;
      case 'evidence':
        return Boolean(workflow.evidenceRecordState?.available);
      case 'provenance':
        return false;
      default:
        return false;
    }
  }, [selectedConfiguration, workflow]);

  const updateEvidenceRecord = (nextState = workflow) => {
    const session = getCurrentFrontendSession();
    const operator = session?.officerId ? session.officerId : 'Unavailable';
    const timestamp = nextState.capturedData?.capturedAt
      ? new Date(nextState.capturedData.capturedAt).toLocaleString('en-GB', { hour12: false })
      : nextState.evidenceRecordState?.timestamp || 'Unavailable';
    const locationFormatted = nextState.locationData
      ? `${nextState.locationData.latitude.toFixed(6)}, ${nextState.locationData.longitude.toFixed(6)}`
      : 'Unavailable';

    return {
      ...nextState,
      evidenceRecordState: {
        ...nextState.evidenceRecordState,
        available: Boolean(nextState.capturedImage),
        recordId: 'Unavailable',
        configurationId: '',
        configurationName: 'Unavailable',
        version: 'Unavailable',
        timestamp,
        location: locationFormatted,
        locationData: nextState.locationData ?? null,
        operator,
        device: 'Unavailable',
        result: 'UNAVAILABLE',
        image: nextState.capturedImage,
      },
    };
  };

  const handleSelectConfiguration = (configurationId: string) => {
    const config = getConfigurationById(configurationId);

    if (!config) {
      return;
    }

    setWorkflow((current) => ({
      ...current,
      selectedConfigurationId: configurationId,
      evidenceRecordState: {
        ...current.evidenceRecordState,
        configurationId: config.id,
        configurationName: config.name,
        version: config.version,
      },
    }));
  };

  const handleRealCapture = (captureResult: {
    blob: Blob;
    dataUrl?: string;
    capturedAt: string;
    width?: number;
    height?: number;
  }) => {
    if (currentObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      } catch {
        // Safe ignore
      }
      currentObjectUrlRef.current = null;
    }

    let previewUrl = '';
    try {
      previewUrl = URL.createObjectURL(captureResult.blob);
      currentObjectUrlRef.current = previewUrl;
    } catch {
      previewUrl = captureResult.dataUrl || '';
    }

    const capturedData: CapturedImageData = {
      blob: captureResult.blob,
      previewUrl,
      dataUrl: captureResult.dataUrl,
      capturedAt: captureResult.capturedAt,
      width: captureResult.width,
      height: captureResult.height,
    };

    const session = getCurrentFrontendSession();
    const operator = session?.officerId ? session.officerId : 'Unavailable';
    const formattedTimestamp = new Date(captureResult.capturedAt).toLocaleString('en-GB', { hour12: false });

    setWorkflow((current) => ({
      ...current,
      captureState: 'CAPTURED',
      cameraError: null,
      reviewState: 'ready',
      capturedImage: previewUrl,
      capturedData,
      evidenceRecordState: {
        ...current.evidenceRecordState,
        available: true,
        recordId: 'Unavailable',
        configurationId: '',
        configurationName: 'Unavailable',
        version: 'Unavailable',
        timestamp: formattedTimestamp,
        location: current.locationData
          ? `${current.locationData.latitude.toFixed(6)}, ${current.locationData.longitude.toFixed(6)}`
          : 'Unavailable',
        locationData: current.locationData ?? null,
        operator,
        device: 'Unavailable',
        result: 'UNAVAILABLE',
        image: previewUrl,
      },
    }));
  };

  const handleRealRetake = () => {
    if (currentObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      } catch {
        // Safe ignore
      }
      currentObjectUrlRef.current = null;
    }

    setWorkflow((current) => ({
      ...current,
      captureState: 'INITIALIZING',
      cameraError: null,
      capturedImage: null,
      capturedData: null,
      reviewState: 'not-started',
      evidenceRecordState: {
        ...current.evidenceRecordState,
        image: null,
        available: false,
        timestamp: 'Unavailable',
      },
    }));
  };

  const handleCameraStateChange = (nextState: CameraState, error?: string | null) => {
    setWorkflow((current) => ({
      ...current,
      captureState: nextState,
      cameraError: error ?? null,
    }));
  };

  const handleLocationSuccess = (data: LocationData) => {
    const locationFormatted = `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`;
    setWorkflow((current) => ({
      ...current,
      locationState: 'LOCATION_AVAILABLE',
      locationData: data,
      locationError: null,
      evidenceRecordState: {
        ...current.evidenceRecordState,
        location: locationFormatted,
        locationData: data,
      },
    }));
  };

  const handleLocationStateChange = (nextState: LocationState, error?: string | null) => {
    setWorkflow((current) => ({
      ...current,
      locationState: nextState,
      locationError: error ?? null,
      evidenceRecordState: {
        ...current.evidenceRecordState,
        location:
          nextState === 'LOCATION_AVAILABLE' && current.locationData
            ? `${current.locationData.latitude.toFixed(6)}, ${current.locationData.longitude.toFixed(6)}`
            : 'Unavailable',
        locationData: nextState === 'LOCATION_AVAILABLE' ? current.locationData : null,
      },
    }));
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }

    if (workflow.currentStep === 'configuration') {
      setWorkflow((current) => ({ ...current, currentStep: getNextStep(current.currentStep) }));
      return;
    }

    if (workflow.currentStep === 'instructions') {
      setWorkflow((current) => ({ ...current, currentStep: getNextStep(current.currentStep) }));
      return;
    }

    if (workflow.currentStep === 'capture') {
      setWorkflow((current) => ({ ...current, currentStep: getNextStep(current.currentStep), reviewState: 'ready' }));
      return;
    }

    if (workflow.currentStep === 'review') {
      setWorkflow((current) => ({ ...current, currentStep: getNextStep(current.currentStep) }));
      return;
    }

    if (workflow.currentStep === 'analysis') {
      setWorkflow((current) => ({ ...current, currentStep: getNextStep(current.currentStep) }));
      return;
    }

    if (workflow.currentStep === 'result') {
      setWorkflow((current) => updateEvidenceRecord({
        ...current,
        currentStep: getNextStep(current.currentStep),
      }));
      return;
    }

    if (workflow.currentStep === 'evidence') {
      setWorkflow((current) => ({
        ...current,
        currentStep: getNextStep(current.currentStep),
        provenanceState: {
          status: 'UNAVAILABLE',
          message: 'Blockchain provenance is not yet connected to a real backend API in this frontend.',
        },
      }));
    }
  };

  const handlePrevious = () => {
    setWorkflow((current) => ({
      ...current,
      currentStep: getPreviousStep(current.currentStep),
    }));
  };

  const renderStepContent = () => {
    switch (workflow.currentStep) {
      case 'configuration':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Configuration</h3>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-secondaryText">
              No configuration presets are available in the current frontend build. The backend configuration service is not connected yet.
            </div>
          </div>
        );
      case 'instructions':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <CircleDashed className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Instructions</h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-offWhite p-5">
                <h4 className="text-lg font-semibold text-primaryText">Why the reference card is required</h4>
                <ul className="mt-4 space-y-3 text-sm text-secondaryText">
                  <li>• Used to standardise colour observation across captures.</li>
                  <li>• Provides fixed known colours for calibration.</li>
                  <li>• Supports alignment and perspective correction.</li>
                  <li>• Helps identify capture quality issues such as glare or misalignment.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-offWhite p-5">
                <h4 className="text-lg font-semibold text-primaryText">How to place it</h4>
                <ul className="mt-4 space-y-3 text-sm text-secondaryText">
                  <li>• Keep the reference colour card fully visible within the capture area.</li>
                  <li>• Ensure the card is flat and aligned with the test reaction.</li>
                  <li>• Keep lighting uniform and avoid glare.</li>
                  <li>• Hold the camera steadily to minimise motion blur.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-secondaryText">
              ArUco markers and calibration guidance are not currently connected in this desktop build. Those stages will be supplied by the future computer-vision module.
            </div>
          </div>
        );
      case 'capture':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Capture</h3>
            </div>

            <CameraCapture
              captureState={workflow.captureState}
              errorMessage={workflow.cameraError}
              capturedImage={workflow.capturedImage}
              capturedData={workflow.capturedData}
              onStateChange={handleCameraStateChange}
              onCapture={handleRealCapture}
              onRetake={handleRealRetake}
              onContinue={handleNext}
            />

            <LocationCaptureCard
              locationState={workflow.locationState}
              locationData={workflow.locationData}
              locationError={workflow.locationError}
              onStateChange={handleLocationStateChange}
              onSuccess={handleLocationSuccess}
            />
          </div>
        );
      case 'review':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-primaryBlue" />
                <h3 className="text-xl font-semibold text-primaryText">Review</h3>
              </div>
              {capturedImage && (
                <button
                  type="button"
                  onClick={() => {
                    handleRealRetake();
                    setWorkflow((current) => ({ ...current, currentStep: 'capture' }));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-primaryText shadow-sm hover:bg-slate-50"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-secondaryText" />
                  Retake Photo
                </button>
              )}
            </div>

            {!capturedImage ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-secondaryText">
                No image is available yet. Complete capture before reviewing the record.
              </div>
            ) : (
              <div className="space-y-4">
                <img
                  src={capturedImage ?? undefined}
                  onError={(e) => {
                    if (workflow.capturedData?.dataUrl && e.currentTarget.src !== workflow.capturedData.dataUrl) {
                      e.currentTarget.src = workflow.capturedData.dataUrl;
                    }
                  }}
                  alt="Captured frame preview"
                  className="max-h-[500px] w-full rounded-2xl border border-slate-200 bg-white object-contain"
                />

                <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                  <div className="mb-2 text-sm font-medium uppercase tracking-[0.12em] text-secondaryText">Available checks</div>
                  <ul className="space-y-2 text-sm text-secondaryText">
                    <li>• Image exists and is available for display.</li>
                    <li>• Capture state is available for review.</li>
                    <li>• Retake is supported without any fake scientific checks.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Analysis</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-offWhite p-5">
              <div className="text-sm font-medium uppercase tracking-[0.12em] text-secondaryText">Pipeline status</div>
              <div className="mt-2 text-base font-medium text-primaryText">{analysisMessage}</div>
            </div>

            <div className="space-y-3">
              {analysisStages.map((stage) => (
                <div key={stage.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-primaryText">{stage.name}</div>
                      <div className="mt-1 text-sm text-secondaryText">{stage.detail}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stage.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : stage.status === 'current' ? 'bg-blue-100 text-blue-700' : stage.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {stage.status === 'completed' ? 'COMPLETED' : stage.status === 'current' ? 'CURRENT' : stage.status === 'pending' ? 'PENDING' : 'UNAVAILABLE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'result':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Result</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-offWhite p-5">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Result status</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  UNAVAILABLE
                </span>
                <span className="text-sm font-medium text-secondaryText">Result not available</span>
              </div>
              <p className="mt-3 text-sm text-secondaryText">
                No analysis has been performed yet. Presumptive field-test outcome states will be populated once the computer-vision and inference pipeline is connected.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-secondaryText">
              Field-test outcome classification is unavailable in the current build. The workflow remains safe and navigable without inventing outcomes.
            </div>
          </div>
        );
      case 'evidence':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Evidence Record</h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Record ID</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordRecordId}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Result</div>
                    <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getResultBadge(evidenceRecordResult)}`}>
                      {evidenceRecordResult}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Configuration</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordConfigurationName}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Configuration version</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordVersion}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Timestamp</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordTimestamp}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Location</div>
                    <div className="mt-1 font-medium text-primaryText">
                      {evidenceRecordState.locationData ? (
                        <div>
                          <div>{evidenceRecordLocation}</div>
                          <div className="mt-1 text-xs text-secondaryText">
                            Acc: ±{Math.round(evidenceRecordState.locationData.accuracy)} m • {new Date(evidenceRecordState.locationData.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        'Unavailable'
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Operator</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordOperator}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Device</div>
                    <div className="mt-1 font-medium text-primaryText">{evidenceRecordDevice}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Captured image</div>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    onError={(e) => {
                      if (workflow.capturedData?.dataUrl && e.currentTarget.src !== workflow.capturedData.dataUrl) {
                        e.currentTarget.src = workflow.capturedData.dataUrl;
                      }
                    }}
                    alt="Evidence preview"
                    className="mt-3 max-h-[420px] w-full rounded-xl border border-slate-200 bg-white object-contain"
                  />
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-secondaryText">
                    No image captured.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.12em] text-secondaryText">Cryptographic fields</div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="rounded-xl bg-offWhite px-3 py-2">
                  <span className="text-secondaryText">SHA-256</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
                <div className="rounded-xl bg-offWhite px-3 py-2">
                  <span className="text-secondaryText">Signature</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
                <div className="rounded-xl bg-offWhite px-3 py-2">
                  <span className="text-secondaryText">Previous record hash</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'provenance':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Blockchain Provenance</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Status</div>
                  <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProvenanceBadge(provenanceStatus)}`}>
                    {provenanceStatus}
                  </div>
                </div>
                <div className="text-right text-sm text-secondaryText">
                  Real blockchain status will be provided by a future backend API.
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-offWhite p-4 text-sm text-secondaryText">
                {provenanceMessage}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Workflow</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">New Test</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-primaryText">Test Workflow</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step, index) => {
            const isActive = step.key === workflow.currentStep;
            const isComplete = index < currentStepIndex;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  isActive
                    ? 'border-primaryBlue bg-blue-50'
                    : isComplete
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-offWhite'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isActive ? 'bg-primaryBlue text-white' : isComplete ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-secondaryText'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`flex-1 text-sm font-medium ${isActive ? 'text-primaryText' : isComplete ? 'text-emerald-700' : 'text-secondaryText'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">{renderStepContent()}</div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Workflow Status</h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Current step</div>
              <div className="mt-1 font-medium text-primaryText">{workflow.currentStep.toUpperCase()}</div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Selected configuration</div>
              <div className="mt-1 font-medium text-primaryText">{selectedConfiguration?.id ?? 'Unavailable'}</div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Capture state</div>
              <div className="mt-1 font-medium text-primaryText">{workflow.captureState?.toUpperCase() ?? 'UNAVAILABLE'}</div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Location state</div>
              <div className="mt-1 font-medium text-primaryText">{workflow.locationState?.toUpperCase() ?? 'UNAVAILABLE'}</div>
              {workflow.locationData && (
                <div className="mt-1 text-xs text-secondaryText font-mono">
                  {workflow.locationData.latitude.toFixed(4)}, {workflow.locationData.longitude.toFixed(4)} (±{Math.round(workflow.locationData.accuracy)}m)
                </div>
              )}
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Result state</div>
              <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getResultBadge(workflow.resultState)}`}>
                {workflow.resultState}
              </div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Provenance</div>
              <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProvenanceBadge(provenanceStatus)}`}>
                {provenanceStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-3 text-sm text-secondaryText">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Unsupported CV, calibration, and blockchain stages remain unavailable in this phase.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={workflow.currentStep === 'configuration'}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-primaryText disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {workflow.currentStep !== 'provenance' && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
