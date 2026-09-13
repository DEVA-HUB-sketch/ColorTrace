import { useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Compass, Info, MapPin, MapPinOff, RefreshCw } from 'lucide-react';
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
    if (
      typeof navigator === 'undefined' ||
      !navigator.geolocation ||
      typeof navigator.geolocation.getCurrentPosition !== 'function'
    ) {
      const msg = 'Location services are unavailable on this device or environment.';
      onStateChange('LOCATION_UNAVAILABLE', msg);
      return;
    }

    onStateChange('LOCATION_REQUESTING', null);

    if (import.meta.env.DEV) {
      console.debug('[LocationCapture] User requested device location via navigator.geolocation');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!position || !position.coords) {
          const msg = 'Unable to determine the current location. Location data is unavailable.';
          if (import.meta.env.DEV) {
            console.debug('[LocationCapture] Received position without coords');
          }
          onStateChange('LOCATION_UNAVAILABLE', msg);
          return;
        }

        const data: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now(),
        };

        if (import.meta.env.DEV) {
          console.debug('[LocationCapture] Position successfully acquired (accuracy: ±' + Math.round(data.accuracy) + 'm)');
        }

        onSuccess(data);
        onStateChange('LOCATION_AVAILABLE', null);
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.debug('[LocationCapture] GeolocationPositionError encountered:', {
            code: error.code,
            message: error.message,
          });
        }

        if (error.code === error.PERMISSION_DENIED) {
          const msg =
            'Location permission was denied. Please enable location permission in Windows settings and application preferences.';
          onStateChange('LOCATION_DENIED', msg);
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          const msg =
            'Windows and Electron could not determine a device position. Please verify that Windows Location Services are enabled.';
          onStateChange('LOCATION_UNAVAILABLE', msg);
          return;
        }

        if (error.code === error.TIMEOUT) {
          const msg =
            'Obtaining the device location timed out. Please check your GPS or network signal and try again.';
          onStateChange('LOCATION_ERROR', msg);
          return;
        }

        const msg = 'Unable to determine the current location. Location data is unavailable.';
        onStateChange('LOCATION_UNAVAILABLE', msg);
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
              {locationState === 'LOCATION_DENIED' ||
              locationState === 'LOCATION_ERROR' ||
              Boolean(locationError)
                ? 'Try Again'
                : 'Allow Location'}
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-secondaryText">
        Allow location access to associate the field test with its capture position.
      </p>

      {/* State: LOCATION_AVAILABLE - Display actual coordinates */}
      {locationState === 'LOCATION_AVAILABLE' && locationData && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Position acquired from device GPS</span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg border border-slate-100 bg-offWhite p-2.5 dark:border-slate-700/60">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Latitude</div>
              <div className="mt-1 font-mono font-semibold text-primaryText">
                {typeof locationData.latitude === 'number' && !Number.isNaN(locationData.latitude)
                  ? locationData.latitude.toFixed(6)
                  : 'Unavailable'}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-offWhite p-2.5 dark:border-slate-700/60">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Longitude</div>
              <div className="mt-1 font-mono font-semibold text-primaryText">
                {typeof locationData.longitude === 'number' && !Number.isNaN(locationData.longitude)
                  ? locationData.longitude.toFixed(6)
                  : 'Unavailable'}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-offWhite p-2.5 dark:border-slate-700/60">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Accuracy</div>
              <div className="mt-1 font-mono font-semibold text-primaryText">{formattedAccuracy}</div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-offWhite p-2.5 dark:border-slate-700/60">
              <div className="text-xs uppercase tracking-wider text-secondaryText">Acquired At</div>
              <div className="mt-1 font-mono font-semibold text-primaryText">{formattedTimestamp || 'Unavailable'}</div>
            </div>
          </div>
        </div>
      )}

      {/* State: LOCATION_DENIED */}
      {locationState === 'LOCATION_DENIED' && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-900/60 dark:bg-rose-950/30">
          <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
          <div className="space-y-1">
            <div className="font-semibold text-rose-800 dark:text-rose-300">Location permission was denied.</div>
            <div className="text-xs text-rose-700 dark:text-rose-200">
              {locationError ||
                'Location permission was denied. Please enable location permission in Windows settings and application preferences to allow position capture.'}
            </div>
          </div>
        </div>
      )}

      {/* State: LOCATION_ERROR (e.g. TIMEOUT) */}
      {locationState === 'LOCATION_ERROR' && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/60 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-800 dark:text-amber-300">Location acquisition timed out.</div>
            <div className="text-xs text-amber-700 dark:text-amber-200">
              {locationError ||
                'Obtaining the device location timed out. Please check your GPS or network connection and click Try Again.'}
            </div>
          </div>
        </div>
      )}

      {/* State: LOCATION_UNAVAILABLE */}
      {locationState === 'LOCATION_UNAVAILABLE' && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-secondaryText dark:border-slate-700/80">
          {locationError ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                <span className="font-semibold text-primaryText">{locationError}</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Windows could not determine the device location. Check Windows Location Services and try again.</span>
              </div>
            </div>
          ) : (
            'Location data has not been captured yet. Click "Allow Location" to associate coordinates with this test, or proceed with the capture workflow without location.'
          )}
        </div>
      )}
    </div>
  );
}
