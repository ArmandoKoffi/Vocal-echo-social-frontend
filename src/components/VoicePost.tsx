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
import { likePost, commentOnPost } from "@/api/postsApi";

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
}) => {
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>(comments);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

const handleLike = async () => {
  if (isLiking) return;

  try {
    setIsLiking(true);
    const optimisticLikes = isLiked ? likesCount - 1 : likesCount + 1;

    // Mise à jour optimiste
    setIsLiked(!isLiked);
    setLikesCount(optimisticLikes);
    onLikeUpdate?.(id, optimisticLikes, !isLiked);

    // Appel API
    const result = await likePost(id);

    // Synchronisation avec la réponse
    setIsLiked(result.hasLiked);
    setLikesCount(result.likes);
    onLikeUpdate?.(id, result.likes, result.hasLiked);
  } catch (error) {
    // Rollback en cas d'erreur
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
  navigator.clipboard.writeText(`https://vocalexpress.app/post/${id}`);
  toast({
    title: "Lien copié",
    description: "Le lien a été copié dans votre presse-papiers.",
  });
  setIsShareDialogOpen(false);
};

const handleDelete = () => {
  toast({
    title: "Publication supprimée",
    description: "Votre publication a été supprimée avec succès.",
  });
  setIsDeleteDialogOpen(false);
};

const handleReport = () => {
  setIsReportDialogOpen(true);
};

const handleCommentAdded = async (comment: Comment & { audioFile?: File }) => {
  // Mise à jour optimiste avec ID temporaire
  const tempComment = {
    ...comment,
    id: "temp-" + Date.now(),
  };
  try {
    setPostComments((prev) => [...prev, tempComment]);

    // Préparer les données pour l'API
    const formData = new FormData();
    if (comment.content) {
      formData.append("content", comment.content);
    }
    if (comment.audioFile) {
      formData.append("audio", comment.audioFile);
      formData.append("audioDuration", String(comment.audioDuration || 0));
    }

    // Appel API
    const result = await commentOnPost(id, formData);

    // Remplacement par la vraie donnée
    setPostComments((prev) =>
      prev.map((c) => (c.id === tempComment.id ? result : c))
    );

    // Notification au parent
    onCommentAdded?.(result);
  } catch (error) {
    // Rollback
    setPostComments((prev) =>
      prev.filter((c) => c.id !== tempComment.id)
    );
    toast({
      title: "Erreur",
      description: error.message
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
      />

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
