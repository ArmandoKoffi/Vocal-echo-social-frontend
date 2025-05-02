import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, User, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface UserInfo {
  id: string;
  username: string;
  avatar: string;
}

export interface NotificationProps {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  message: string;
  timestamp: string;
  read: boolean;
  fromUser: UserInfo;
  postId?: string;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  timestamp,
  read,
  fromUser,
  postId,
}) => {
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: fr,
  });
  const linkTo =
    type === "follow" ? `/profile/${fromUser.id}` : `/notifications/${id}`;

  const getNotificationIcon = () => {
    switch (type) {
      case "like":
        return <Heart className="text-red-500" size={16} />;
      case "comment":
        return <MessageCircle className="text-blue-500" size={16} />;
      case "follow":
        return <User className="text-green-500" size={16} />;
      case "mention":
        return <AtSign className="text-purple-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={linkTo}
        className={`flex gap-4 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          !read ? "bg-blue-50 dark:bg-blue-900/10" : ""
        }`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={fromUser.avatar} alt={fromUser.username} />
          <AvatarFallback>{fromUser.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate dark:text-white">
              <span>{fromUser.username}</span>
              <span className="text-gray-600 dark:text-gray-300">
                {" "}
                {message}
              </span>
            </p>
            {!read && (
              <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              {getNotificationIcon()}
              <span>{formattedTime}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NotificationItem;
 