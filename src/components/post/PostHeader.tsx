import React from "react";
import { MoreVertical, Pencil, Flag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PostHeaderProps {
  userId: string;
  username: string;
  avatar: string;
  timestamp: string;
  onDelete: () => void;
  onReport: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  userId,
  username,
  avatar,
  timestamp,
  onDelete,
  onReport,
}) => {
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm dark:text-white">{username}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formattedTime}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {userId === "current-user" ? (
            <>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={onDelete}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className="cursor-pointer" onClick={onReport}>
              <Flag className="mr-2 h-4 w-4" />
              <span>Signaler</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostHeader;
 