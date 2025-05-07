import api from "./authApi";

// Types
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  message: string;
  timestamp: string;
  read: boolean;
  fromUser: {
    id: string;
    username: string;
    avatar: string;
  };
  postId?: string;
  post?: {
    id: string;
    audioUrl: string;
    description?: string;
    timestamp: string;
  };
}

// Functions for notifications
export const getAllNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data.data;
};

export const getUnreadNotificationsCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data.data.count;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data.data;
};

export const getNotification = async (notificationId: string) => {
  const response = await api.get(`/notifications/${notificationId}`);
  return response.data.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

