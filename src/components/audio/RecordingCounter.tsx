/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';

interface RecordingCounterProps {
  isRecording: boolean;
  onDurationUpdate?: (duration: number) => void;
}

const RecordingCounter: React.FC<RecordingCounterProps> = ({
  isRecording,
  onDurationUpdate
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Start/stop the timer based on recording state
  useEffect(() => {
    if (isRecording) {
      // Reset timer when starting
      setElapsedTime(0);

      // Start interval
      const id = window.setInterval(() => {
        setElapsedTime(prev => {
          const newValue = prev + 1;
          if (onDurationUpdate) {
            onDurationUpdate(newValue);
          }
          return newValue;
        });
      }, 1000);

      setIntervalId(id);
    } else if (intervalId !== null) {
      // Clear interval when stopping
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Clean up interval on unmount
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, onDurationUpdate]);

  // Format the time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-center transition-opacity ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
      <span
        className={`text-xl font-mono ${isRecording && elapsedTime % 2 === 0 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
      >
        {formatTime(elapsedTime)}
      </span>

      {isRecording && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Enregistrement en cours...
        </div>
      )}
    </div>
  );
};

export default RecordingCounter;
