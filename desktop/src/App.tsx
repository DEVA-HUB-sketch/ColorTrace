import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewTestPage from './pages/NewTestPage';
import TestRecordsPage from './pages/TestRecordsPage';
import MapTimelinePage from './pages/MapTimelinePage';
import IntegrityAuditPage from './pages/IntegrityAuditPage';
import BlockchainVerificationPage from './pages/BlockchainVerificationPage';
import SyncStatusPage from './pages/SyncStatusPage';
import ReferenceGuidePage from './pages/ReferenceGuidePage';
import SettingsPage from './pages/SettingsPage';
import RecordDetailsPage from './pages/RecordDetailsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="new-test" element={<NewTestPage />} />
        <Route path="records" element={<TestRecordsPage />} />
        <Route path="test-records" element={<TestRecordsPage />} />
        <Route path="records/:recordId" element={<RecordDetailsPage />} />
        <Route path="test-records/:recordId" element={<RecordDetailsPage />} />
        <Route path="map" element={<MapTimelinePage />} />
        <Route path="timeline" element={<MapTimelinePage />} />
        <Route path="map-timeline" element={<MapTimelinePage />} />
        <Route path="audit" element={<IntegrityAuditPage />} />
        <Route path="integrity-audit" element={<IntegrityAuditPage />} />
        <Route path="verify" element={<BlockchainVerificationPage />} />
        <Route path="blockchain-verification" element={<BlockchainVerificationPage />} />
        <Route path="sync" element={<SyncStatusPage />} />
        <Route path="sync-status" element={<SyncStatusPage />} />
        <Route path="reference-guide" element={<ReferenceGuidePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
