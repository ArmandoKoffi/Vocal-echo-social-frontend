import React, { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const handleAudioReady = async (audioBlob: Blob) => {
    try {
      setIsPosting(true);
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

          handleCloseDialog();
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
        } finally {
          setIsPosting(false);
        }
      });
    } catch (error) {
      console.error(error);
      setIsPosting(false);
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

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            toast({
              title: "Fermeture de l'enregistrement",
              description:
                "Veuillez utiliser la croix en haut à droite pour fermer la fenêtre.",
            });
          } else {
            setIsOpen(open);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
            toast({
              title: "Fermeture de l'enregistrement",
              description:
                "Veuillez utiliser la croix en haut à droite pour fermer la fenêtre.",
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>Enregistrer une note vocale</DialogTitle>
            <DialogClose
              onClick={handleCloseDialog}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            />
          </DialogHeader>

          <AudioRecorder
            onAudioReady={handleAudioReady}
            onCancel={handleCloseDialog}
            description={description}
            onDescriptionChange={setDescription}
            isPosting={isPosting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordButton;

