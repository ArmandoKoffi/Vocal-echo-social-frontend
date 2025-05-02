/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Components
import NavBar from "@/components/NavBar";
import VoicePost from "@/components/VoicePost";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// API & Hooks
import { getNotification } from "@/api/notificationsApi";
import { Post, Comment } from "@/api/postsApi";
import { useToast } from "@/hooks/use-toast";

const NotificationDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [notification, setNotification] = useState<any | null>(null);
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getNotification(id);

        setNotification(data);

        if (data.post) {
          // Create a transformed post object for VoicePost component
          const postData = data.post;

          // Transform API comments to VoicePost comments format
          const transformedComments = postData.comments.map(
            (comment: Comment) => ({
              id: comment.id,
              userId: comment.userId,
              username: comment.username,
              avatar: comment.avatar,
              content: comment.content || "", // Ensure content is not undefined
              audioUrl: comment.audioUrl,
              audioDuration: comment.audioDuration,
              timestamp: comment.timestamp,
            })
          );

          const transformedPost = {
            id: postData.id,
            userId: postData.userId,
            username: postData.username,
            avatar: postData.avatar,
            audioUrl: postData.audioUrl,
            audioDuration: postData.audioDuration || 0,
            waveformData: Array.from(
              { length: 40 },
              () => Math.random() * 60 + 20
            ),
            description: postData.description,
            timestamp: postData.timestamp,
            likes: postData.likes,
            comments: transformedComments,
            isLiked: postData.hasLiked, // Map hasLiked to isLiked
          };

          setPost(transformedPost);
        }
      } catch (error) {
        console.error("Error fetching notification details:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la notification",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [id, toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <Link
            to="/notifications"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Retour aux notifications</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            {notification && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.fromUser?.avatar} />
                    <AvatarFallback>
                      {notification.fromUser?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">
                      <span className="font-semibold">
                        {notification.fromUser?.username}
                      </span>{" "}
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {post && <VoicePost {...post} />}

            {!notification && !post && (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  Notification non trouvée ou supprimée
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationDetail;
