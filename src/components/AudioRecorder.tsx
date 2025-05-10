import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Send, X, Pause, Play, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import RecordingWaveform from "./audio/RecordingWaveform";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  onCancel: () => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  isPosting: boolean;
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  onCancel,
  description,
  onDescriptionChange,
  isPosting,
}) => {
  const [recordingStage, setRecordingStage] = useState<"initial" | "recording" | "description" | "preview">("initial");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  
  const { toast } = useToast();

  const MAX_RECORDING_TIME = 60;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (audioBlob) {
        setAudioBlob(null);
        audioChunksRef.current = [];
      }

      setRecordingStage("recording");
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingStage("description");
      });

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez vérifier vos permissions.",
        variant: "destructive",
      });
    }
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
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    setIsPaused(!isPaused);
  };

  const handleCancel = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
    setRecordingStage("initial");
    onCancel();
  };

  const handleSend = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
    }
  };

  const goToPreview = () => {
    if (audioBlob && description.trim()) {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      
      const url = URL.createObjectURL(audioBlob);
      audioUrlRef.current = url;
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
      
      setRecordingStage("preview");
    }
  };

  const handleReRecord = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setRecordingStage("initial");
    onDescriptionChange("");
    
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  return (
    <motion.div 
      className="w-full max-w-xl mx-auto rounded-xl bg-white shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {recordingStage === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={startRecording}
                className="rounded-full bg-voicify-orange hover:bg-voicify-orange/90 text-white h-20 w-20 flex items-center justify-center shadow-lg"
              >
                <Mic size={32} />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {recordingStage === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <div className="text-center text-2xl font-mono text-voicify-orange">
              {formatTime(recordingTime)}
            </div>

            <RecordingWaveform 
              isRecording={isRecording}
              isPaused={isPaused}
              audioContext={audioContextRef.current}
              analyser={analyserRef.current}
            />

            <div className="flex justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={togglePause}
                  className={`rounded-full ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'} h-12 w-12 flex items-center justify-center`}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="rounded-full h-14 w-14 flex items-center justify-center shadow-md"
                >
                  <Square size={24} />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {recordingStage === "description" && (
          <motion.div
            key="description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <div className="space-y-2">
              <motion.h3 
                className="text-lg font-medium text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Ajouter une description
              </motion.h3>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Textarea
                  placeholder="De quoi parle votre note vocale ? (200 caractères max)"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  className="resize-none h-32 focus:ring-voicify-orange focus:border-voicify-orange"
                  maxLength={200}
                  autoFocus
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {description.length}/200
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {description.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="pt-2"
                >
                  <Button 
                    onClick={goToPreview}
                    className="w-full bg-voicify-orange hover:bg-voicify-orange/90"
                    disabled={isPosting}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      "Passer à la prévisualisation"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {recordingStage === "preview" && audioBlob && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <motion.div 
              className="border rounded-lg p-3 bg-gray-50"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{description}</p>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <audio 
                ref={audioRef}
                controls 
                className="w-full rounded-lg"
                src={audioUrlRef.current || undefined}
              >
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </motion.div>

            <motion.div 
              className="flex justify-between pt-2 gap-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                onClick={handleReRecord}
                className="flex-1"
                disabled={isPosting}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Réenregistrer
              </Button>
              
              <Button 
                onClick={handleSend}
                className="flex-1 bg-voicify-orange hover:bg-voicify-orange/90"
                disabled={isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Envoyer
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {audioBlob && <audio ref={audioRef} className="hidden" />}
    </motion.div>
  );
};

export default AudioRecorder; 

