import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import UserProfile from "@/components/UserProfile";
import { getUserProfile } from "@/api/usersApi";
import { getUserPosts, Post, Comment as ApiComment } from "@/api/postsApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  VoicePostProps,
  Comment as VoicePostComment,
} from "@/components/VoicePost";

const Profile = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState<VoicePostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const currentUserId = userId || (currentUser ? currentUser.id : null);

        if (!currentUserId) {
          toast({
            title: "Erreur",
            description: "Utilisateur non connecté",
            variant: "destructive",
          });
          return;
        }

        const userData = await getUserProfile(currentUserId);
        setUser(userData);

        // Vérifier si c'est le profil de l'utilisateur connecté
        setIsCurrentUserProfile(currentUser && currentUser.id === userData.id);

        const userPosts = await getUserPosts(userData.id);

        // Transform the posts to ensure they have waveformData and other required props
        const transformedPosts: VoicePostProps[] = userPosts.map(
          (post: Post) => {
            // Convert API comments to VoicePost comments format
            const convertedComments: VoicePostComment[] = post.comments.map(
              (comment: ApiComment) => ({
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

            return {
              id: post.id,
              userId: post.userId,
              username: post.username,
              avatar: post.avatar,
              audioUrl: post.audioUrl,
              audioDuration: post.audioDuration || 0,
              waveformData:
                post.waveformData ||
                Array.from({ length: 40 }, () => Math.random() * 60 + 20),
              description: post.description,
              timestamp: post.timestamp,
              likes: post.likes,
              comments: convertedComments,
              isLiked: post.hasLiked, // Map hasLiked to isLiked
            };
          }
        );

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, toast, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        {user && (
          <UserProfile
            user={user}
            posts={posts}
            isCurrentUserProfile={isCurrentUserProfile}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
