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

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
  unreadNotificationsCount: 0,
  setUnreadNotificationsCount: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = user?.id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      const newSocket = io("https://vocal-echo-social-backend.onrender.com", {
        transports: ["websocket"],
        autoConnect: true,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connecté");
        setIsConnected(true);
        newSocket.emit("join", userId);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket déconnecté");
        setIsConnected(false);
      });

      newSocket.on("notification", (notification: Notification) => {
        console.log("Notification reçue:", notification);
        setUnreadNotificationsCount(prev => prev + 1);
        
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

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, userId, toast, navigate]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      unreadNotificationsCount,
      setUnreadNotificationsCount,
    }),
    [socket, isConnected, unreadNotificationsCount]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
