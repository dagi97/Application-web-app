// components/progress.tsx
import React from "react";

interface ProgressProps {
  value: number;
  step: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  step,
  className = "",
}) => {
  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded ${className}`}>
      <div
        className="absolute top-0 left-0 h-2 bg-[#5f3dc4] rounded"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
