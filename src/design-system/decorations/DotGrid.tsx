import React from "react";

interface DotGridProps {
  color?: string;
  opacity?: number;
  cols?: number;
  rows?: number;
  gap?: number;
  className?: string;
}

export function DotGrid({
  color = "#3055A4",
  opacity = 0.08,
  cols = 6,
  rows = 4,
  gap = 16,
  className = "",
}: DotGridProps) {
  const dots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + gap / 2}
          cy={r * gap + gap / 2}
          r="1.5"
          fill={color}
        />
      );
    }
  }

  return (
    <svg
      width={cols * gap}
      height={rows * gap}
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}
