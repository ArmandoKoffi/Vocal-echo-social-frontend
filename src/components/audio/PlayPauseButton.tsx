import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size: string;
  iconSize: number;
  isLoading: boolean;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
  size,
  iconSize,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className={`rounded-full bg-voicify-orange hover:bg-voicify-orange/90 text-white flex items-center justify-center ${size}`}
    >
      {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
    </Button>
  );
};

export default PlayPauseButton;
