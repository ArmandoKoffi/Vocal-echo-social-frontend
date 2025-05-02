import React, { useState } from "react";
import { Send, Mic, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types/Comment";
import AudioRecorder from "./AudioRecorder";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment & { audioFile?: File }) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  const handleAudioReady = (audioBlob: Blob, duration: number) => {
    const audioFile = new File([audioBlob], `comment-audio-${Date.now()}.mp3`, {
      type: "audio/mpeg",
    });

    const audioUrl = URL.createObjectURL(audioBlob);

    const newComment: Comment & { audioFile?: File } = {
      id: `temp-${Date.now()}`,
      userId: user?.id || "current-user",
      username: user?.username || "Vous",
      avatar: user?.avatar || "",
      content: "",
      audioUrl,
      audioDuration: duration,
      timestamp: new Date().toISOString(),
      audioFile,
    };

    onCommentAdded(newComment);
    setIsRecording(false);
  };

  const handleSubmitText = () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      userId: user?.id || "current-user",
      username: user?.username || "Vous",
      avatar: user?.avatar || "",
      content: commentText,
      timestamp: new Date().toISOString(),
    };

    onCommentAdded(newComment);
    setCommentText("");
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitText();
    }
  };

  return (
    <div className="mt-2">
      {!isRecording ? (
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || ""} alt="Votre avatar" />
            <AvatarFallback>
              {user?.username ? (
                user.username.charAt(0).toUpperCase()
              ) : (
                <User size={16} />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center gap-2 border rounded-lg pr-2 bg-gray-50 dark:bg-gray-800">
            <Textarea
              value={commentText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ajouter un commentaire..."
              className="min-h-[40px] flex-1 border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-voicify-orange"
                onClick={handleStartRecording}
              >
                <Mic size={18} />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  commentText.trim() ? "text-voicify-blue" : "text-gray-400"
                }`}
                disabled={!commentText.trim() || isSubmitting}
                onClick={handleSubmitText}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <AudioRecorder
          onAudioReady={handleAudioReady}
          onCancel={handleCancelRecording}
        />
      )}
    </div>
  );
};

export default CommentForm;
