"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "../../lib/site";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  className = "h-8 w-auto object-contain",
  width = 175,
  height = 80,
  priority = false,
}: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span className="font-serif text-lg md:text-xl font-semibold tracking-[0.2em] uppercase text-destaque flex items-center gap-2">
        <span>{SITE_NAME}</span>
      </span>
    );
  }

  return (
    <Image
      src="/brand/logo.png"
      alt={SITE_NAME}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
