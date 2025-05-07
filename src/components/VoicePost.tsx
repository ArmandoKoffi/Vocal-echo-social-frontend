import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AudioPlayer from "./AudioPlayer";
import CommentForm from "./CommentForm";
import PostHeader from "./post/PostHeader";
import PostActions from "./post/PostActions";
import CommentList from "./post/CommentList";
import ShareDialog from "./post/ShareDialog";
import DeleteDialog from "./post/DeleteDialog";
import ReportDialog from "./post/ReportDialog";
import { likePost, commentOnPost, deletePost, updatePost } from "@/api/postsApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: string;
}

export interface VoicePostProps {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  audioUrl: string;
  audioDuration?: number;
  description?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
  onLikeUpdate?: (
    postId: string,
    newLikesCount: number,
    newHasLiked: boolean
  ) => void;
  onCommentAdded?: (comment: Comment) => void;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (updatedPost: VoicePostProps) => void;
}

const VoicePost: React.FC<VoicePostProps> = ({
  id,
  userId,
  username,
  avatar,
  audioUrl,
  audioDuration,
  description,
  timestamp,
  likes,
  comments,
  hasLiked,
  onLikeUpdate,
  onCommentAdded,
  onPostDeleted,
  onPostUpdated,
}) => {
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>(comments);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const optimisticLikes = isLiked ? likesCount - 1 : likesCount + 1;

      setIsLiked(!isLiked);
      setLikesCount(optimisticLikes);
      onLikeUpdate?.(id, optimisticLikes, !isLiked);

      const result = await likePost(id);

      setIsLiked(result.hasLiked);
      setLikesCount(result.likes);
      onLikeUpdate?.(id, result.likes, result.hasLiked);
    } catch (error) {
      setIsLiked(hasLiked);
      setLikesCount(likes);
      onLikeUpdate?.(id, likes, hasLiked);

      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleUpdatePost = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();

      // Ajout de la description si modifiée
      if (editedDescription !== description) {
        formData.append("description", editedDescription);
      }

      // Ajout du nouvel audio si fourni
      if (newAudioFile) {
        formData.append("audio", newAudioFile);
        formData.append("audioDuration", String(audioDuration || 0));
      }

      console.log("Envoi de la requête de modification...");
      const updatedPost = await updatePost(id, formData);

      console.log("Post mis à jour avec succès:", updatedPost);
      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }

      toast({
        title: "Post mis à jour",
        description: "Votre publication a été modifiée avec succès.",
      });

      setIsEditing(false);
      setNewAudioFile(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de la mise à jour du post",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCommentToggle = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleShare = (platform: string) => {
    toast({
      title: "Partagé sur " + platform,
      description: "Le lien a été copié dans votre presse-papiers.",
    });
    setIsShareDialogOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://vocal-echo-social-frontend.vercel.app/post/${id}`);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
    setIsShareDialogOpen(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deletePost(id);
      
      toast({
        title: "Publication supprimée",
        description: "Votre publication a été supprimée avec succès.",
      });
      
      if (onPostDeleted) {
        onPostDeleted(id);
      }
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression du post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  const handleCommentAdded = async (
    comment: Comment & { audioFile?: File }
  ) => {
    const formData = new FormData();
    if (comment.content) formData.append("content", comment.content);
    if (comment.audioFile) {
      formData.append("audio", comment.audioFile);
      formData.append("audioDuration", String(comment.audioDuration || 0));
    }

    try {
      const result = await commentOnPost(id, formData);
      setPostComments((prev) => [...prev, result]);
      onCommentAdded?.(result);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <PostHeader
          userId={userId}
          username={username}
          avatar={avatar}
          timestamp={timestamp}
          onDelete={() => setIsDeleteDialogOpen(true)}
          onReport={handleReport}
          onEdit={() => setIsEditing(true)}
        />

        {isEditing ? (
          <div className="mt-4 space-y-3">
            <Textarea
              className="w-full"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Modifiez votre description..."
            />
            <div className="space-y-2">
              <Label>Changer l'audio (optionnel)</Label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files && setNewAudioFile(e.target.files[0])}
                title="Upload an audio file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-100
                  dark:hover:file:bg-blue-800"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdatePost}
                disabled={isUpdating || (!newAudioFile && editedDescription === description)}
              >
                {isUpdating ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {description && (
              <p className="mb-3 text-sm dark:text-gray-200">{description}</p>
            )}

            <div className="mb-3">
              <AudioPlayer audioUrl={audioUrl} showEqualizer={true} mini={false} />

              {audioDuration && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-end">
                  Durée: {Math.floor(audioDuration / 60)}:
                  {Math.floor(audioDuration % 60)
                    .toString()
                    .padStart(2, "0")}
                </div>
              )}
            </div>

            <PostActions
              likesCount={likesCount}
              commentsCount={postComments.length}
              isLiked={isLiked}
              onLike={handleLike}
              onCommentToggle={handleCommentToggle}
              onShare={() => setIsShareDialogOpen(true)}
            />
          </>
        )}
      </div>

      {isCommentsOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <CommentList comments={postComments} />
          <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
        </div>
      )}

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <ReportDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        postId={id}
      />
    </motion.div>
  );
};

export default VoicePost;
