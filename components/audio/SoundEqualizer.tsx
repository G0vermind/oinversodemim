"use client";

import React from "react";

interface SoundEqualizerProps {
  isPlaying?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function SoundEqualizer({
  isPlaying = false,
  size = "sm",
  className = "",
  label,
}: SoundEqualizerProps) {
  const heightClass =
    size === "lg" ? "h-5" : size === "md" ? "h-4" : "h-3";
  const barWidth =
    size === "lg" ? "w-[3px]" : size === "md" ? "w-[2.5px]" : "w-[2px]";

  return (
    <span
      role="img"
      aria-label={label || (isPlaying ? "Áudio em reprodução" : "Áudio pausado")}
      className={`inline-flex items-end gap-[2px] ${heightClass} ${className} shrink-0`}
    >
      <span
        className={`${barWidth} rounded-full bg-destaque transition-all duration-300 ${
          isPlaying ? "wave-bar-1 h-full" : "h-[30%]"
        }`}
      />
      <span
        className={`${barWidth} rounded-full bg-destaque transition-all duration-300 ${
          isPlaying ? "wave-bar-2 h-full" : "h-[65%]"
        }`}
      />
      <span
        className={`${barWidth} rounded-full bg-destaque transition-all duration-300 ${
          isPlaying ? "wave-bar-3 h-full" : "h-[40%]"
        }`}
      />
      <span
        className={`${barWidth} rounded-full bg-destaque transition-all duration-300 ${
          isPlaying ? "wave-bar-4 h-full" : "h-[75%]"
        }`}
      />
    </span>
  );
}
