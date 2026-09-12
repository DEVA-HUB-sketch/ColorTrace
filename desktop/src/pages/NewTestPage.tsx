import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Camera, CheckCircle2, CircleDashed, FlaskConical, Image as ImageIcon, ShieldAlert } from 'lucide-react';
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
import type { NewTestResult, NewTestWorkflowStep, WorkflowResultState } from '@/types/newTestWorkflow';

const resultOptions: Array<{ value: NewTestResult; label: string; helper: string }> = [
  { value: 'POSITIVE', label: 'POSITIVE', helper: 'Select a presumptive field-test result state for this workflow.' },
  { value: 'NEGATIVE', label: 'NEGATIVE', helper: 'Select a presumptive field-test result state for this workflow.' },
  { value: 'INCONCLUSIVE', label: 'INCONCLUSIVE', helper: 'Select a presumptive field-test result state for this workflow.' },
];

function createPlaceholderImage(label: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#edf3ff"/>
          <stop offset="100%" stop-color="#dee7ff"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <rect x="110" y="120" width="980" height="660" rx="36" fill="#ffffff" stroke="#c7d4f5" stroke-width="4"/>
      <rect x="180" y="180" width="840" height="520" rx="24" fill="#eff6ff" stroke="#b8c9f6" stroke-width="2"/>
      <circle cx="600" cy="360" r="110" fill="#dfeafe" stroke="#8aa7df" stroke-width="4"/>
      <rect x="242" y="520" width="716" height="80" rx="18" fill="#ffffff" stroke="#c7d4f5" stroke-width="2"/>
      <text x="600" y="420" text-anchor="middle" font-size="70" font-family="Segoe UI, Arial" fill="#1d4ed8" font-weight="700">Captured Frame</text>
      <text x="600" y="566" text-anchor="middle" font-size="32" font-family="Segoe UI, Arial" fill="#334155">${label}</text>
    </svg>
  `)}`;
}

export default function NewTestPage() {
  const [workflow, setWorkflow] = useState(getInitialWorkflowState());

  const currentStepIndex = workflowSteps.findIndex((step) => step.key === workflow.currentStep);
  const selectedConfiguration = useMemo(
    () => getConfigurationById(workflow.selectedConfigurationId),
    [workflow.selectedConfigurationId],
  );

  const canGoNext = useMemo(() => {
    switch (workflow.currentStep) {
      case 'configuration':
        return !!selectedConfiguration;
      case 'instructions':
        return true;
      case 'capture':
        return workflow.captureState === 'captured';
      case 'review':
        return workflow.captureState === 'captured' && !!workflow.capturedImage;
      case 'analysis':
        return true;
      case 'result':
        return workflow.resultState !== 'UNAVAILABLE';
      case 'evidence':
        return workflow.evidenceRecordState.available;
      case 'provenance':
        return false;
      default:
        return false;
    }
  }, [selectedConfiguration, workflow]);

  const updateEvidenceRecord = (nextState = workflow) => {
    const timestamp = nextState.evidenceRecordState.timestamp || new Date().toLocaleString('en-GB', { hour12: false });

    return {
      ...nextState,
      evidenceRecordState: {
        ...nextState.evidenceRecordState,
        available: Boolean(nextState.capturedImage),
        recordId: `CT-${Date.now().toString().slice(-6)}`,
        configurationId: nextState.selectedConfigurationId,
        configurationName: getConfigurationById(nextState.selectedConfigurationId).name,
        version: getConfigurationById(nextState.selectedConfigurationId).version,
        timestamp,
        location: 'Sector A',
        operator: 'Officer 01',
        device: 'LT-400',
        result: nextState.resultState === 'UNAVAILABLE' ? 'UNAVAILABLE' : nextState.resultState,
        image: nextState.capturedImage,
      },
    };
  };

  const handleSelectConfiguration = (configurationId: string) => {
    const config = getConfigurationById(configurationId);

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

  const handleInitializeCamera = () => {
    setWorkflow((current) => ({
      ...current,
      captureState: 'initializing',
    }));

    window.setTimeout(() => {
      setWorkflow((current) => ({
        ...current,
        captureState: 'ready',
      }));
    }, 700);
  };

  const handleCapture = () => {
    setWorkflow((current) => ({
      ...current,
      captureState: 'capturing',
      reviewState: 'not-started',
    }));

    window.setTimeout(() => {
      setWorkflow((current) => ({
        ...current,
        captureState: 'captured',
        reviewState: 'ready',
        capturedImage: createPlaceholderImage('Captured frame'),
      }));
    }, 900);
  };

  const handleRetake = () => {
    setWorkflow((current) => ({
      ...current,
      captureState: 'ready',
      capturedImage: null,
      reviewState: 'not-started',
      evidenceRecordState: {
        ...current.evidenceRecordState,
        image: null,
        available: false,
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

  const handleSelectResult = (result: NewTestResult) => {
    setWorkflow((current) => ({
      ...current,
      resultState: result,
      provenanceState: {
        status: 'UNAVAILABLE',
        message: 'Blockchain provenance is unavailable until the backend API is connected.',
      },
      evidenceRecordState: {
        ...current.evidenceRecordState,
        result,
      },
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

            <div className="grid gap-4">
              {configurationOptions.map((config) => {
                const isSelected = config.id === workflow.selectedConfigurationId;

                return (
                  <button
                    key={config.id}
                    type="button"
                    onClick={() => handleSelectConfiguration(config.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-primaryBlue bg-blue-50 shadow-soft'
                        : 'border-slate-200 bg-offWhite hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.16em] text-secondaryText">Configuration ID</div>
                        <div className="mt-1 text-lg font-semibold text-primaryText">{config.id}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primaryBlue" />}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Name</div>
                        <div className="mt-1 font-medium text-primaryText">{config.name}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Reference configuration</div>
                        <div className="mt-1 font-medium text-primaryText">{config.referenceConfiguration}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Version</div>
                        <div className="mt-1 font-medium text-primaryText">{config.version}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Supported outcome classes</div>
                        <div className="mt-1 font-medium text-primaryText">{config.supportedOutcomeClasses.join(' | ')}</div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-secondaryText">
                      {config.description}
                    </div>
                  </button>
                );
              })}
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
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <Camera className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Capture</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-offWhite p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Camera state</div>
                  <div className="mt-1 text-xl font-semibold text-primaryText">{workflow.captureState.toUpperCase()}</div>
                </div>

                <div className="flex gap-3">
                  {workflow.captureState === 'unavailable' && (
                    <button type="button" onClick={handleInitializeCamera} className="rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white">
                      Initialize camera
                    </button>
                  )}

                  {workflow.captureState === 'ready' && (
                    <button type="button" onClick={handleCapture} className="rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white">
                      Capture frame
                    </button>
                  )}

                  {workflow.captureState === 'captured' && (
                    <button type="button" onClick={handleRetake} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-primaryText">
                      Retake
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-secondaryText">
                {workflow.captureState === 'unavailable' && 'Camera unavailable in the current frontend. No live camera or computer-vision processing is connected yet.'}
                {workflow.captureState === 'initializing' && 'Camera is initializing. The capture layer is currently unavailable in this desktop build.'}
                {workflow.captureState === 'ready' && 'Camera ready. The reference card should remain visible in the frame to support future image-alignment stages.'}
                {workflow.captureState === 'capturing' && 'Capturing frame...'}
                {workflow.captureState === 'captured' && 'Capture completed. Review the frame before continuing to analysis.'}
              </div>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-5">
            <div className="mb-4 flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-primaryBlue" />
              <h3 className="text-xl font-semibold text-primaryText">Review</h3>
            </div>

            {!workflow.capturedImage ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-secondaryText">
                No image is available yet. Complete capture before reviewing the record.
              </div>
            ) : (
              <div className="space-y-4">
                <img src={workflow.capturedImage} alt="Captured frame preview" className="w-full rounded-2xl border border-slate-200 bg-white object-cover" />

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
              <div className="mt-2 text-base font-medium text-primaryText">{workflow.analysisState.message}</div>
            </div>

            <div className="space-y-3">
              {workflow.analysisState.stages.map((stage) => (
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

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="font-semibold">Presumptive field-test result</div>
              <div className="mt-1">This workflow supports presumptive field-test result states. No real scientific analysis engine is connected yet.</div>
            </div>

            <div className="grid gap-4">
              {resultOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectResult(option.value)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    workflow.resultState === option.value
                      ? 'border-primaryBlue bg-blue-50'
                      : 'border-slate-200 bg-offWhite hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-semibold text-primaryText">{option.label}</div>
                    {workflow.resultState === option.value && <CheckCircle2 className="h-5 w-5 text-primaryBlue" />}
                  </div>
                  <div className="mt-2 text-sm text-secondaryText">{option.helper}</div>
                </button>
              ))}
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
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.recordId}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Result</div>
                    <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getResultBadge(workflow.evidenceRecordState.result)}`}>
                      {workflow.evidenceRecordState.result}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Configuration</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.configurationName}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Configuration version</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.version}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Timestamp</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.timestamp}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Location</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.location}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Operator</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.operator}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Device</div>
                    <div className="mt-1 font-medium text-primaryText">{workflow.evidenceRecordState.device}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-offWhite p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Captured image</div>
                {workflow.capturedImage ? (
                  <img src={workflow.capturedImage} alt="Evidence preview" className="mt-3 w-full rounded-xl border border-slate-200 bg-white object-cover" />
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
                  <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProvenanceBadge(workflow.provenanceState.status)}`}>
                    {workflow.provenanceState.status}
                  </div>
                </div>
                <div className="text-right text-sm text-secondaryText">
                  Real blockchain status will be provided by a future backend API.
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-offWhite p-4 text-sm text-secondaryText">
                {workflow.provenanceState.message}
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
              <div className="mt-1 font-medium text-primaryText">{selectedConfiguration.id}</div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Capture state</div>
              <div className="mt-1 font-medium text-primaryText">{workflow.captureState.toUpperCase()}</div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Result state</div>
              <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getResultBadge(workflow.resultState)}`}>
                {workflow.resultState}
              </div>
            </div>
            <div className="rounded-xl bg-offWhite px-3 py-2">
              <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Provenance</div>
              <div className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProvenanceBadge(workflow.provenanceState.status)}`}>
                {workflow.provenanceState.status}
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
