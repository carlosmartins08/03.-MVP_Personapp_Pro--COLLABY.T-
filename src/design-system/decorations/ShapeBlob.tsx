import React from "react";

interface ShapeBlobProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

export function ShapeBlob({
  color = "#3055A4",
  size = 200,
  opacity = 0.08,
  className = "",
}: ShapeBlobProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M44.7,-76.4C58.3,-69.1,70.1,-58.2,78.3,-44.8C86.5,-31.4,91.2,-15.7,89.7,-0.9C88.2,13.9,80.6,27.8,71.3,39.5C62,51.2,51,60.7,38.6,68.1C26.2,75.5,13.1,80.8,-0.8,82C-14.7,83.2,-29.4,80.3,-42.3,73.3C-55.2,66.3,-66.3,55.2,-73.8,41.8C-81.3,28.4,-85.2,12.7,-83.6,-2.3C-82,-17.3,-74.9,-31.6,-65.4,-43.5C-55.9,-55.4,-44,-64.9,-31,-71.3C-18,-77.7,-4,-81,9.8,-79.8C23.6,-78.6,31.1,-83.7,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
