/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile, resetUserAvatar } from "@/api/usersApi";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Moon,
  Sun,
  User,
  Bell,
  Shield,
  Lock,
  HelpCircle,
  Save,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();

  // États pour les formulaires
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(
    user?.bio || "Passionné de musique et de podcasts."
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [accountPrivate, setAccountPrivate] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

const handleSaveProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response = await updateUserProfile(formData);

    // Mise à jour du contexte avec cache busting
    updateUser({
      ...response.data,
      avatar: `${response.data.avatar}?t=${Date.now()}`,
    });

    toast({
      title: "Profil mis à jour",
      description: "Votre profil a été mis à jour avec succès",
    });
  } catch (error: any) {
    toast({
      title: "Erreur",
      description: error.response?.data?.message || "Échec de la mise à jour",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleResetAvatar = async () => {
    setIsSubmitting(true);
    try {
      const response = await resetUserAvatar();

      // Mise à jour du contexte avec cache busting
      updateUser({
        ...response.data,
        avatar: `${response.data.avatar}?t=${Date.now()}`,
      });

      // Réinitialiser le prévisualisateur
      setAvatarFile(null);
      setAvatarPreview(response.data.avatar);

      toast({
        title: "Photo de profil réinitialisé",
        description: "Votre photo de profil a été réinitialisé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Échec de la réinitialisation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
  };

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Paramètres de confidentialité mis à jour",
      description: "Vos paramètres ont été enregistrés avec succès.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Format invalide",
          description: "Seuls les JPG/PNG sont acceptés",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop lourd",
          description: "Maximum 5MB autorisé",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8 font-montserrat"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Paramètres du compte
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 px-4 py-3 transition-colors rounded-t-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-voicify-orange"
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 px-4 py-3 transition-colors rounded-t-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-voicify-orange"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="flex items-center gap-2 px-4 py-3 transition-colors rounded-t-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-voicify-orange"
              >
                <Shield className="h-4 w-4" />
                <span>Confidentialité</span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 px-4 py-3 transition-colors rounded-t-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-voicify-orange"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>Apparence</span>
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="flex items-center gap-2 px-4 py-3 transition-colors rounded-t-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-voicify-orange"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Aide</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage
                        src={
                          avatarPreview ||
                          user?.avatar ||
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=John"
                        }
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 w-full dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Changer votre image
                      </label>
                      <button
                        onClick={handleResetAvatar}
                        className="outline-button w-full text-sm font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" disabled={isSubmitting}
                      >
                        Réinitialiser l'image
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <Label htmlFor="username" className="dark:text-gray-300">
                        Nom d'utilisateur
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="dark:text-gray-300">
                        Adresse email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="dark:text-gray-300">
                        Biographie
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full mt-1 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-voicify-orange hover:bg-voicify-orange/90 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting
                      ? "Enregistrement..."
                      : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="notifications" className="p-6">
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">
                        Notifications in-app
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recevoir des notifications dans l'application
                      </p>
                    </div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                        className="data-[state=checked]:bg-voicify-orange"
                      />
                    </motion.div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4 dark:text-white">
                      Préférences de notification
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="new-followers"
                          type="checkbox"
                          className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          defaultChecked
                        />
                        <label
                          htmlFor="new-followers"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                        >
                          Nouveaux abonnés
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="comments"
                          type="checkbox"
                          className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          defaultChecked
                        />
                        <label
                          htmlFor="comments"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                        >
                          Commentaires sur mes publications
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="likes"
                          type="checkbox"
                          className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          defaultChecked
                        />
                        <label
                          htmlFor="likes"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                        >
                          J'aime sur mes publications
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="mentions"
                          type="checkbox"
                          className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          defaultChecked
                        />
                        <label
                          htmlFor="mentions"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                        >
                          Mentions
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-voicify-orange hover:bg-voicify-orange/90 transition-colors"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les préférences
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="privacy" className="p-6">
              <form onSubmit={handleSavePrivacy} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">
                        Compte privé
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Seuls vos abonnés pourront voir vos publications
                      </p>
                    </div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Switch
                        checked={accountPrivate}
                        onCheckedChange={setAccountPrivate}
                        className="data-[state=checked]:bg-voicify-orange"
                      />
                    </motion.div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4 dark:text-white">
                      Qui peut :
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="who-comment"
                          className="text-sm font-medium dark:text-gray-300"
                        >
                          Commenter vos publications
                        </Label>
                        <select
                          id="who-comment"
                          aria-label="Qui peut commenter vos publications"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-voicify-orange focus:border-voicify-orange sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          defaultValue="everyone"
                        >
                          <option value="everyone">Tout le monde</option>
                          <option value="followers">
                            Seulement mes abonnés
                          </option>
                          <option value="nobody">Personne</option>
                        </select>
                      </div>

                      <div>
                        <Label
                          htmlFor="who-message"
                          className="text-sm font-medium dark:text-gray-300"
                        >
                          Vous envoyer des messages
                        </Label>
                        <select
                          id="who-message"
                          aria-label="Qui peut vous envoyer des messages"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-voicify-orange focus:border-voicify-orange sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          defaultValue="followers"
                        >
                          <option value="everyone">Tout le monde</option>
                          <option value="followers">
                            Seulement mes abonnés
                          </option>
                          <option value="nobody">Personne</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4 dark:text-white">
                      Sécurité
                    </h3>

                    <Button
                      variant="outline"
                      className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => navigate("/settings/password")}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Changer de mot de passe
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-voicify-orange hover:bg-voicify-orange/90 transition-colors"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="appearance" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium dark:text-white">Thème</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Choisissez entre le mode clair et le mode sombre
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col items-center gap-2 ${
                        theme === "light"
                          ? "border-voicify-orange bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => theme !== "light" && toggleTheme()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sun
                        className={`h-8 w-8 ${
                          theme === "light"
                            ? "text-voicify-orange"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span
                        className={
                          theme === "light"
                            ? "font-medium text-voicify-orange"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        Mode clair
                      </span>
                    </motion.div>

                    <motion.div
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col items-center gap-2 ${
                        theme === "dark"
                          ? "border-voicify-orange dark:bg-orange-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => theme !== "dark" && toggleTheme()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Moon
                        className={`h-8 w-8 ${
                          theme === "dark"
                            ? "text-voicify-orange"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span
                        className={
                          theme === "dark"
                            ? "font-medium text-voicify-orange"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        Mode sombre
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="help" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium dark:text-white">
                    Centre d'aide
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Vous avez des questions sur l'application ? Consultez notre
                    centre d'aide ou contactez-nous.
                  </p>
                </div>

                <div className="space-y-4">
                  <motion.div
                    className="border rounded-lg p-4 dark:border-gray-700 hover:shadow-md transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h4 className="text-lg font-medium mb-2 dark:text-white">
                      Questions fréquentes
                    </h4>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/faq"
                          className="text-voicify-blue hover:underline cursor-pointer dark:text-blue-400"
                        >
                          Comment enregistrer une note vocale ?
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/faq"
                          className="text-voicify-blue hover:underline cursor-pointer dark:text-blue-400"
                        >
                          Comment modifier mon profil ?
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/faq"
                          className="text-voicify-blue hover:underline cursor-pointer dark:text-blue-400"
                        >
                          Comment signaler un contenu inapproprié ?
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/faq"
                          className="text-voicify-blue hover:underline cursor-pointer dark:text-blue-400"
                        >
                          Comment modifier mes paramètres de confidentialité ?
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/faq"
                          className="text-voicify-blue hover:underline cursor-pointer dark:text-blue-400"
                        >
                          Comment contacter l'équipe Voicify ?
                        </Link>
                      </li>
                    </ul>

                    <Button
                      className="mt-4 bg-voicify-blue hover:bg-voicify-blue/90"
                      onClick={() => navigate("/faq")}
                    >
                      Voir toutes les questions
                    </Button>
                  </motion.div>

                  <motion.div
                    className="border rounded-lg p-4 dark:border-gray-700 hover:shadow-md transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h4 className="text-lg font-medium mb-2 dark:text-white">
                      Contactez-nous
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Vous ne trouvez pas la réponse à votre question ?
                      Contactez-nous directement.
                    </p>
                    <Button
                      className="bg-voicify-blue hover:bg-voicify-blue/90"
                      onClick={() => navigate("/contact")}
                    >
                      Contact
                    </Button>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
