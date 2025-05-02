
import React, { useState, useEffect, useRef } from 'react';
import PlayPauseButton from './PlayPauseButton';
import ProgressBar from './ProgressBar';
import WaveformVisualizer from './WaveformVisualizer';
import VolumeControl from './VolumeControl';
import { formatTime } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl: string;
  size?: 'small' | 'medium' | 'large';
  showEqualizer?: boolean;
  waveformData?: number[];
  mini?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  size = 'medium',
  showEqualizer = false,
  waveformData = Array.from({ length: 40 }, () => Math.random() * 60 + 20),
  mini = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  // Sizing options based on the size prop
  const playerSizes = {
    small: {
      height: 'h-12',
      waveformHeight: 'h-12',
      progressBarHeight: 'h-1',
      buttonSize: 'small' as const
    },
    medium: {
      height: 'h-16',
      waveformHeight: 'h-14',
      progressBarHeight: 'h-1.5',
      buttonSize: 'medium' as const
    },
    large: {
      height: 'h-24',
      waveformHeight: 'h-20',
      progressBarHeight: 'h-2',
      buttonSize: 'large' as const
    }
  };

  const currentSize = playerSizes[size];

  useEffect(() => {
    // Setup audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current!);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentageClicked = (e.clientX - rect.left) / rect.width;
    const newTime = percentageClicked * duration;

    seek(newTime);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 100;
    setVolume(newVolume);
  };

  const handleVolumeToggle = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  return (
    <div
      className={`relative flex flex-col w-full ${currentSize.height} bg-white dark:bg-gray-800 rounded-lg overflow-hidden`}
    >
      <div className="px-4 pt-2 pb-1 w-full flex items-center justify-between">
        <div className="flex items-center">
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={togglePlayPause}
            isLoading={isLoading}
            size={currentSize.buttonSize}
            iconSize={24}
          />

          <div className="flex flex-col justify-center ml-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <VolumeControl
          volume={volume}
          isMuted={volume === 0}
          onVolumeToggle={handleVolumeToggle}
          onVolumeChange={handleVolumeChange}
          isDragging={isVolumeDragging}
          setIsDragging={setIsVolumeDragging}
        />
      </div>

      <div className="px-4 flex-1 relative">
        {showEqualizer && (
          <WaveformVisualizer
            waveformData={waveformData}
            isAnimated={isPlaying}
            height={currentSize.waveformHeight}
          />
        )}
      </div>

      <div className="px-2">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onClick={handleProgressBarClick}
          progressHeight={currentSize.progressBarHeight}
          value={(currentTime / (duration || 1)) * 100}
          onProgressChange={(percent) => {
            const newTime = (percent / 100) * duration;
            seek(newTime);
          } } height={''} onChange={function (value: number): void {
            throw new Error('Function not implemented.');
          } }        />
      </div>
    </div>
  );
};

export default AudioPlayer;
