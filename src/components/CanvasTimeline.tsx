import React, { useEffect, useRef } from "react";
import { TranscriptSegment } from "./InteractiveTranscript";

interface CanvasTimelineProps {
  segments: TranscriptSegment[];
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export default function CanvasTimeline({ segments, currentTime, duration, onSeek }: CanvasTimelineProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw();
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = "#f3f0ff"; // light purple-ish
      ctx.fillRect(0, 0, w, h);

      if (!duration || duration <= 0) return;

      // draw segments
      segments.forEach((s) => {
        const x1 = Math.round((s.startTime / duration) * w);
        const x2 = Math.round((s.endTime / duration) * w);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x1, 0, Math.max(1, x2 - x1), h);
        ctx.strokeStyle = "rgba(128, 90, 213, 0.25)"; // purple border
        ctx.lineWidth = Math.max(1, dpr);
        ctx.strokeRect(x1 + 0.5, 0.5, Math.max(1, x2 - x1 - 1), h - 1);
      });

      // overlay progress
      const playX = Math.round(((currentTime || 0) / duration) * w);
      ctx.fillStyle = "rgba(99, 102, 241, 0.12)";
      ctx.fillRect(0, 0, playX, h);

      // playhead line
      ctx.strokeStyle = "#6d28d9";
      ctx.lineWidth = Math.max(1, Math.ceil(dpr));
      ctx.beginPath();
      ctx.moveTo(playX + 0.5, 0);
      ctx.lineTo(playX + 0.5, h);
      ctx.stroke();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    return () => {
      ro.disconnect();
    };
  }, [segments, currentTime, duration]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const onClick = (ev: MouseEvent) => {
      if (!duration || duration <= 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const t = (x / rect.width) * duration;
      onSeek?.(Math.max(0, Math.min(duration, t)));
    };
    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [duration, onSeek]);

  return (
    <canvas
      ref={ref}
      width={747}
      height={20}
      style={{ width: "100%", height: 20, borderRadius: 6, display: "block" }}
      aria-label="timeline"
    />
  );
}
