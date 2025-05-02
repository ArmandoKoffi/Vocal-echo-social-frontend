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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios"; // 🔥 Ajout
import { useAuth } from "@/contexts/AuthContext"; // 🔥 Ajout pour récupérer le token

interface RecordButtonProps {
  onPostCreated: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth(); // 🔥

  const handleDescriptionValidation = () => {
    if (!description.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez ajouter une description à votre note vocale.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAudioReady = async (audioBlob: Blob) => {
    if (!handleDescriptionValidation()) return;

    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener("loadedmetadata", async () => {
        const duration = audio.duration;

        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("description", description);
        formData.append("audioDuration", duration.toFixed(2)); // envoyer avec 2 décimales

        try {
          await axios.post("https://vocal-echo-social-backend.onrender.com/api/posts", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

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


  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= 200) {
      setDescription(e.target.value);
    }
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer une note vocale</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description{" "}
                <span className="text-sm text-gray-500">
                  ({description.length}/200)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="De quoi parle votre note vocale ?"
                value={description}
                onChange={handleDescriptionChange}
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez une description pour aider les autres utilisateurs à
                comprendre votre note vocale.
              </p>
            </div>

            <AudioRecorder
              onAudioReady={handleAudioReady}
              onCancel={() => setIsOpen(false)}
              description={description}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordButton;
