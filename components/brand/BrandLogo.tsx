"use client";

import { SITE_NAME } from "../../lib/site";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  className = "h-8 w-auto object-contain",
}: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 340 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${SITE_NAME} — Santuário Poético`}
      role="img"
    >
      <defs>
        <linearGradient id="gold-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5EFE6" />
          <stop offset="35%" stopColor="#C9A24B" />
          <stop offset="70%" stopColor="#DE9E58" />
          <stop offset="100%" stopColor="#9E7634" />
        </linearGradient>
      </defs>

      {/* Mirrored Central Flourish */}
      <g transform="translate(170, 16)" fill="url(#gold-brand-grad)">
        <path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" />
        <circle cx="-24" cy="0" r="1.5" opacity="0.8" />
        <circle cx="24" cy="0" r="1.5" opacity="0.8" />
        <path d="M-45 0 L-28 0" stroke="url(#gold-brand-grad)" strokeWidth="0.8" opacity="0.6" />
        <path d="M28 0 L45 0" stroke="url(#gold-brand-grad)" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* Main Title: O INVERSO DE MIM */}
      <text
        x="170"
        y="42"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'EB Garamond', Georgia, serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="0.22em"
        fill="url(#gold-brand-grad)"
        style={{ textTransform: "uppercase" }}
      >
        O Inverso de Mim
      </text>

      {/* Subtitle: SANTUÁRIO POÉTICO */}
      <text
        x="170"
        y="58"
        textAnchor="middle"
        fontFamily="'EB Garamond', Georgia, serif"
        fontSize="8.5"
        fontStyle="italic"
        letterSpacing="0.32em"
        fill="currentColor"
        opacity="0.85"
      >
        ✦ SANTUÁRIO POÉTICO ✦
      </text>
    </svg>
  );
}
