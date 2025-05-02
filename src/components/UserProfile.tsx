import React from "react";
import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoicePost, { VoicePostProps } from "./VoicePost";

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    gender: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
  posts: VoicePostProps[];
  isCurrentUserProfile: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  posts,
  isCurrentUserProfile,
}) => {
  const getProfileColor = () => {
    switch (user.gender) {
      case "male":
        return "from-blue-500 to-blue-700";
      case "female":
        return "from-pink-500 to-purple-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        {/* Cover Photo */}
        <div
          className={`h-32 bg-gradient-to-r ${getProfileColor()} relative`}
        ></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between -mt-12">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-lg">
                  <UserIcon size={32} />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {user.bio || "Aucune bio"}
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <span className="font-bold">{user.postsCount}</span>
              <p className="text-xs text-gray-500">Publications</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user.followersCount}</span>
              <p className="text-xs text-gray-500">Abonnés</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user.followingCount}</span>
              <p className="text-xs text-gray-500">Abonnements</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full bg-white dark:bg-gray-800">
          <TabsTrigger value="posts" className="flex-1">
            Publications
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1">
            J'aime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <VoicePost key={post.id} {...post} />)
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Aucune publication pour le moment
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="mt-4 space-y-4">
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune publication aimée pour le moment
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
