import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import VoicePost, { VoicePostProps } from "@/components/VoicePost";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X, User } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { searchPosts } from "@/api/postsApi";
import { searchUsers, SearchResult } from "@/api/usersApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [postResults, setPostResults] = useState<VoicePostProps[]>([]);
  const [userResults, setUserResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPostResults([]);
      setUserResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Recherche parallèle des posts et des utilisateurs
      const [postsResponse, usersResponse] = await Promise.all([
        searchPosts(searchQuery),
        searchUsers(searchQuery)
      ]);
      
      setPostResults(postsResponse || []);
      setUserResults(usersResponse || []);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPostResults([]);
    setUserResults([]);
  };

  const navigateToUserProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setPostResults([]);
      setUserResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <motion.h1
          className="text-2xl font-bold mb-6 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Rechercher
        </motion.h1>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des notes vocales ou utilisateurs..."
              className="pl-10 pr-10 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={18}
            />

            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={clearSearch}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-voicify-orange hover:bg-voicify-orange/90"
            >
              {isSearching ? "Recherche en cours..." : "Rechercher"}
            </Button>
          </div>
        </motion.div>

        {(postResults.length > 0 || userResults.length > 0) && (
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="posts">
                Notes vocales ({postResults.length})
              </TabsTrigger>
              <TabsTrigger value="users">
                Utilisateurs ({userResults.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              {postResults.length > 0 ? (
                <div className="space-y-4">
                  {postResults.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <VoicePost {...post} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune note vocale trouvée pour "{searchQuery}"
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users">
              {userResults.length > 0 ? (
                <div className="space-y-4">
                  {userResults.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      onClick={() => navigateToUserProfile(user._id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium dark:text-white">{user.username}</h3>
                          {user.bio && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{user.bio}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun utilisateur trouvé pour "{searchQuery}"
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {searchQuery.trim() !== "" && !isSearching && postResults.length === 0 && userResults.length === 0 && (
          <motion.div
            className="text-center py-8 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Aucun résultat trouvé pour "{searchQuery}"
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
