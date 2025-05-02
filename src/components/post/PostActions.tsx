import React from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  likesCount,
  commentsCount,
  isLiked,
  onLike,
  onCommentToggle,
  onShare,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${
                  isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={onLike}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                </motion.div>
                <span>{likesCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Je n'aime plus" : "J'aime"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                onClick={onCommentToggle}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <MessageCircle size={18} />
                </motion.div>
                <span>{commentsCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Commenter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400"
              onClick={onShare}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Share size={18} />
              </motion.div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Partager</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PostActions;
 