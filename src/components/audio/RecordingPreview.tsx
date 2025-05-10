import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import WaveformVisualizer from "./WaveformVisualizer";
import { Progress } from "@/components/ui/progress";

interface RecordingPreviewProps {
  audioBlob: Blob;
  onStartNewRecording?: () => void;
  onSend?: () => void;
}

const RecordingPreview: React.FC<RecordingPreviewProps> = ({
  audioBlob,
  onStartNewRecording = () => {},
  onSend = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData] = useState<number[]>(
    Array.from({ length: 40 }, () => Math.random() * 60 + 20)
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef<string>("");

  useEffect(() => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    audioUrl.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      URL.revokeObjectURL(url);
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioBlob]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration - currentTime;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-sm font-medium dark:text-white mb-1">
        Prévisualisation de votre enregistrement
      </div>

      <div className="h-16">
        <WaveformVisualizer waveformData={waveformData} height="h-16" />
      </div>

      <div className="flex flex-col gap-1">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {isPlaying && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
            Temps restant: {formatTime(remainingTime)}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={togglePlayback}
            className="rounded-full bg-voicify-blue hover:bg-voicify-blue/90 h-12 w-12 flex items-center justify-center"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={onStartNewRecording}
            variant="outline"
            className="rounded-full h-12 w-12 flex items-center justify-center"
          >
            <Mic size={20} />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={onSend}
            className="rounded-full bg-voicify-orange hover:bg-voicify-orange/90 text-white h-14 w-14 flex items-center justify-center"
          >
            <Send size={24} />
          </Button>
        </motion.div>
      </div>

      <audio ref={audioRef} src={audioUrl.current} />
    </div>
  );
};

export default RecordingPreview;

