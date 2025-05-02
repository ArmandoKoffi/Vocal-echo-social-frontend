import React from "react";
import { motion } from "framer-motion";

interface WaveformVisualizerProps {
  waveformData: number[];
  isAnimated?: boolean;
  height: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  waveformData,
  isAnimated = false,
  height,
}) => {
  return (
    <div className={`${height} flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2`}>
      {waveformData.map((height, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-voicify-blue rounded-full"
          animate={
            isAnimated
              ? { height: [`${height}%`, `${height / 2}%`, `${height}%`] }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: 0.5,
            repeatType: "reverse",
          }}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
