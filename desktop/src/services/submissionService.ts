import type { WorkflowSubmissionState } from '@/types/newTestWorkflow';

// TODO: Connect to the authoritative backend test submission endpoint when the API contract is available.
// Do not invent endpoints, request payloads, response structures, or fake record IDs.

export interface TestSubmissionResponse {
  success: boolean;
  status: WorkflowSubmissionState;
  message: string;
}

/**
 * Service boundary for submitting completed test records.
 * Currently returns SUBMISSION_UNAVAILABLE because the backend evidence service is not connected.
 */
export async function submitTestRecord(): Promise<TestSubmissionResponse> {
  return {
    success: false,
    status: 'SUBMISSION_UNAVAILABLE',
    message: 'Submission unavailable. Connect to the backend service before submitting this test record.',
  };
}
