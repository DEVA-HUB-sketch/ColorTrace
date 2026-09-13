import { useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Compass, MapPin, MapPinOff, RefreshCw } from 'lucide-react';
import type { LocationData, LocationState } from '@/types/newTestWorkflow';

interface LocationCaptureCardProps {
  locationState: LocationState;
  locationData?: LocationData | null;
  locationError?: string | null;
  onStateChange: (state: LocationState, error?: string | null) => void;
  onSuccess: (data: LocationData) => void;
}

export default function LocationCaptureCard({
  locationState,
  locationData,
  locationError,
  onStateChange,
  onSuccess,
}: LocationCaptureCardProps) {
  const handleRequestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
      const msg = 'Location data is unavailable on this device.';
      onStateChange('LOCATION_UNAVAILABLE', msg);
      return;
    }

    onStateChange('LOCATION_REQUESTING', null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!position || !position.coords) {
          const msg = 'Unable to determine the current location.';
          onStateChange('LOCATION_UNAVAILABLE', msg);
          return;
        }

        const data: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now(),
        };

        onSuccess(data);
        onStateChange('LOCATION_AVAILABLE', null);
      },
      (error) => {
        let msg = 'Unable to determine the current location.';

        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. Location data will remain unavailable for this test.';
          onStateChange('LOCATION_DENIED', msg);
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Unable to determine the current location. Location data is unavailable on this device.';
          onStateChange('LOCATION_UNAVAILABLE', msg);
          return;
        }

        if (error.code === error.TIMEOUT) {
          msg = 'Location acquisition timed out. Please verify device GPS or location settings and try again.';
          onStateChange('LOCATION_ERROR', msg);
          return;
        }

        onStateChange('LOCATION_ERROR', msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, [onStateChange, onSuccess]);

  // Format accuracy cleanly
  const formattedAccuracy =
    typeof locationData?.accuracy === 'number' && !Number.isNaN(locationData.accuracy)
      ? `±${Math.round(locationData.accuracy)} m`
      : 'Unavailable';

  // Format location timestamp
  const formattedTimestamp = locationData?.timestamp
    ? new Date(locationData.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <div className="rounded-2xl border border-slate-200 bg-offWhite p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primaryBlue">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-secondaryText">
              Location Access
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  locationState === 'LOCATION_AVAILABLE'
                    ? 'bg-emerald-500'
                    : locationState === 'LOCATION_REQUESTING'
                      ? 'animate-pulse bg-amber-500'
                      : locationState === 'LOCATION_DENIED'
                        ? 'bg-rose-500'
                        : locationState === 'LOCATION_ERROR'
                          ? 'bg-amber-600'
                          : 'bg-slate-400'
                }`}
              />
              <span className="text-base font-bold text-primaryText">
                {locationState === 'LOCATION_AVAILABLE'
                  ? 'AVAILABLE'
                  : locationState === 'LOCATION_REQUESTING'
                    ? 'REQUESTING'
                    : locationState === 'LOCATION_DENIED'
                      ? 'DENIED'
                      : locationState === 'LOCATION_ERROR'
                        ? 'ERROR'
                        : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {locationState === 'LOCATION_REQUESTING' && (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue/70 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4 animate-spin" />
              Acquiring position...
            </button>
          )}

          {locationState === 'LOCATION_AVAILABLE' && (
            <button
              type="button"
              onClick={handleRequestLocation}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-primaryText shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4 text-secondaryText" />
              Refresh Location
            </button>
          )}

          {locationState !== 'LOCATION_AVAILABLE' && locationState !== 'LOCATION_REQUESTING' && (
            <button
              type="button"
              onClick={handleRequestLocation}
              className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <MapPin className="h-4 w-4" />
              {locationState === 'LOCATION_DENIED' || locationState === 'LOCATION_ERROR' ? 'Try Again' : 'Allow Location'}
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-secondaryText">
        Allow location access to associate the field test with its capture position.
      </p>

      {/* State: LOCATION_AVAILABLE - Display actual coordinates */}
      {locationState === 'LOCATION_AVAILABLE' && locationData && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Position acquired from device GPS</span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg bg-offWhite p-2.5">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Latitude</div>
              <div className="mt-1 font-mono font-medium text-primaryText">
                {typeof locationData.latitude === 'number' ? locationData.latitude.toFixed(6) : 'Unavailable'}
              </div>
            </div>
            <div className="rounded-lg bg-offWhite p-2.5">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Longitude</div>
              <div className="mt-1 font-mono font-medium text-primaryText">
                {typeof locationData.longitude === 'number' ? locationData.longitude.toFixed(6) : 'Unavailable'}
              </div>
            </div>
            <div className="rounded-lg bg-offWhite p-2.5">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Accuracy</div>
              <div className="mt-1 font-mono font-medium text-primaryText">{formattedAccuracy}</div>
            </div>
            <div className="rounded-lg bg-offWhite p-2.5">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Acquired At</div>
              <div className="mt-1 font-mono font-medium text-primaryText">{formattedTimestamp || 'Unavailable'}</div>
            </div>
          </div>
        </div>
      )}

      {/* State: LOCATION_DENIED */}
      {locationState === 'LOCATION_DENIED' && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm">
          <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <div className="font-semibold text-rose-800">Location access was denied.</div>
            <div className="mt-1 text-xs text-rose-700">
              {locationError || 'Location data will remain unavailable for this test.'}
            </div>
          </div>
        </div>
      )}

      {/* State: LOCATION_UNAVAILABLE or LOCATION_ERROR */}
      {(locationState === 'LOCATION_UNAVAILABLE' || locationState === 'LOCATION_ERROR') && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-secondaryText">
          {locationError ? (
            <div className="flex items-start gap-2 text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>{locationError}</span>
            </div>
          ) : (
            'Location data is unavailable on this device. You can proceed with the capture workflow or grant location access above.'
          )}
        </div>
      )}
    </div>
  );
}
