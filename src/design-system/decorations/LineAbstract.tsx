import React from "react";

interface LineAbstractProps {
  color?: string;
  opacity?: number;
  className?: string;
}

export function LineAbstract({
  color = "#3055A4",
  opacity = 0.12,
  className = "",
}: LineAbstractProps) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M10 70 Q30 10 60 40 Q90 70 110 20"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 50 Q40 20 70 45 Q95 65 110 40"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
