"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";

let apiLoadingPromise: Promise<any> | null = null;

function loadYouTubeAPI(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiLoadingPromise) return apiLoadingPromise;
  apiLoadingPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    if (!document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`)) {
      const tag = document.createElement("script");
      tag.src = YOUTUBE_API_SRC;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  });
  return apiLoadingPromise;
}

export type PlayerState = "unstarted" | "ended" | "playing" | "paused" | "buffering" | "cued" | "unknown";

export interface UseYouTubePlayerOptions {
  videoId: string;
  onTimeUpdate?: (currentSeconds: number, durationSeconds: number) => void;
  onStateChange?: (state: PlayerState) => void;
  onEnded?: () => void;
  timeUpdateIntervalMs?: number;
}

export function useYouTubePlayer({ videoId, onTimeUpdate, onStateChange, onEnded, timeUpdateIntervalMs = 5000 }: UseYouTubePlayerOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            const d = event.target.getDuration();
            setDuration(d || 0);
            setReady(true);
          },
          onStateChange: (event: any) => {
            const state: PlayerState =
              event.data === YT.PlayerState.ENDED
                ? "ended"
                : event.data === YT.PlayerState.PLAYING
                ? "playing"
                : event.data === YT.PlayerState.PAUSED
                ? "paused"
                : event.data === YT.PlayerState.BUFFERING
                ? "buffering"
                : event.data === YT.PlayerState.CUED
                ? "cued"
                : "unstarted";
            onStateChange?.(state);
            if (state === "ended") onEnded?.();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) return;
      try {
        const current = player.getCurrentTime();
        const total = player.getDuration() || duration;
        onTimeUpdate?.(current, total);
      } catch {
        // player ainda carregando
      }
    }, timeUpdateIntervalMs);
    return () => clearInterval(interval);
  }, [ready, duration, timeUpdateIntervalMs, onTimeUpdate]);

  return { containerRef, player: playerRef, ready, duration };
}
