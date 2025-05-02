
import React from 'react';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  recordingTime: number;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  audioBlob,
  onStart,
  onStop,
  onPause,
  onResume
}) => {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {!isRecording && !audioBlob && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={onStart}
            className="rounded-full bg-voicify-orange hover:bg-voicify-orange/90 text-white h-14 w-14 flex items-center justify-center"
          >
            <Mic size={24} />
          </Button>
        </motion.div>
      )}

      {isRecording && (
        <div className="flex gap-4">
          {isPaused ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={onResume}
                className="rounded-full bg-green-600 hover:bg-green-700 h-12 w-12 flex items-center justify-center"
              >
                <Play size={20} />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={onPause}
                className="rounded-full bg-amber-500 hover:bg-amber-600 h-12 w-12 flex items-center justify-center"
              >
                <Pause size={20} />
              </Button>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={onStop}
              variant="destructive"
              className="rounded-full h-14 w-14 flex items-center justify-center"
            >
              <Square size={24} />
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
