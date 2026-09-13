export type NewTestWorkflowStep =
  | 'configuration'
  | 'instructions'
  | 'capture'
  | 'review'
  | 'analysis'
  | 'result'
  | 'evidence'
  | 'provenance';

export type NewTestResult = 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE';
export type WorkflowResultState = NewTestResult | 'UNAVAILABLE';
export type CaptureState = 'unavailable' | 'initializing' | 'ready' | 'capturing' | 'captured' | 'retake';
export type ReviewState = 'not-started' | 'ready' | 'retake' | 'unavailable';
export type LocationState = 'unavailable' | 'ready' | 'denied';
export type AnalysisStageStatus = 'completed' | 'current' | 'pending' | 'unavailable';
export type ProvenanceStatus = 'PENDING' | 'UNAVAILABLE' | 'CONFIRMED';

export type ConfigurationOption = {
  id: string;
  name: string;
  referenceConfiguration: string;
  version: string;
  supportedOutcomeClasses: NewTestResult[];
  description: string;
};

export type AnalysisStage = {
  name: string;
  detail: string;
  status: AnalysisStageStatus;
};

export type EvidenceRecordState = {
  available: boolean;
  recordId: string;
  configurationId: string;
  configurationName: string;
  version: string;
  timestamp: string;
  location: string;
  operator: string;
  device: string;
  result: WorkflowResultState;
  image: string | null;
};

export type NewTestWorkflowState = {
  selectedConfigurationId: string;
  currentStep: NewTestWorkflowStep;
  captureState: CaptureState;
  locationState: LocationState;
  capturedImage: string | null;
  reviewState: ReviewState;
  analysisState: {
    available: boolean;
    message: string;
    stages: AnalysisStage[];
  };
  resultState: WorkflowResultState;
  evidenceRecordState: EvidenceRecordState;
  provenanceState: {
    status: ProvenanceStatus;
    message: string;
  };
};
