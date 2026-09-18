"use client";

import type { VideoSourceType } from "@paideon/contracts";
import { useState, useRef } from "react";

import { cn } from "../../utilities/cn";
import { Button } from "../atoms/Button";

export type VideoFrameAspectRatio = "16/9" | "21/9" | "4/3";

export interface VideoFrameProps {
  src: string;
  source?: VideoSourceType;
  aspectRatio?: VideoFrameAspectRatio;
  posterSrc?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  /** aria-label builder for the play button, receives the video title */
  getPlayLabel?: (title: string) => string;
}

const aspectRatioMap: Record<VideoFrameAspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
};

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/
  )?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}

export function VideoFrame({
  src,
  source = "direct",
  aspectRatio = "16/9",
  posterSrc,
  title,
  className,
  autoPlay = false,
  loop = false,
  getPlayLabel = (t) => `Play ${t}`,
}: VideoFrameProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  let embedUrl = src;
  if (source === "youtube") embedUrl = getYouTubeEmbedUrl(src);
  if (source === "vimeo") embedUrl = getVimeoEmbedUrl(src);

  const isEmbed = source !== "direct";

  const handlePlay = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (isEmbed) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md",
          aspectRatioMap[aspectRatio],
          className
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-surface-deep",
        aspectRatioMap[aspectRatio],
        className
      )}
    >
      {!isPlaying ? (
        <>
          {posterSrc && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${posterSrc})` }}
            />
          )}
          <div className="absolute inset-0 bg-overlay-medium flex items-center justify-center">
            <Button
              onClick={handlePlay}
              variant="ghost"
              size="lg"
              className="rounded-full w-16 h-16 p-0 bg-gold-base/20 backdrop-blur-sm hover:bg-gold-base/40"
              aria-label={getPlayLabel(title)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
            </Button>
          </div>
        </>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={posterSrc}
          controls
          autoPlay
          loop={loop}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
