import type {
  AnalysisStage,
  ConfigurationOption,
  NewTestWorkflowState,
  NewTestWorkflowStep,
  ProvenanceStatus,
  WorkflowResultState,
  WorkflowSubmissionState,
} from '@/types/newTestWorkflow';

import {
  getConfigurationById,
  getConfigurationOptions,
  getDefaultConfiguration,
} from '@/services/configurationService';

export const workflowSteps: { key: NewTestWorkflowStep; label: string }[] = [
  { key: 'configuration', label: 'Configuration' },
  { key: 'instructions', label: 'Instructions' },
  { key: 'capture', label: 'Capture' },
  { key: 'review', label: 'Review' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'result', label: 'Result' },
  { key: 'evidence', label: 'Evidence Record' },
  { key: 'provenance', label: 'Blockchain Provenance' },
];

export const configurationOptions: ConfigurationOption[] = getConfigurationOptions();

export { getConfigurationById };

export const defaultAnalysisStages: AnalysisStage[] = [
  { name: 'Image', detail: 'Image received and queued for the analysis pipeline.', status: 'completed' },
  { name: 'ArUco', detail: 'Future CV module will supply marker detection results.', status: 'unavailable' },
  { name: 'Homography', detail: 'Future CV module will supply spatial alignment data.', status: 'unavailable' },
  { name: 'Colour Calibration', detail: 'Future calibration stage will be connected once the module is available.', status: 'unavailable' },
  { name: 'Calibration Gate', detail: 'Frontend gate is present; real calibration outcomes are not yet available.', status: 'unavailable' },
  { name: 'CIELAB', detail: 'Colour-space measurements are not yet implemented in this frontend.', status: 'unavailable' },
  { name: 'Delta E00', detail: 'Scientific comparison metric is not yet implemented in this frontend.', status: 'unavailable' },
  { name: 'LightGBM', detail: 'Model inference is not yet connected.', status: 'unavailable' },
  { name: 'Conformal Abstention', detail: 'Abstention logic is not yet connected.', status: 'unavailable' },
  { name: 'Result', detail: 'Result will be surfaced once the future analysis pipeline is available.', status: 'pending' },
];

export function getInitialWorkflowState(): NewTestWorkflowState {
  const firstConfiguration = getDefaultConfiguration();

  return {
    selectedConfigurationId: firstConfiguration?.id ?? '',
    selectedConfiguration: firstConfiguration ?? null,
    currentStep: 'configuration',
    captureState: 'UNAVAILABLE',
    cameraError: null,
    locationState: 'LOCATION_UNAVAILABLE',
    locationData: null,
    locationError: null,
    capturedImage: null,
    capturedData: null,
    reviewState: 'not-started',
    analysisState: {
      available: false,
      message: 'Analysis is unavailable in the current frontend because the CV and model pipeline is not connected yet.',
      stages: defaultAnalysisStages,
    },
    resultState: 'UNAVAILABLE',
    evidenceRecordState: {
      available: false,
      recordId: 'Unavailable',
      configurationId: firstConfiguration?.id ?? '',
      configurationName: firstConfiguration?.name ?? 'Unavailable',
      version: firstConfiguration?.version ?? 'Unavailable',
      timestamp: 'Unavailable',
      location: 'Unavailable',
      locationData: null,
      operator: 'Unavailable',
      device: 'Unavailable',
      result: 'UNAVAILABLE',
      image: null,
    },
    provenanceState: {
      status: 'UNAVAILABLE',
      message: 'Blockchain provenance is not yet connected to a backend API.',
    },
    submissionState: 'SUBMISSION_UNAVAILABLE',
    submissionMessage: 'Submission unavailable. Connect to the backend service before submitting this test record.',
  };
}

export function getNextStep(currentStep: NewTestWorkflowStep): NewTestWorkflowStep {
  const stepIndex = workflowSteps.findIndex((step) => step.key === currentStep);
  return workflowSteps[Math.min(stepIndex + 1, workflowSteps.length - 1)].key;
}

export function getPreviousStep(currentStep: NewTestWorkflowStep): NewTestWorkflowStep {
  const stepIndex = workflowSteps.findIndex((step) => step.key === currentStep);
  return workflowSteps[Math.max(stepIndex - 1, 0)].key;
}

export function getResultBadge(result: WorkflowResultState) {
  if (result === 'POSITIVE') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (result === 'NEGATIVE') {
    return 'bg-sky-100 text-sky-700';
  }

  if (result === 'INCONCLUSIVE') {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-slate-100 text-slate-600';
}

export function getProvenanceBadge(status: ProvenanceStatus) {
  if (status === 'CONFIRMED') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (status === 'PENDING') {
    return 'bg-violet-100 text-violet-700';
  }

  return 'bg-slate-100 text-slate-600';
}

export function getSubmissionBadge(status: WorkflowSubmissionState) {
  if (status === 'SUBMITTED') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (status === 'SUBMITTING') {
    return 'bg-violet-100 text-violet-700';
  }

  if (status === 'SUBMISSION_FAILED') {
    return 'bg-rose-100 text-rose-700';
  }

  return 'bg-slate-100 text-slate-600';
}
