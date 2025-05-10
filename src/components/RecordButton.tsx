import React, { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AudioRecorder from "./AudioRecorder";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface RecordButtonProps {
  onPostCreated: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [attemptedOutsideClick, setAttemptedOutsideClick] = useState(false);

  const handleOutsideClick = () => {
    setAttemptedOutsideClick(true);

    toast({
      title: "Utilisez la croix pour fermer",
      description: "Veuillez utiliser le bouton X pour fermer cette fenêtre.",
      variant: "destructive",
    });

    const dialogElement = document.querySelector(".dialog-shake");
    if (dialogElement) {
      dialogElement.classList.add("animate-shake");
      setTimeout(() => {
        dialogElement.classList.remove("animate-shake");
      }, 500);
    }

    setTimeout(() => {
      setAttemptedOutsideClick(false);
    }, 1000);
  };

  const handleAudioReady = async (audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener("loadedmetadata", async () => {
        const duration = audio.duration;

        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("description", description);
        formData.append("audioDuration", duration.toFixed(2));

        try {
          await axios.post(
            "https://vocal-echo-social-backend.onrender.com/api/posts",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toast({
            title: "Note vocale publiée",
            description: "Votre note vocale a été publiée avec succès.",
          });

          setIsOpen(false);
          setDescription("");
          onPostCreated();

          if (location.pathname !== "/") {
            navigate("/");
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Erreur lors de la publication",
            description: "Impossible de publier votre note vocale.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre audio.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setDescription("");
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-10"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-voicify-orange hover:bg-voicify-orange/90 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <Mic size={24} />
          </motion.div>
        </Button>
      </motion.div>

      <style>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-10px);
          }
          40% {
            transform: translateX(10px);
          }
          60% {
            transform: translateX(-5px);
          }
          80% {
            transform: translateX(5px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
        <DialogContent
          className={`sm:max-w-md dialog-shake ${
            attemptedOutsideClick ? "border-red-500" : ""
          }`}
          onInteractOutside={handleOutsideClick}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Enregistrer une note vocale</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="h-6 w-6 rounded-full"
              >
                <span className="text-lg font-bold">×</span>
              </Button>
            </DialogTitle>
          </DialogHeader>

          <AudioRecorder
            onAudioReady={handleAudioReady}
            onCancel={handleCloseDialog}
            description={description}
            onDescriptionChange={setDescription}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordButton;

