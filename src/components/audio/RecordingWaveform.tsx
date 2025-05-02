import React from "react";
import { motion } from "framer-motion";

interface RecordingWaveformProps {
  waveformData: number[];
  isRecording: boolean;
  audioBlob: Blob | null;
  samplesCount: number;
}

const RecordingWaveform: React.FC<RecordingWaveformProps> = ({
  waveformData,
  isRecording,
  audioBlob,
  samplesCount,
}) => {
  return (
    <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex items-center justify-center overflow-hidden">
      {isRecording || audioBlob ? (
        <div className="flex h-full items-center gap-[2px]">
          {waveformData.map((height, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-voicify-blue rounded-full"
              animate={
                isRecording
                  ? { height: [`${height}%`, `${height / 2}%`, `${height}%`] }
                  : {}
              }
              transition={{
                repeat: isRecording ? Infinity : 0,
                duration: 0.5,
                repeatType: "reverse",
              }}
              style={{ height: `${height}%` }}
            />
          ))}
          {audioBlob && (
            <div className="text-gray-400 dark:text-gray-500">
              {samplesCount} échantillons
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400 dark:text-gray-500 italic">
          Commencez l'enregistrement...
        </div>
      )}
    </div>
  );
};

export default RecordingWaveform;
