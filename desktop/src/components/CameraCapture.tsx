import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CameraOff,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { CameraState, CapturedImageData } from '@/types/newTestWorkflow';

interface CameraCaptureProps {
  captureState: CameraState;
  errorMessage?: string | null;
  capturedImage: string | null;
  capturedData?: CapturedImageData | null;
  onStateChange: (state: CameraState, error?: string | null) => void;
  onCapture: (data: CapturedImageData) => void;
  onRetake: () => void;
  onContinue: () => void;
}

export default function CameraCapture({
  captureState,
  errorMessage,
  capturedImage,
  capturedData,
  onStateChange,
  onCapture,
  onRetake,
  onContinue,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const [internalError, setInternalError] = useState<string | null>(errorMessage ?? null);

  const displayError = errorMessage || internalError;

  // Safe stream cleanup
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Safe ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch {
        // Safe ignore
      }
    }
  }, []);

  // Initialize and start camera
  const startCamera = useCallback(async () => {
    stopStream();
    setInternalError(null);

    // 1. Check API availability
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      const msg = 'Camera capture is unavailable in this environment.';
      setInternalError(msg);
      onStateChange('UNAVAILABLE', msg);
      return;
    }

    try {
      onStateChange('INITIALIZING', null);

      // 2. Check for available videoinput devices if enumerateDevices is available
      if (typeof navigator.mediaDevices.enumerateDevices === 'function') {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          if (videoDevices.length === 0) {
            const msg = 'No camera is available on this device.';
            setInternalError(msg);
            onStateChange('ERROR', msg);
            return;
          }
        } catch {
          // If enumerateDevices fails due to permissions, proceed to getUserMedia
        }
      }

      onStateChange('REQUESTING_PERMISSION', null);

      // 3. Request real camera media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          facingMode: 'environment',
        },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // Browser autoplay handling
        }
      }

      onStateChange('READY', null);
    } catch (err: unknown) {
      if (!isMountedRef.current) {
        return;
      }

      let userFriendlyMessage =
        'Camera initialization failed. Please verify camera permissions and hardware connection.';

      const errorName = (err as { name?: string })?.name ?? '';

      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        userFriendlyMessage = 'Camera access is required to capture the field-test image.';
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        userFriendlyMessage = 'No camera is available on this device.';
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        userFriendlyMessage = 'The camera is currently being used by another application.';
      } else if (errorName === 'NotSupportedError') {
        userFriendlyMessage = 'Camera capture is unavailable in this environment.';
      }

      setInternalError(userFriendlyMessage);
      onStateChange('ERROR', userFriendlyMessage);
    }
  }, [onStateChange, stopStream]);

  // Start camera on mount if not already captured
  useEffect(() => {
    isMountedRef.current = true;

    if (!capturedImage && captureState !== 'CAPTURED') {
      startCamera();
    }

    return () => {
      isMountedRef.current = false;
      stopStream();
    };
  }, []);

  // When stream changes or video element becomes available in READY state
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [captureState]);

  // Capture frame handler
  const handleCapturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) {
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    if (width === 0 || height === 0) {
      return;
    }

    onStateChange('CAPTURING', null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onStateChange('ERROR', 'Failed to acquire 2D canvas context for frame capture.');
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            onStateChange('ERROR', 'Failed to generate image file from captured frame.');
            return;
          }

          const capturedAt = new Date().toISOString();
          let dataUrl: string | undefined;
          try {
            dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          } catch {
            // Safe ignore
          }

          // Stop active tracks immediately after capture per lifecycle requirement
          stopStream();

          onCapture({
            blob,
            dataUrl,
            capturedAt,
            width,
            height,
          });

          onStateChange('CAPTURED', null);
        },
        'image/jpeg',
        0.95,
      );
    } catch {
      onStateChange('ERROR', 'An unexpected error occurred while capturing the photo frame.');
    }
  }, [onCapture, onStateChange, stopStream]);

  // Retake photo handler
  const handleRetakeClick = useCallback(() => {
    stopStream();
    onRetake();
    startCamera();
  }, [onRetake, startCamera, stopStream]);

  // Format captured timestamp safely
  const formattedCapturedAt = capturedData?.capturedAt
    ? new Date(capturedData.capturedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-offWhite p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-secondaryText">
              Camera Status
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  captureState === 'READY'
                    ? 'animate-pulse bg-emerald-500'
                    : captureState === 'CAPTURED'
                      ? 'bg-blue-600'
                      : captureState === 'ERROR' || captureState === 'UNAVAILABLE'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                }`}
              />
              <span className="text-lg font-bold text-primaryText">
                {captureState || 'UNAVAILABLE'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(captureState === 'ERROR' || captureState === 'UNAVAILABLE') && (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}

            {captureState === 'READY' && (
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                <Camera className="h-4 w-4" />
                Capture Photo
              </button>
            )}

            {captureState === 'CAPTURING' && (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue/70 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <RefreshCw className="h-4 w-4 animate-spin" />
                Capturing...
              </button>
            )}

            {captureState === 'CAPTURED' && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRetakeClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-primaryText shadow-sm transition hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4 text-secondaryText" />
                  Retake
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Viewport & Preview Area */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 shadow-inner">
        {/* State: CAPTURED - Review Mode */}
        {captureState === 'CAPTURED' && capturedImage ? (
          <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center p-4">
            <img
              src={capturedImage}
              onError={(e) => {
                if (capturedData?.dataUrl && e.currentTarget.src !== capturedData.dataUrl) {
                  e.currentTarget.src = capturedData.dataUrl;
                }
              }}
              alt="Captured test frame"
              className="max-h-[500px] w-full rounded-xl object-contain shadow-md"
            />
            <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/80 px-4 py-2.5 text-xs text-slate-300 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium text-white">Image captured successfully.</span>
              </div>
              {formattedCapturedAt && (
                <div>
                  <span className="text-slate-400">Captured at: </span>
                  <span className="font-mono font-medium text-white">{formattedCapturedAt}</span>
                  {capturedData?.width && capturedData?.height && (
                    <span className="ml-2 text-slate-400">
                      ({capturedData.width} × {capturedData.height} px)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : captureState === 'ERROR' || captureState === 'UNAVAILABLE' ? (
          /* State: ERROR or UNAVAILABLE */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center text-slate-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
              {displayError?.toLowerCase().includes('permission') ? (
                <CameraOff className="h-8 w-8" />
              ) : (
                <AlertTriangle className="h-8 w-8" />
              )}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-white">
              {displayError?.toLowerCase().includes('permission')
                ? 'Camera Access Required'
                : 'Camera Unavailable'}
            </h4>
            <p className="mt-2 max-w-md text-sm text-slate-300">{displayError}</p>
            <button
              type="button"
              onClick={startCamera}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : (
          /* State: INITIALIZING, REQUESTING_PERMISSION, READY, CAPTURING */
          <div className="relative flex min-h-[420px] w-full items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full max-h-[560px] w-full object-contain"
            />

            {/* Loading / Initializing Overlay */}
            {(captureState === 'INITIALIZING' || captureState === 'REQUESTING_PERMISSION') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                <RefreshCw className="h-10 w-10 animate-spin text-primaryBlue" />
                <div className="mt-3 text-sm font-medium text-white">
                  {captureState === 'REQUESTING_PERMISSION'
                    ? 'Requesting camera access...'
                    : 'Initializing device camera...'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Please allow access when prompted by the operating system.
                </div>
              </div>
            )}

            {/* Live Camera Viewfinder Overlay */}
            {captureState === 'READY' && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6">
                {/* Top Badge */}
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                    <span>Live Preview</span>
                  </div>
                  <div className="rounded-full bg-slate-900/80 p-2 text-slate-300 backdrop-blur-sm">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Alignment Reticle Box */}
                <div className="relative flex h-[62%] w-[82%] max-w-[560px] items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/5">
                  {/* Four Corner Brackets */}
                  <div className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-primaryBlue rounded-tl-sm" />
                  <div className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-primaryBlue rounded-tr-sm" />
                  <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primaryBlue rounded-bl-sm" />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primaryBlue rounded-br-sm" />

                  {/* Centered Reticle Label */}
                  <div className="rounded-lg bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    Test & Reference Card Target Area
                  </div>
                </div>

                {/* Bottom Overlay Hint */}
                <div className="rounded-full bg-slate-950/75 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-sm">
                  Align the test reaction and reference card within the target area
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Capture Guidance Section */}
      <div className="rounded-2xl border border-slate-200 bg-offWhite p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Sparkles className="h-4 w-4 text-primaryBlue" />
          <span>Capture Guidance</span>
        </div>

        <p className="mt-2 text-sm font-medium text-primaryText">
          Position the test and reference card inside the capture area.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs text-secondaryText">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryBlue" />
            <span>Keep the test and reference card fully visible.</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs text-secondaryText">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryBlue" />
            <span>Avoid glare and strong reflections.</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs text-secondaryText">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryBlue" />
            <span>Hold the camera steady.</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs text-secondaryText">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryBlue" />
            <span>Keep the image in focus.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
