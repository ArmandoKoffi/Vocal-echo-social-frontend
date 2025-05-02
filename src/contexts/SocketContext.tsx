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

interface SocketContextProps {
  socket: any;
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // On mémorise l'ID utilisateur pour éviter les recréations inutiles
  const userId = user?.id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Créer la connexion socket
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket"],
        autoConnect: true,
      });

      setSocket(newSocket);

      // Événements socket
      newSocket.on("connect", () => {
        console.log("Socket connecté");
        setIsConnected(true);
        newSocket.emit("join", userId); // Utilisation de userId mémorisé
      });

      newSocket.on("disconnect", () => {
        console.log("Socket déconnecté");
        setIsConnected(false);
      });

      newSocket.on("notification", (notification: Notification) => {
        toast({
          title: `${notification.fromUser.username} ${notification.message}`,
          description: `il y a quelques secondes`,
          action: notification.postId ? (
            <a href={`/notifications/${notification.id}`} className="underline">
              Voir
            </a>
          ) : undefined,
        });
      });

      // Nettoyer à la déconnexion
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, userId, toast]); // Dépendances plus précises

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
