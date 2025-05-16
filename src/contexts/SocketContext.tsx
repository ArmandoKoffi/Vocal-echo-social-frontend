import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/api/notificationsApi";
import { useNavigate } from "react-router-dom";
import { Post, Comment } from "@/api/postsApi";

interface PostAction {
  post: Post;
  action: "create" | "update" | "delete";
}

interface CommentAction {
  postId: string;
  comment: Comment;
}

interface LikeAction {
  postId: string;
  likes: number;
  userId: string;
}

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
  onlineUsers: string[];
  // Ajout des nouveaux callbacks
  onPostAction: (callback: (data: PostAction) => void) => void;
  onCommentAdded: (callback: (data: CommentAction) => void) => void;
  onLikeUpdated: (callback: (data: LikeAction) => void) => void;
  emitPostCreated: (post: Post) => void;
  emitPostUpdated: (post: Post) => void;
  emitPostDeleted: (postId: string) => void;
  emitCommentAdded: (postId: string, comment: Comment) => void;
  emitLikeUpdated: (postId: string, likes: number, userId: string) => void;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
  unreadNotificationsCount: 0,
  setUnreadNotificationsCount: () => {},
  onlineUsers: [],
  // Initialisation des nouveaux callbacks
  onPostAction: () => {},
  onCommentAdded: () => {},
  onLikeUpdated: () => {},
  emitPostCreated: () => {},
  emitPostUpdated: () => {},
  emitPostDeleted: () => {},
  emitCommentAdded: () => {},
  emitLikeUpdated: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = user?.id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      const newSocket = io("https://vocal-echo-social-backend.onrender.com", {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connecté");
        setIsConnected(true);
        newSocket.emit("join", userId);
        newSocket.emit("getOnlineUsers"); // Demande la liste des utilisateurs en ligne
      });

      newSocket.on("disconnect", () => {
        console.log("Socket déconnecté");
        setIsConnected(false);
      });

      newSocket.on("notification", (notification: Notification) => {
        console.log("Notification reçue:", notification);
        setUnreadNotificationsCount((prev) => prev + 1);

        toast({
          title: `${notification.fromUser.username} ${notification.message}`,
          description: `il y a quelques secondes`,
          action: notification.postId ? (
            <button
              onClick={() => navigate(`/notifications/${notification.id}`)}
              className="underline"
            >
              Voir
            </button>
          ) : undefined,
        });
      });

      // Gestion des utilisateurs en ligne
      newSocket.on("onlineUsers", (userIds: string[]) => {
        setOnlineUsers(userIds);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, userId, toast, navigate]);

  // Implémentation des nouvelles fonctions pour les callbacks
  const onPostAction = (callback: (data: PostAction) => void) => {
    if (!socket) return;
    
    // Création d'un post
    socket.on("post:created", (post: Post) => {
      callback({ post, action: "create" });
    });
    
    // Mise à jour d'un post
    socket.on("post:updated", (post: Post) => {
      callback({ post, action: "update" });
    });
    
    // Suppression d'un post
    socket.on("post:deleted", (postId: string) => {
      callback({ post: { id: postId } as Post, action: "delete" });
    });
    
    return () => {
      socket.off("post:created");
      socket.off("post:updated");
      socket.off("post:deleted");
    };
  };
  
  const onCommentAdded = (callback: (data: CommentAction) => void) => {
    if (!socket) return;
    
    socket.on("comment:created", (data: CommentAction) => {
      callback(data);
    });
    
    return () => {
      socket.off("comment:created");
    };
  };
  
  const onLikeUpdated = (callback: (data: LikeAction) => void) => {
    if (!socket) return;
    
    socket.on("post:liked", (data: LikeAction) => {
      callback(data);
    });
    
    return () => {
      socket.off("post:liked");
    };
  };
  
  // Fonctions pour émettre des événements
  const emitPostCreated = (post: Post) => {
    if (socket && isConnected) {
      socket.emit("post:create", post);
    }
  };
  
  const emitPostUpdated = (post: Post) => {
    if (socket && isConnected) {
      socket.emit("post:update", post);
    }
  };
  
  const emitPostDeleted = (postId: string) => {
    if (socket && isConnected) {
      socket.emit("post:delete", postId);
    }
  };
  
  const emitCommentAdded = (postId: string, comment: Comment) => {
    if (socket && isConnected) {
      socket.emit("comment:create", { postId, comment });
    }
  };
  
  const emitLikeUpdated = (postId: string, likes: number, userId: string) => {
    if (socket && isConnected) {
      socket.emit("post:like", { postId, likes, userId });
    }
  };

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      unreadNotificationsCount,
      setUnreadNotificationsCount,
      onlineUsers,
      // Ajout des nouvelles fonctions
      onPostAction,
      onCommentAdded,
      onLikeUpdated,
      emitPostCreated,
      emitPostUpdated,
      emitPostDeleted,
      emitCommentAdded,
      emitLikeUpdated
    }),
    [socket, isConnected, unreadNotificationsCount, onlineUsers]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
