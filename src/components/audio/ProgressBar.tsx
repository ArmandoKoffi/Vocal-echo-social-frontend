import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  onProgressChange: (percent: number) => void;
  showTime?: boolean;
  currentTime: number;
  height: string;
  duration: number;
  progressHeight: string;
  onChange: (value: number) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  onProgressChange,
  showTime = true,
  currentTime,
  duration,
  progressHeight,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Progress
        value={value}
        className={progressHeight}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = ((e.clientX - rect.left) / rect.width) * 100;
          onProgressChange(percent);
        }}
      />

      {showTime && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </>
  );
};

export default ProgressBar;
