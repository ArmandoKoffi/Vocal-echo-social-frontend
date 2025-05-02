import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import NotificationItem, {
  NotificationProps,
} from "@/components/NotificationItem";
import RecordButton from "@/components/RecordButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/authApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/notifications");
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les notifications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Notifications
            </h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune notification pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
