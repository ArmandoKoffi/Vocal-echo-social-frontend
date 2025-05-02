import React, { useState } from "react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeToggle: () => void;
  onVolumeChange: (values: number[]) => void;
  onToggleMute?: () => void;
  isDragging?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeToggle,
  onVolumeChange,
  isDragging = false,
  setIsDragging,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Select volume icon based on current volume level
  const VolumeIcon = isMuted
    ? VolumeX
    : volume <= 0.25
    ? Volume
    : volume <= 0.65
    ? Volume1
    : Volume2;

  const handleMouseDown = () => {
    if (setIsDragging) {
      setIsDragging(true);
    }
  };

  const handleValueCommit = () => {
    if (setIsDragging) {
      setIsDragging(false);
    }
  };

  return (
    <div
      className={cn("relative flex items-center gap-1", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isDragging && setIsHovered(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 dark:text-gray-400"
        onClick={onVolumeToggle}
      >
        <VolumeIcon size={16} />
      </Button>

      <div
        className={`transition-all overflow-hidden ${
          isHovered || isDragging ? "w-24 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Slider
          value={[volume * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={onVolumeChange}
          onValueCommit={handleValueCommit}
          onMouseDown={handleMouseDown}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
