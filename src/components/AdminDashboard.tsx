import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SocketContext } from "@/contexts/SocketContext";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Flag,
  MoreHorizontal,
  Trash,
  User,
  Volume2,
  Users,
  FileAudio,
  MessageSquare,
  BarChart,
  Clock,
  LayoutDashboard,
  X,
  Circle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/authApi";

// Types
interface Report {
  id: string;
  postId: string;
  postAuthor: string;
  postAuthorAvatar: string;
  reportedBy: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  audioUrl: string;
  details?: string;
}

interface UserReport {
  id: string;
  reportedBy: {
    username: string;
    avatar: string;
  };
  reason: string;
  details?: string;
  status: string;
  createdAt: string;
  post?: {
    id: string;
    audioUrl: string;
    description?: string;
  };
}

interface UserType {
  id: string;
  username: string;
  avatar: string;
  email: string;
  status: "active" | "warning" | "banned";
  postCount: number;
  reportCount: number;
  joinedAt: string;
  isAdmin?: boolean;
  isOnline?: boolean;
}

interface Post {
  id: string;
  audioUrl: string;
  audioDuration: number;
  description: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  username: string;
  avatar: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  averageResponseTime: string;
  onlineUsers?: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        onClick={togglePlayPause}
        disabled={!audioUrl}
      >
        <Volume2 size={16} className="mr-2" />
        {isPlaying ? "Pause" : "Écouter"}
      </Button>
      {!audioUrl ? (
        <span className="ml-3 text-sm text-red-500 dark:text-red-400">
          Audio non disponible
        </span>
      ) : (
        <audio ref={audioRef} src={audioUrl} className="hidden" />
      )}
    </div>
  );
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  confirmVariant = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{title}</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userPosts, setUserPosts] = useState<Record<string, Post[]>>({});
  const [userReports, setUserReports] = useState<Record<string, UserReport[]>>(
    {}
  );
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
    averageResponseTime: "0 heures",
    onlineUsers: 0,
  });
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    confirmText: string;
    confirmVariant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | null
      | undefined;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: async () => {},
    confirmText: "Confirmer",
    confirmVariant: "default",
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const fetchUsers = React.useCallback(async () => {
    try {
      const response = await api.get("/admin/users");
      const fetchedUsers = response.data.data || [];
      setUsers(fetchedUsers);
      return fetchedUsers;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des utilisateurs",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const fetchUserPosts = async (userId: string) => {
    if (userPosts[userId]) return;

    try {
      const response = await api.get(`/posts/user/${userId}`);
      setUserPosts((prev) => ({
        ...prev,
        [userId]: response.data.data || [],
      }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des publications de l'utilisateur ${userId}:`,
        error
      );
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les publications",
        variant: "destructive",
      });
    }
  };

  const fetchUserReports = async (userId: string) => {
    try {
      const response = await api.get(`/admin/user-reports/${userId}`);
      setUserReports((prev) => ({
        ...prev,
        [userId]: response.data.data || [],
      }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des signalements de l'utilisateur ${userId}:`,
        error
      );
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les signalements",
        variant: "destructive",
      });
    }
  };

  const fetchReports = React.useCallback(async () => {
    try {
      const response = await api.get("/admin/reports");
      setReports(response.data.data || []);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les signalements",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await api.get("/admin/stats");
      const fetchedStats = response.data.data;
      setStats(fetchedStats);
      return fetchedStats;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les statistiques",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: userIds.includes(user.id),
        }))
      );
    });

    socket.on("newUser", async () => {
      await fetchUsers();
      await fetchStats();
      toast({
        title: "Nouvel utilisateur",
        description: "Un nouvel utilisateur s'est inscrit",
      });
    });

    socket.on("newReport", async () => {
      await fetchReports();
      await fetchStats();
      toast({
        title: "Nouveau signalement",
        description: "Un nouveau signalement a été créé",
        variant: "destructive",
      });
    });

    socket.on("userStatusChanged", async () => {
      await fetchUsers();
      await fetchStats();
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("newUser");
      socket.off("newReport");
      socket.off("userStatusChanged");
    };
  }, [socket, toast, fetchReports, fetchStats, fetchUsers]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchUsers(), fetchReports(), fetchStats()]);
      } catch (error) {
        console.error("Erreur lors du chargement des données admin:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'administration",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();

    if (socket) {
      socket.emit("getOnlineUsers");
    }

    const refreshInterval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [toast, socket, fetchReports, fetchStats, fetchUsers]);

  const filteredReports = filterStatus
    ? reports.filter((report) => report.status === filterStatus)
    : reports;

  const handleReportAction = async (
    id: string,
    action: "resolve" | "dismiss" | "delete"
  ) => {
    try {
      if (action === "delete") {
        await api.delete(`/admin/reports/${id}`);
        setReports(reports.filter((report) => report.id !== id));
        toast({
          title: "Signalement supprimé",
          description: "Le signalement a été supprimé avec succès.",
        });
        return;
      }

      const status = action === "resolve" ? "resolved" : "dismissed";
      await api.put(`/admin/reports/${id}`, { status });

      setReports(
        reports.map((report) => {
          if (report.id === id) {
            return { ...report, status };
          }
          return report;
        })
      );

      await fetchStats();

      toast({
        title:
          action === "resolve" ? "Signalement résolu" : "Signalement ignoré",
        description:
          action === "resolve"
            ? "Le signalement a été marqué comme résolu."
            : "Le signalement a été ignoré.",
      });
    } catch (error) {
      console.error(`Erreur lors de l'action sur le signalement:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter cette action",
        variant: "destructive",
      });
    }
  };

  const handleUserAction = async (
    userId: string,
    action: "warn" | "ban" | "activate" | "admin" | "removeAdmin"
  ) => {
    const actionMessages = {
      warn: {
        title: "Avertir l'utilisateur",
        description:
          "Êtes-vous sûr de vouloir envoyer un avertissement à cet utilisateur ?",
        confirmText: "Avertir",
        variant: "outline" as const,
      },
      ban: {
        title: "Bannir l'utilisateur",
        description: "Êtes-vous sûr de vouloir bannir cet utilisateur ?",
        confirmText: "Bannir",
        variant: "destructive" as const,
      },
      activate: {
        title: "Activer l'utilisateur",
        description: "Êtes-vous sûr de vouloir réactiver cet utilisateur ?",
        confirmText: "Activer",
        variant: "default" as const,
      },
      admin: {
        title: "Promouvoir administrateur",
        description:
          "Êtes-vous sûr de vouloir accorder les droits d'administrateur ?",
        confirmText: "Promouvoir",
        variant: "default" as const,
      },
      removeAdmin: {
        title: "Retirer les droits admin",
        description:
          "Êtes-vous sûr de vouloir retirer les droits d'administrateur ?",
        confirmText: "Retirer",
        variant: "outline" as const,
      },
    };

    const message = actionMessages[action];

    const executeAction = async () => {
      try {
        let endpoint = `/admin/users/${userId}/status`;
        let data = {};

        if (action === "admin" || action === "removeAdmin") {
          endpoint = `/admin/users/${userId}/role`;
          data = { isAdmin: action === "admin" };
        } else {
          const status =
            action === "warn"
              ? "warning"
              : action === "ban"
              ? "banned"
              : "active";
          data = { status };
        }

        await api.put(endpoint, data);

        setUsers(
          users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status:
                    action === "warn"
                      ? "warning"
                      : action === "ban"
                      ? "banned"
                      : "active",
                  isAdmin:
                    action === "admin"
                      ? true
                      : action === "removeAdmin"
                      ? false
                      : u.isAdmin,
                }
              : u
          )
        );

        toast({
          title: "Action effectuée",
          description: message.title,
        });

        if (socket && (action === "ban" || action === "activate")) {
          socket.emit("adminAction", {
            userId,
            action: action === "ban" ? "banned" : "activated",
          });
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "L'action n'a pas pu être effectuée",
          variant: "destructive",
        });
      }
    };

    setConfirmDialog({
      isOpen: true,
      title: message.title,
      description: message.description,
      action: executeAction,
      confirmText: message.confirmText,
      confirmVariant: message.variant,
    });
  };

  const handleConfirmAction = async () => {
    await confirmDialog.action();
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const toggleUserDetails = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      await Promise.all([fetchUserPosts(userId), fetchUserReports(userId)]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de bord d'administration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les utilisateurs, les signalements et surveillez les activités
          sur la plateforme
        </p>
      </motion.div>

      <Tabs
        defaultValue="dashboard"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="dashboard"
            className="rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Flag className="h-4 w-4 mr-2" />
            Signalements
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <User className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
                    <Users className="h-5 w-5 mr-2 text-voicify-orange" />
                    Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.totalUsers}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                        <span>
                          <span className="text-blue-500 font-medium">
                            {stats.onlineUsers || 0}
                          </span>{" "}
                          en ligne
                        </span>
                        <span>
                          <span className="text-green-500 font-medium">
                            {stats.activeUsers}
                          </span>{" "}
                          actifs
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
                    <FileAudio className="h-5 w-5 mr-2 text-voicify-blue" />
                    Publications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.totalPosts}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Publications vocales
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
                    <Flag className="h-5 w-5 mr-2 text-red-500" />
                    Signalements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.totalReports}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="text-orange-500 font-medium">
                          {stats.pendingReports}
                        </span>{" "}
                        en attente
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    Temps de réponse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.averageResponseTime}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        En moyenne pour résoudre un signalement
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">
                    Signalements récents
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-voicify-blue"
                    onClick={() => setSelectedTab("reports")}
                  >
                    Voir tous
                  </Button>
                </CardTitle>
                <CardDescription>
                  Les 5 derniers signalements de contenu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="space-y-4">
                    {reports.slice(0, 5).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between border-b dark:border-gray-700 pb-3"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={report.postAuthorAvatar}
                              alt="Avatar"
                            />
                            <AvatarFallback>
                              {report.postAuthor.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium dark:text-white">
                              Signalement contre @{report.postAuthor}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Par {report.reportedBy} •{" "}
                              {formatDate(report.createdAt)}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            report.status === "pending"
                              ? "outline"
                              : report.status === "resolved"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            report.status === "pending"
                              ? "text-orange-500 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-900/20"
                              : report.status === "resolved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }
                        >
                          {report.status === "pending"
                            ? "En attente"
                            : report.status === "resolved"
                            ? "Résolu"
                            : "Ignoré"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">
                    Utilisateurs en ligne
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-voicify-blue"
                    onClick={() => setSelectedTab("users")}
                  >
                    Voir tous
                  </Button>
                </CardTitle>
                <CardDescription>
                  Les utilisateurs actuellement connectés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="space-y-4">
                    {users
                      .filter((user) => user.isOnline)
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between border-b dark:border-gray-700 pb-3"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.avatar} alt="Avatar" />
                                <AvatarFallback>
                                  {user.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                            </div>
                            <div>
                              <div className="font-medium dark:text-white flex items-center">
                                {user.username}
                                {user.isAdmin && (
                                  <Badge className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          >
                            En ligne
                          </Badge>
                        </div>
                      ))}
                    {users.filter((user) => user.isOnline).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400">
                          Aucun utilisateur en ligne pour le moment
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">
                    Utilisateurs récents
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-voicify-blue"
                    onClick={() => setSelectedTab("users")}
                  >
                    Voir tous
                  </Button>
                </CardTitle>
                <CardDescription>
                  Les 5 derniers utilisateurs inscrits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="space-y-4">
                    {[...users]
                      .sort(
                        (a, b) =>
                          new Date(b.joinedAt).getTime() -
                          new Date(a.joinedAt).getTime()
                      )
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between border-b dark:border-gray-700 pb-3"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.avatar} alt="Avatar" />
                                <AvatarFallback>
                                  {user.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {user.isOnline && (
                                <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium dark:text-white flex items-center">
                                {user.username}
                                {user.isAdmin && (
                                  <Badge className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(user.joinedAt)}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "warning"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : user.status === "warning"
                                ? "text-orange-500 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-900/20"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }
                          >
                            {user.status === "active"
                              ? "Actif"
                              : user.status === "warning"
                              ? "Averti"
                              : "Banni"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-200">
                Gestion des signalements
              </CardTitle>
              <CardDescription>
                Examinez et traitez les signalements de contenu inapproprié
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-md" />
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredReports.length} signalements{" "}
                      {filterStatus
                        ? filterStatus === "pending"
                          ? "en attente"
                          : filterStatus === "resolved"
                          ? "résolus"
                          : "ignorés"
                        : "au total"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${
                          !filterStatus ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => setFilterStatus(null)}
                      >
                        Tous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${
                          filterStatus === "pending"
                            ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                            : ""
                        }`}
                        onClick={() => setFilterStatus("pending")}
                      >
                        En attente
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${
                          filterStatus === "resolved"
                            ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : ""
                        }`}
                        onClick={() => setFilterStatus("resolved")}
                      >
                        Résolus
                      </Button>
                    </div>
                  </div>

                  {filteredReports.length === 0 ? (
                    <div className="text-center py-10">
                      <Flag className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Aucun signalement{" "}
                        {filterStatus
                          ? filterStatus === "pending"
                            ? "en attente"
                            : filterStatus === "resolved"
                            ? "résolu"
                            : "ignoré"
                          : ""}{" "}
                        trouvé
                      </p>
                    </div>
                  ) : (
                    <Accordion
                      type="single"
                      collapsible
                      className="border-none"
                    >
                      {filteredReports.map((report) => (
                        <AccordionItem
                          key={report.id}
                          value={report.id}
                          className="mb-4 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center mb-3 sm:mb-0">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage
                                  src={report.postAuthorAvatar}
                                  alt="Avatar"
                                />
                                <AvatarFallback>
                                  {report.postAuthor.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium dark:text-white">
                                  Signalement contre @{report.postAuthor}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Par {report.reportedBy} •{" "}
                                  {formatDate(report.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  report.status === "pending"
                                    ? "outline"
                                    : report.status === "resolved"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`mr-3 ${
                                  report.status === "pending"
                                    ? "text-orange-500 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-900/20"
                                    : report.status === "resolved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                              >
                                {report.status === "pending"
                                  ? "En attente"
                                  : report.status === "resolved"
                                  ? "Résolu"
                                  : "Ignoré"}
                              </Badge>
                              <AccordionTrigger className="hover:no-underline p-0">
                                <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
                                  Détails{" "}
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </span>
                              </AccordionTrigger>
                            </div>
                          </div>
                          <AccordionContent className="px-4 pb-4 pt-0">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raison du signalement:
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">
                                {report.reason}
                              </div>
                              {report.details && (
                                <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                  <span className="font-medium">Détails:</span>{" "}
                                  {report.details}
                                </div>
                              )}
                            </div>

                            <div className="mb-4">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Audio signalé:
                              </div>
                              <AudioPlayer audioUrl={report.audioUrl} />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              {report.status === "pending" && (
                                <>
                                  <Button
                                    onClick={() =>
                                      handleReportAction(report.id, "resolve")
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Résoudre
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleReportAction(report.id, "dismiss")
                                    }
                                  >
                                    <X className="h-4 w-4 mr-2" /> Ignorer
                                  </Button>
                                </>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40 dark:bg-gray-800 dark:border-gray-700"
                                >
                                  <DropdownMenuItem
                                    className="text-red-600 dark:text-red-400 cursor-pointer dark:hover:bg-gray-700 focus:bg-red-50 dark:focus:bg-red-900/20"
                                    onClick={() => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        title: "Supprimer le signalement",
                                        description:
                                          "Êtes-vous sûr de vouloir supprimer définitivement ce signalement ?",
                                        action: async () =>
                                          handleReportAction(
                                            report.id,
                                            "delete"
                                          ),
                                        confirmText: "Supprimer",
                                        confirmVariant: "destructive",
                                      });
                                    }}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-200">
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Administrez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-md" />
                    ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {users.length === 0 ? (
                    <div className="text-center py-10">
                      <Users className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Aucun utilisateur trouvé
                      </p>
                    </div>
                  ) : (
                    <Table className="w-full">
                      <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                          <TableHead className="text-left">
                            Utilisateur
                          </TableHead>
                          <TableHead className="text-left">Email</TableHead>
                          <TableHead className="text-center">
                            Publications
                          </TableHead>
                          <TableHead className="text-center">
                            Signalements
                          </TableHead>
                          <TableHead className="text-center">Statut</TableHead>
                          <TableHead className="text-center">
                            Présence
                          </TableHead>
                          <TableHead className="text-center">
                            Inscription
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <React.Fragment key={user.id}>
                            <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="relative">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarImage
                                        src={user.avatar}
                                        alt="Avatar"
                                      />
                                      <AvatarFallback>
                                        {user.username.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {user.isOnline && (
                                      <span className="absolute bottom-0 right-1 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                                    )}
                                  </div>
                                  <div className="font-medium dark:text-white">
                                    {user.username}
                                    {user.isAdmin && (
                                      <Badge className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                        Admin
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {user.email}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                  onClick={() => toggleUserDetails(user.id)}
                                >
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {user.postCount}
                                  </span>
                                  <ChevronDown
                                    className={`h-4 w-4 ml-1 transition-transform ${
                                      expandedUser === user.id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </Button>
                              </TableCell>
                              <TableCell className="text-center">
                                {user.reportCount > 0 ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => toggleUserDetails(user.id)}
                                  >
                                    <span className="text-red-500 dark:text-red-400 font-medium">
                                      {user.reportCount}
                                    </span>
                                    <ChevronDown
                                      className={`h-4 w-4 ml-1 transition-transform ${
                                        expandedUser === user.id
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                ) : (
                                  <span className="text-gray-500 dark:text-gray-400">
                                    0
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    user.status === "active"
                                      ? "default"
                                      : user.status === "warning"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className={
                                    user.status === "active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : user.status === "warning"
                                      ? "text-orange-500 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-900/20"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }
                                >
                                  {user.status === "active"
                                    ? "Actif"
                                    : user.status === "warning"
                                    ? "Averti"
                                    : "Banni"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    user.isOnline ? "default" : "secondary"
                                  }
                                  className={
                                    user.isOnline
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }
                                >
                                  {user.isOnline ? "En ligne" : "Hors ligne"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center text-gray-600 dark:text-gray-400">
                                {formatDate(user.joinedAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56 dark:bg-gray-800 dark:border-gray-700"
                                  >
                                    <DropdownMenuLabel className="dark:text-gray-300">
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                                    {user.status !== "warning" && (
                                      <DropdownMenuItem
                                        className="cursor-pointer dark:hover:bg-gray-700"
                                        onClick={() =>
                                          handleUserAction(user.id, "warn")
                                        }
                                      >
                                        <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                                        <span>Avertir l'utilisateur</span>
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        className="cursor-pointer dark:hover:bg-gray-700"
                                        onClick={() =>
                                          handleUserAction(user.id, "ban")
                                        }
                                      >
                                        <X className="mr-2 h-4 w-4 text-red-500" />
                                        <span>Bannir l'utilisateur</span>
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "active" && (
                                      <DropdownMenuItem
                                        className="cursor-pointer dark:hover:bg-gray-700"
                                        onClick={() =>
                                          handleUserAction(user.id, "activate")
                                        }
                                      >
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        <span>Activer l'utilisateur</span>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                                    {!user.isAdmin ? (
                                      <DropdownMenuItem
                                        className="cursor-pointer dark:hover:bg-gray-700"
                                        onClick={() =>
                                          handleUserAction(user.id, "admin")
                                        }
                                      >
                                        <LayoutDashboard className="mr-2 h-4 w-4 text-purple-500" />
                                        <span>Promouvoir administrateur</span>
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        className="cursor-pointer dark:hover:bg-gray-700"
                                        onClick={() =>
                                          handleUserAction(
                                            user.id,
                                            "removeAdmin"
                                          )
                                        }
                                      >
                                        <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500" />
                                        <span>Retirer administrateur</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>

                            {expandedUser === user.id && (
                              <TableRow className="bg-gray-50 dark:bg-gray-900/20">
                                <TableCell colSpan={8} className="p-0">
                                  <div className="px-4 py-3">
                                    <Tabs defaultValue="posts">
                                      <TabsList className="mb-4">
                                        <TabsTrigger value="posts">
                                          Publications ({user.postCount})
                                        </TabsTrigger>
                                        <TabsTrigger value="reports">
                                          Signalements ({user.reportCount})
                                        </TabsTrigger>
                                      </TabsList>

                                      <TabsContent value="posts">
                                        {!userPosts[user.id] ? (
                                          <div className="flex items-center justify-center p-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                                          </div>
                                        ) : userPosts[user.id].length === 0 ? (
                                          <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                                            Aucune publication trouvée pour cet
                                            utilisateur
                                          </p>
                                        ) : (
                                          <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                                            {userPosts[user.id].map((post) => (
                                              <div
                                                key={post.id}
                                                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <Avatar className="h-8 w-8 mr-3">
                                                      <AvatarImage
                                                        src={post.avatar}
                                                      />
                                                      <AvatarFallback>
                                                        {post.username.charAt(
                                                          0
                                                        )}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                      <p className="font-medium dark:text-white">
                                                        {post.username}
                                                      </p>
                                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(
                                                          post.timestamp
                                                        )}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                      <MessageSquare className="h-4 w-4 mr-1" />
                                                      {post.commentsCount || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="mr-1"
                                                      >
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                      </svg>
                                                      {post.likes}
                                                    </span>
                                                  </div>
                                                </div>
                                                {post.description && (
                                                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                                                    {post.description}
                                                  </p>
                                                )}
                                                <div className="mt-3">
                                                  <AudioPlayer
                                                    audioUrl={post.audioUrl}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </TabsContent>

                                      <TabsContent value="reports">
                                        {!userReports[user.id] ? (
                                          <div className="flex items-center justify-center p-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                                          </div>
                                        ) : userReports[user.id].length ===
                                          0 ? (
                                          <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                                            Aucun signalement trouvé pour cet
                                            utilisateur
                                          </p>
                                        ) : (
                                          <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                                            {userReports[user.id].map(
                                              (report) => (
                                                <div
                                                  key={report.id}
                                                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                                                >
                                                  <div className="flex justify-between items-start">
                                                    <div className="flex items-center">
                                                      <Avatar className="h-8 w-8 mr-3">
                                                        <AvatarImage
                                                          src={
                                                            report.reportedBy
                                                              .avatar
                                                          }
                                                        />
                                                        <AvatarFallback>
                                                          {report.reportedBy.username.charAt(
                                                            0
                                                          )}
                                                        </AvatarFallback>
                                                      </Avatar>
                                                      <div>
                                                        <p className="font-medium dark:text-white">
                                                          Signalé par @
                                                          {
                                                            report.reportedBy
                                                              .username
                                                          }
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                          {formatDate(
                                                            report.createdAt
                                                          )}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <Badge
                                                      variant="outline"
                                                      className="text-sm"
                                                    >
                                                      {report.status ===
                                                      "pending"
                                                        ? "En attente"
                                                        : report.status ===
                                                          "resolved"
                                                        ? "Résolu"
                                                        : "Ignoré"}
                                                    </Badge>
                                                  </div>

                                                  <div className="mt-3 pl-11">
                                                    <p className="text-sm font-medium dark:text-gray-300">
                                                      Raison:
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                      {report.reason}
                                                    </p>

                                                    {report.details && (
                                                      <>
                                                        <p className="text-sm font-medium dark:text-gray-300 mt-2">
                                                          Détails:
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                          {report.details}
                                                        </p>
                                                      </>
                                                    )}

                                                    {report.post && (
                                                      <div className="mt-3">
                                                        <p className="text-sm font-medium dark:text-gray-300">
                                                          Publication concernée:
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                          {report.post
                                                            .description ||
                                                            "Aucune description"}
                                                        </p>
                                                        <AudioPlayer
                                                          audioUrl={
                                                            report.post.audioUrl
                                                          }
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        confirmVariant={confirmDialog.confirmVariant}
      />
    </div>
  );
};

export default AdminDashboard;

