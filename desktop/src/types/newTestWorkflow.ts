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
export type CameraState =
  | 'UNAVAILABLE'
  | 'INITIALIZING'
  | 'REQUESTING_PERMISSION'
  | 'READY'
  | 'CAPTURING'
  | 'CAPTURED'
  | 'ERROR';

export type CaptureState = CameraState;
export type ReviewState = 'not-started' | 'ready' | 'retake' | 'unavailable';
export type LocationState =
  | 'LOCATION_UNAVAILABLE'
  | 'LOCATION_REQUESTING'
  | 'LOCATION_AVAILABLE'
  | 'LOCATION_DENIED'
  | 'LOCATION_ERROR';

export type AnalysisStageStatus = 'completed' | 'current' | 'pending' | 'unavailable';
export type ProvenanceStatus = 'PENDING' | 'UNAVAILABLE' | 'CONFIRMED';

export type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export type CapturedImageData = {
  blob: Blob;
  previewUrl?: string;
  dataUrl?: string;
  capturedAt: string;
  width?: number;
  height?: number;
};

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
  locationData?: LocationData | null;
  operator: string;
  device: string;
  result: WorkflowResultState;
  image: string | null;
};

export type NewTestWorkflowState = {
  selectedConfigurationId: string;
  currentStep: NewTestWorkflowStep;
  captureState: CaptureState;
  cameraError?: string | null;
  locationState: LocationState;
  locationData?: LocationData | null;
  locationError?: string | null;
  capturedImage: string | null;
  capturedData?: CapturedImageData | null;
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
