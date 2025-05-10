import React, { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Bell,
  Menu,
  LogOut,
  Settings,
  Moon,
  Sun,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useSocket();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      fetch("/api/healthcheck", {
        method: "HEAD",
        cache: "no-cache",
      })
        .then(() => setIsOnline(true))
        .catch(() => setIsOnline(false));
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="#" className="flex items-center">
                <Logo />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </motion.div>

            {/* Icône Home */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isActive("/")
                    ? "bg-voicify-orange text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => navigate("/")}
              >
                <Home size={20} />
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive("/search") && "bg-voicify-orange text-white"
                  }`}
                >
                  <Search size={20} />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Link to="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive("/notifications") && "bg-voicify-orange text-white"
                  }`}
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 min-w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount > 9
                        ? "9+"
                        : unreadNotificationsCount}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div className="relative" whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="rounded-full overflow-hidden p-0 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt="Avatar" />
                      <AvatarFallback>
                        {user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  <span
                    className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 ${
                      isOnline ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 dark:bg-gray-800 dark:border-gray-700"
              >
                <DropdownMenuLabel className="dark:text-gray-300">
                  Mon compte
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => navigate("/admin")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Administration</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </motion.div>

            <Sheet>
              <SheetTrigger asChild>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <Menu />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[250px] dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex flex-col space-y-4 pt-6">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={user?.avatar} alt="Avatar" />
                        <AvatarFallback>
                          {user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-2 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 ${
                          isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">
                        {user?.username}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                      isActive("/")
                        ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors`}
                  >
                    <Home size={18} />
                    <span>Accueil</span>
                  </Link>
                  <Link
                    to="/search"
                    className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                      isActive("/search")
                        ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors`}
                  >
                    <Search size={18} />
                    <span>Rechercher</span>
                  </Link>
                  <Link
                    to="/notifications"
                    className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                      isActive("/notifications")
                        ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors relative`}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white rounded-full text-xs px-1.5 min-w-5 h-5 flex items-center justify-center">
                        {unreadNotificationsCount > 9
                          ? "9+"
                          : unreadNotificationsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                      isActive("/profile")
                        ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors`}
                  >
                    <User size={18} />
                    <span>Profil</span>
                  </Link>
                  <Link
                    to="/settings"
                    className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                      isActive("/settings")
                        ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors`}
                  >
                    <Settings size={18} />
                    <span>Paramètres</span>
                  </Link>

                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className={`px-3 py-2 rounded-md font-medium flex items-center gap-2 ${
                        isActive("/admin")
                          ? "text-voicify-orange font-semibold bg-orange-50 dark:bg-orange-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <Settings size={18} />
                      <span>Administration</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md font-medium flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-auto transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
