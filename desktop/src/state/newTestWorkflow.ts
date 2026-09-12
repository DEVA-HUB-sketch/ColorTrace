import type {
  AnalysisStage,
  ConfigurationOption,
  NewTestWorkflowState,
  NewTestWorkflowStep,
  ProvenanceStatus,
  WorkflowResultState,
} from '@/types/newTestWorkflow';

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

export const configurationOptions: ConfigurationOption[] = [
  {
    id: 'CFG-DEMO-01',
    name: 'Reference configuration',
    referenceConfiguration: 'Reference configuration',
    version: 'v1.0.0',
    supportedOutcomeClasses: ['POSITIVE', 'NEGATIVE', 'INCONCLUSIVE'],
    description: 'Shared reference configuration for the desktop workflow.',
  },
  {
    id: 'CFG-DEMO-02',
    name: 'Field operations configuration',
    referenceConfiguration: 'Reference configuration',
    version: 'v1.1.0',
    supportedOutcomeClasses: ['POSITIVE', 'NEGATIVE', 'INCONCLUSIVE'],
    description: 'Alternative reference configuration for future backend-supported presets.',
  },
];

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

export function getConfigurationById(configurationId: string) {
  return configurationOptions.find((configuration) => configuration.id === configurationId) ?? configurationOptions[0];
}

export function getInitialWorkflowState(): NewTestWorkflowState {
  return {
    selectedConfigurationId: configurationOptions[0].id,
    currentStep: 'configuration',
    captureState: 'unavailable',
    capturedImage: null,
    reviewState: 'not-started',
    analysisState: {
      available: false,
      message: 'Analysis is unavailable in the current frontend because the CV and model pipeline is not connected yet.',
      stages: defaultAnalysisStages,
    },
    resultState: 'UNAVAILABLE',
    evidenceRecordState: {
      available: false,
      recordId: 'CT-NEW',
      configurationId: configurationOptions[0].id,
      configurationName: configurationOptions[0].name,
      version: configurationOptions[0].version,
      timestamp: '',
      location: 'LOCATION UNAVAILABLE',
      operator: 'Officer 01',
      device: 'LT-400',
      result: 'UNAVAILABLE',
      image: null,
    },
    provenanceState: {
      status: 'UNAVAILABLE',
      message: 'Blockchain provenance is not yet connected to a backend API.',
    },
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
