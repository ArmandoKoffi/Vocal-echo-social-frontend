import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

const AdminNavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <motion.nav
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md sticky top-0 z-50 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="flex justify-between h-16 items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="#" className="flex items-center">
              <div className="flex items-center gap-2">
                <Logo />
                <span className="text-xl font-montserrat font-bold text-voicify-blue dark:text-white">
                  Admin
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Boutons */}
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-red-600 dark:text-red-400"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default AdminNavBar;
