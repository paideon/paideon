'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../utilities/cn';
import { Button } from '../atoms/Button';

export interface PhotoCaptureProps {
  /** Called with a square JPEG when a photo is taken or chosen, or null when cleared. */
  onChange: (photo: File | null) => void;
  /** The current photo, shown until a new one is chosen. */
  currentUrl?: string | null;
  /** Largest file accepted, in bytes. A chosen file above it is refused with a message. */
  maxBytes?: number;
  /** Side length of the square that is produced, in pixels. */
  outputSize?: number;
  disabled?: boolean;
  /** Describes the person for the preview's alt text. */
  alt?: string;
  className?: string;
}

const ACCEPT = 'image/jpeg,image/png,image/webp';

/** Cuts the centre square out of an image or video frame and returns a JPEG. */
async function squareJpeg(
  source: CanvasImageSource,
  width: number,
  height: number,
  size: number,
): Promise<File> {
  const side = Math.min(width, height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot prepare photos.');
  context.drawImage(
    source,
    (width - side) / 2,
    (height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9),
  );
  if (!blob) throw new Error('The photo could not be prepared.');
  return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
}

// Take a photo with the camera, or choose a file. Either way the result is a
// square JPEG, so what the person sees in the preview is what gets saved.
// The camera needs a secure page (https or localhost) and the person's OK.
export function PhotoCapture({
  onChange,
  currentUrl = null,
  maxBytes = 5 * 1024 * 1024,
  outputSize = 800,
  disabled = false,
  alt = 'Photo',
  className,
}: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  // Switch the camera off and free the preview link when leaving.
  useEffect(() => stopCamera, [stopCamera]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const accept = (file: File) => {
    setMessage(null);
    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  const startCamera = async () => {
    setMessage(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage('The camera is not available here. Choose a file instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // The <video> exists only after the state change; attach on the next frame.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setMessage(
        'The camera could not be opened. Allow camera access, or choose a file instead.',
      );
    }
  };

  const takePhoto = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    try {
      accept(
        await squareJpeg(
          video,
          video.videoWidth,
          video.videoHeight,
          outputSize,
        ),
      );
      stopCamera();
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPT.split(',').includes(file.type)) {
      setMessage('Use a JPG, PNG or WebP photo.');
      return;
    }
    if (file.size > maxBytes * 4) {
      // Far too large to even open in the browser comfortably.
      setMessage(
        `That file is too large. Use a photo under ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      );
      return;
    }
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
      const result = await squareJpeg(
        bitmap,
        bitmap.width,
        bitmap.height,
        outputSize,
      );
      bitmap.close();
      if (result.size > maxBytes) {
        setMessage(
          `The photo is still above ${Math.round(maxBytes / 1024 / 1024)} MB. Try another.`,
        );
        return;
      }
      accept(result);
    } catch {
      setMessage('That file could not be read as a photo.');
    }
  };

  const shownUrl = previewUrl ?? currentUrl;

  return (
    <div className={cn('flex flex-col gap-space-4', className)}>
      <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-sm border border-border-default bg-surface-deep">
        {cameraOn ? (
          <video
            ref={videoRef}
            muted
            playsInline
            aria-label="Camera preview"
            className="h-full w-full -scale-x-100 object-cover"
          />
        ) : shownUrl ? (
          // Signed photo links and blob: previews are not routed through next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shownUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-space-4 text-center font-body text-body-sm text-text-muted">
            No photo yet
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-space-3">
        {cameraOn ? (
          <>
            <Button type="button" onClick={takePhoto} disabled={disabled}>
              Take photo
            </Button>
            <Button type="button" variant="secondary" onClick={stopCamera}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={startCamera}
              disabled={disabled}
            >
              Use camera
            </Button>
            <label
              className={cn(
                'inline-flex cursor-pointer items-center justify-center rounded-sm border border-green-base bg-surface-base px-space-4 py-space-3 font-body text-label uppercase tracking-label text-text-primary',
                'hover:border-gold-hover hover:text-gold-hover focus-within:ring-2 focus-within:ring-gold-base focus-within:ring-offset-2',
                disabled && 'pointer-events-none opacity-50',
              )}
            >
              Upload
              <input
                type="file"
                accept={ACCEPT}
                disabled={disabled}
                onChange={onFile}
                className="sr-only"
              />
            </label>
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPreviewUrl(null);
                  onChange(null);
                }}
              >
                Discard
              </Button>
            )}
          </>
        )}
      </div>

      {message && (
        <p
          role="alert"
          className="text-center font-body text-caption text-semantic-error-base"
        >
          {message}
        </p>
      )}
    </div>
  );
}

PhotoCapture.displayName = 'PhotoCapture';
