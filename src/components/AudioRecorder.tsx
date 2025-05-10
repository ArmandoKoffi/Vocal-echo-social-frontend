import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Send, X, Pause, Play, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import RecordingControls from "./audio/RecordingControls";
import RecordingWaveform from "./audio/RecordingWaveform";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  onCancel: () => void;
  description?: string;
}

// 🔥 Fonction pour formater le temps en MM:SS
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  onCancel,
  description,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { toast } = useToast();

  const MAX_RECORDING_TIME = 60;
  const WAVEFORM_SAMPLES = 40;

  const samplesCount = audioWaveform.length;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current && isRecording)
        mediaRecorderRef.current.stop();
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (audioBlob) {
        setAudioBlob(null);
        audioChunksRef.current = [];
        setShowPreview(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        setShowPreview(true);
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      });

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prevTime + 1;
        });
      }, 1000);

      setRecordingTime(0);
      setIsPaused(false);
      mediaRecorderRef.current.start();
      setIsRecording(true);

      startWaveformVisualization();
    } catch (error) {
      console.error("Erreur d'accès au micro:", error);
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez vérifier vos permissions.",
        variant: "destructive",
      });
    }
  };

  const startWaveformVisualization = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateWaveform = () => {
      if (!analyserRef.current || !isRecording || isPaused) {
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);
      const step = Math.floor(bufferLength / WAVEFORM_SAMPLES);
      const waveformData: number[] = [];

      for (let i = 0; i < WAVEFORM_SAMPLES; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          const index = i * step + j;
          if (index < bufferLength) sum += dataArray[index];
        }
        const value = 10 + (sum / step) * 0.9;
        waveformData.push(value);
      }

      setAudioWaveform(waveformData);
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      isRecording &&
      !isPaused &&
      "pause" in mediaRecorderRef.current
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      isRecording &&
      isPaused &&
      "resume" in mediaRecorderRef.current
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prevTime + 1;
        });
      }, 1000);

      startWaveformVisualization();
    }
  };

  const handleCancel = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
    setAudioWaveform([]);
    setShowPreview(false);
    onCancel();
  };

  const handleSend = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
      setAudioBlob(null);
      setRecordingTime(0);
      setAudioWaveform([]);
      setShowPreview(false);
      setIsRecording(false);
    }
  };

  const handleReRecord = async () => {
    await handleCancel();
    setAudioBlob(null);
    setRecordingTime(0);
    setAudioWaveform([]);
    startRecording();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-xl bg-white shadow-lg space-y-4">
      {description && <p className="text-gray-600">{description}</p>}

      {showPreview && audioBlob ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {/* 🎧 Mini lecteur audio */}
          <audio controls className="w-full mt-4 rounded-lg">
            <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>

          <div className="flex justify-between mt-4 gap-3">
            <Button variant="outline" onClick={handleReRecord}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Réenregistrer
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Annuler
              </Button>
              <Button onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="recorder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecordingWaveform
              waveformData={audioWaveform}
              isRecording={isRecording}
              audioBlob={audioBlob}
              samplesCount={samplesCount}
            />

            {/* 🎯 Timer en direct */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Durée : {formatTime(recordingTime)}
              </span>
              <span className="text-sm text-gray-500">
                {formatTime(MAX_RECORDING_TIME)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Durée : {formatTime(recordingTime)}
              </span>
              <span className="text-sm text-gray-500">
                {formatTime(MAX_RECORDING_TIME)}
              </span>
            </div>
            <Progress
              value={(recordingTime / MAX_RECORDING_TIME) * 100}
              className="my-3"
            />

            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              onStart={startRecording}
              onStop={stopRecording}
              onPause={pauseRecording}
              onResume={resumeRecording}
              onCancel={handleCancel}
              recordingTime={recordingTime}
              audioBlob={audioBlob}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AudioRecorder;

