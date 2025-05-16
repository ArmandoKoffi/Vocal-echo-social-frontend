import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import VoicePost, { VoicePostProps } from "@/components/VoicePost";
import RecordButton from "@/components/RecordButton";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: string;
}

const Index = () => {
  const [posts, setPosts] = useState<VoicePostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  // Utilisation du contexte Socket
  const { 
    isConnected, 
    onPostAction, 
    onCommentAdded, 
    onLikeUpdated 
  } = useSocket();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://vocal-echo-social-backend.onrender.com/api/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey]);

  // Effet pour écouter les événements Socket.io en temps réel
  useEffect(() => {
    if (isConnected) {
      // Gestion des posts (création, mise à jour, suppression)
      const handlePostAction = (data) => {
        switch (data.action) {
          case 'create':
            // Ajouter le nouveau post en haut de la liste
            setPosts(prevPosts => [data.post, ...prevPosts]);
            break;
          case 'update':
            // Mettre à jour un post existant
            setPosts(prevPosts => 
              prevPosts.map(post => 
                post.id === data.post.id ? data.post : post
              )
            );
            break;
          case 'delete':
            // Supprimer un post
            setPosts(prevPosts => 
              prevPosts.filter(post => post.id !== data.post.id)
            );
            break;
          default:
            break;
        }
      };

      // Gestion des nouveaux commentaires
      const handleCommentAdded = (data) => {
        // Éviter de duplications des commentaires
        // Vérifier si ce n'est pas l'utilisateur actuel qui a ajouté le commentaire
        if (!user || data.comment.userId !== user.id) {
          setPosts(prevPosts =>
            prevPosts.map(post =>
              post.id === data.postId
                ? {
                    ...post,
                    comments: [...post.comments, data.comment]
                  }
                : post
            )
          );
        }
      };

      // Gestion des likes
      const handleLikeUpdated = (data) => {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === data.postId
              ? {
                  ...post,
                  likes: data.likes,
                  hasLiked: post.userId === data.userId ? !post.hasLiked : post.hasLiked
                }
              : post
          )
        );
      };

      // Abonnement aux événements socket
      onPostAction(handlePostAction);
      onCommentAdded(handleCommentAdded);
      onLikeUpdated(handleLikeUpdated);

      // Nettoyage des abonnements
      return () => {
        // Pas besoin d'explicitement se désabonner car les fonctions de nettoyage
        // sont gérées dans le contexte SocketContext
      };
    }
  }, [isConnected, onPostAction, onCommentAdded, onLikeUpdated, user]);

  const handlePostCreated = () => {
    // On pourrait potentiellement retirer cette fonction car les posts seront
    // désormais ajoutés via les événements socket en temps réel
    setRefreshKey((prev) => prev + 1);
  };

  const handleLikeUpdate = (
    postId: string,
    newLikesCount: number,
    newHasLiked: boolean
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: newLikesCount, hasLiked: newHasLiked }
          : post
      )
    );
  };

  const handleCommentAdded = (postId: string, newComment: Comment) => {
    // Cette fonction peut être simplifiée car nous gérons désormais les commentaires
    // via les événements socket. Elle reste pour la compatibilité.
    // Les commentaires de l'utilisateur actuel sont ajoutés directement dans VoicePost.tsx
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost: VoicePostProps) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const toggleShowAllPosts = () => {
    setShowAllPosts(!showAllPosts);
  };

  const displayedPosts = showAllPosts ? posts : posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold dark:text-white">
            Fil d'actualité
          </h1>
          {isConnected && (
            <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-50 rounded-full dark:bg-green-900">
              Connecté en temps réel
            </span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-100 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-100 dark:bg-gray-600 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {displayedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <VoicePost
                    {...post}
                    onLikeUpdate={handleLikeUpdate}
                    onCommentAdded={(comment) =>
                      handleCommentAdded(post.id, comment)
                    }
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={toggleShowAllPosts}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  {showAllPosts ? "Voir moins" : "Voir plus de publications"}
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune publication pour le moment.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Soyez le premier à partager votre voix !
            </p>
          </div>
        )}
      </div>

      <RecordButton onPostCreated={handlePostCreated} />
    </div>
  );
};

export default Index;
