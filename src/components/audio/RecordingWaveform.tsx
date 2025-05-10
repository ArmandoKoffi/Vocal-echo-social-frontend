import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RecordingWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

const RecordingWaveform: React.FC<RecordingWaveformProps> = ({
  isRecording,
  isPaused,
  audioContext,
  analyser
}) => {
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(10));
  const animationRef = React.useRef<number>();

  useEffect(() => {
    if (!isRecording || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateWaveform = () => {
      if (!isRecording || isPaused || !analyser) {
        cancelAnimationFrame(animationRef.current!);
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      const step = Math.floor(bufferLength / 40);
      const newWaveform: number[] = [];

      for (let i = 0; i < 40; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] || 0;
        }
        newWaveform.push(10 + (sum / step) * 0.9);
      }

      setWaveform(newWaveform);
      animationRef.current = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [isRecording, isPaused, analyser]);

  return (
    <div className="h-20 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
      <div className="flex h-full items-center gap-1">
        {waveform.map((height, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-voicify-blue rounded-full"
            animate={{ 
              height: `${height}%`,
              backgroundColor: isRecording && !isPaused 
                ? ["#3b82f6", "#1d4ed8", "#3b82f6"] 
                : "#3b82f6"
            }}
            transition={{ 
              duration: 0.5,
              repeat: isRecording && !isPaused ? Infinity : 0,
              repeatType: "reverse"
            }}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordingWaveform;
