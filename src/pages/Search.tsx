import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import VoicePost, { VoicePostProps } from "@/components/VoicePost";
import RecordButton from "@/components/RecordButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VoicePostProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await api.get(
        `/posts/search?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.data || []);
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
    setSearchResults([]);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
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

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium dark:text-white">
                Résultats ({searchResults.length})
              </h2>
              {searchResults.map((post, index) => (
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
          ) : searchQuery.trim() !== "" && !isSearching ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucun résultat trouvé pour "{searchQuery}"
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
