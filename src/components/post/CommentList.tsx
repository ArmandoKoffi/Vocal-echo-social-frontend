import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import AudioPlayer from "../audio/AudioPlayer";
import { Comment } from "@/types/Comment";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return null;
  }

  // Format time for display
  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3 mb-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.avatar} alt={comment.username} />
            <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
              <p className="text-xs font-medium dark:text-white">
                {comment.username}
              </p>
              {comment.audioUrl ? (
                <div className="mt-1">
                  <AudioPlayer
                    audioUrl={comment.audioUrl}
                    size="small"
                    showEqualizer={true}
                    mini={true}
                  />
                  {comment.audioDuration && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                      <span>
                        Durée: {formatDuration(comment.audioDuration)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm mt-1 dark:text-gray-200">
                  {comment.content}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDistanceToNow(new Date(comment.timestamp), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
