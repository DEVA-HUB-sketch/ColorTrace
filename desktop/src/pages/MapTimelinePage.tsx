import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AlertTriangle, Compass, MapPin, MapPinOff, X } from 'lucide-react';
import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import { getDemoRecordsForTable } from '@/state/demoData';
import type { TestRecord } from '@/types/testRecord';
import { getResultClasses } from '@/utils/recordUtils';

export type MapUiState =
  | 'LOADING'
  | 'READY_WITH_DATA'
  | 'READY_EMPTY'
  | 'UNAVAILABLE'
  | 'ERROR';

export default function MapTimelinePage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // In the current frontend, getDemoRecordsForTable returns completed records if available (empty [] until backend is connected)
  const records: TestRecord[] = useMemo(() => getDemoRecordsForTable(), []);

  // Filter records that genuinely possess valid location coordinates (defensive optional-data safety)
  const recordsWithLocation = useMemo(() => {
    return records.filter((r): r is TestRecord & { locationData: NonNullable<TestRecord['locationData']> } => {
      return (
        Boolean(r) &&
        Boolean(r.locationData) &&
        typeof r.locationData?.latitude === 'number' &&
        !Number.isNaN(r.locationData.latitude) &&
        typeof r.locationData?.longitude === 'number' &&
        !Number.isNaN(r.locationData.longitude)
      );
    });
  }, [records]);

  // Read map style configuration safely without exposing secrets
  const mapStyleUrl = (import.meta.env.VITE_MAP_STYLE_URL as string | undefined)?.trim();

  // Determine Map UI state
  const mapUiState = useMemo<MapUiState>(() => {
    if (mapError) {
      return 'ERROR';
    }
    if (!mapStyleUrl) {
      return 'UNAVAILABLE';
    }
    if (recordsWithLocation.length === 0) {
      return 'READY_EMPTY';
    }
    return 'READY_WITH_DATA';
  }, [mapError, mapStyleUrl, recordsWithLocation.length]);

  // Initialize MapLibre safely if and only if a genuine mapStyleUrl is configured and data is ready
  useEffect(() => {
    if (mapUiState !== 'READY_WITH_DATA' || !mapContainerRef.current || !mapStyleUrl) {
      return;
    }

    try {
      const firstValid = recordsWithLocation[0];
      const initialCenter: [number, number] = [
        firstValid.locationData.longitude,
        firstValid.locationData.latitude,
      ];

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyleUrl,
        center: initialCenter,
        zoom: 12,
      });

      mapInstanceRef.current = map;

      map.on('error', () => {
        setMapError('Unable to load the map.');
      });

      // Add real markers directly from validated records
      recordsWithLocation.forEach((record) => {
        try {
          const marker = new maplibregl.Marker({ color: '#2563EB' })
            .setLngLat([record.locationData.longitude, record.locationData.latitude])
            .addTo(map);

          marker.getElement().addEventListener('click', () => {
            setSelectedRecord(record);
          });
        } catch {
          // Safe guard against coordinate anomalies
        }
      });

      return () => {
        try {
          map.remove();
        } catch {
          // Safe ignore
        }
        mapInstanceRef.current = null;
      };
    } catch {
      setMapError('Unable to load the map.');
    }
  }, [mapUiState, mapStyleUrl, recordsWithLocation]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Geography</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Map & Timeline</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-primaryText">Record locations</h3>
            {mapUiState === 'UNAVAILABLE' && (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-secondaryText">
                Map unavailable
              </div>
            )}
            {mapUiState === 'READY_EMPTY' && (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-secondaryText">
                No location data
              </div>
            )}
            {mapUiState === 'READY_WITH_DATA' && (
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {recordsWithLocation.length} location{recordsWithLocation.length === 1 ? '' : 's'} mapped
              </div>
            )}
            {mapUiState === 'ERROR' && (
              <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                Map error
              </div>
            )}
            {mapUiState === 'LOADING' && (
              <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-primaryBlue">
                Loading location data...
              </div>
            )}
          </div>

          {/* Map display or graceful empty / unavailable states */}
          {mapUiState === 'UNAVAILABLE' && (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-secondaryText">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <MapPinOff className="h-6 w-6" />
              </div>
              <div className="mt-4 text-lg font-semibold text-primaryText">Map unavailable</div>
              <p className="mt-1 text-sm font-medium text-slate-500">Map configuration is not available.</p>
              <p className="mt-3 max-w-md text-xs text-secondaryText">
                Captured test locations will appear here when location data and map services are available.
              </p>
            </div>
          )}

          {mapUiState === 'READY_EMPTY' && (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-secondaryText">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primaryBlue">
                <Compass className="h-6 w-6" />
              </div>
              <div className="mt-4 text-lg font-semibold text-primaryText">No location data available</div>
              <p className="mt-2 max-w-md text-sm text-secondaryText">
                Captured test locations will appear here when location data is available.
              </p>
            </div>
          )}

          {mapUiState === 'ERROR' && (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-secondaryText">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
              <div className="mt-4 text-lg font-semibold text-rose-800">Unable to load the map.</div>
              <p className="mt-2 max-w-md text-sm text-rose-700">
                Please verify your network connection or map service configuration.
              </p>
            </div>
          )}

          {mapUiState === 'READY_WITH_DATA' && (
            <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-slate-200">
              <div ref={mapContainerRef} className="h-full w-full" />
            </div>
          )}

          {/* Selected record details panel */}
          {selectedRecord && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-offWhite p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primaryBlue" />
                  <span className="font-semibold text-primaryText">
                    Record ID: {selectedRecord.id || 'Unavailable'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-lg p-1 text-secondaryText hover:bg-slate-200"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="uppercase tracking-wider text-secondaryText">Result</div>
                  <div className="mt-1 font-semibold text-primaryText">{selectedRecord.result || 'Unavailable'}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="uppercase tracking-wider text-secondaryText">Operator</div>
                  <div className="mt-1 font-medium text-primaryText">{selectedRecord.operator || 'Unavailable'}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="uppercase tracking-wider text-secondaryText">Coordinates</div>
                  <div className="mt-1 font-mono font-medium text-primaryText">
                    {selectedRecord.locationData?.latitude != null && selectedRecord.locationData?.longitude != null
                      ? `${selectedRecord.locationData.latitude.toFixed(6)}, ${selectedRecord.locationData.longitude.toFixed(6)}`
                      : selectedRecord.location || 'Unavailable'}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="uppercase tracking-wider text-secondaryText">Accuracy / Time</div>
                  <div className="mt-1 font-mono font-medium text-primaryText">
                    {selectedRecord.locationData?.accuracy != null
                      ? `±${Math.round(selectedRecord.locationData.accuracy)} m`
                      : 'Unavailable'}
                    {selectedRecord.locationData?.timestamp
                      ? ` • ${new Date(selectedRecord.locationData.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primaryText">Timeline</h3>
            <span className="text-xs text-secondaryText">
              {records.length} {records.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {records.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-secondaryText">
                <div className="font-semibold text-primaryText">No test activity available</div>
                <p className="mt-1 text-xs">Completed field tests will appear here once records are available.</p>
              </div>
            ) : (
              records.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                const timestampDate =
                  record.timestamp && record.timestamp.length >= 10 ? record.timestamp.slice(0, 10) : 'Unavailable';
                const timestampTime =
                  record.timestamp && record.timestamp.length >= 16 ? record.timestamp.slice(11) : '';

                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition ${
                      isSelected
                        ? 'border-primaryBlue bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 bg-offWhite hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-secondaryText">
                      <span>{timestampDate}</span>
                      {timestampTime && <span>{timestampTime}</span>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-primaryText">{record.id || 'Unavailable'}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getResultClasses(record.result)}`}>
                        {record.result || 'UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-secondaryText">
                      <span>Operator: {record.operator || 'Unavailable'}</span>
                      <span>•</span>
                      <span>
                        Location:{' '}
                        {record.locationData
                          ? `${record.locationData.latitude.toFixed(4)}, ${record.locationData.longitude.toFixed(4)} (±${Math.round(record.locationData.accuracy)}m)`
                          : record.location || 'Unavailable'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <IntegrityStatusBadge status={record.integrityStatus || 'UNAVAILABLE'} type="integrity" />
                      <IntegrityStatusBadge status={record.blockchainStatus || 'UNAVAILABLE'} type="blockchain" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
