"use client";

import { useEffect, useState } from "react";
import { useYouTubePlayer, type PlayerState } from "@/hooks/use-youtube-player";
import { cn } from "@/lib/utils";

interface YouTubePlayerProps {
  videoId: string;
  className?: string;
  onProgress?: (currentSeconds: number, durationSeconds: number, percent: number) => void;
  onEnded?: () => void;
  onStateChange?: (state: PlayerState) => void;
  thresholdPercent?: number;
}

export function YouTubePlayer({ videoId, className, onProgress, onEnded, onStateChange, thresholdPercent = 95 }: YouTubePlayerProps) {
  const { containerRef, ready, duration } = useYouTubePlayer({
    videoId,
    onTimeUpdate: (current, total) => {
      if (total > 0) {
        const percent = Math.min(100, (current / total) * 100);
        onProgress?.(current, total, percent);
      }
    },
    onStateChange,
    onEnded,
  });
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return () => {
      // cleanup é feito no hook
    };
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-primary-dark">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 body-md">
            Carregando player...
          </div>
        )}
      </div>
      {duration > 0 && (
        <div className="flex items-center justify-between text-body-sm text-text-light">
          <span>{Math.round(percent)}% assistido · {duration > 0 && `${Math.round(duration / 60)} min`}</span>
          <span>Concluído em {thresholdPercent}%</span>
        </div>
      )}
    </div>
  );
}
