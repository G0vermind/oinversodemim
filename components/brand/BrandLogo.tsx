"use client";

import Image from "next/image";
import { SITE_NAME } from "../../lib/site";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  className = "h-8 sm:h-9 w-auto object-contain",
  width = 1024,
  height = 467,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/logo-oficial.png"
      alt={`${SITE_NAME} — Heldemarcio Ferreira`}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`${className} transition-transform duration-300 hover:scale-[1.02]`}
    />
  );
}
