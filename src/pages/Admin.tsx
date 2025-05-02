import React from "react";
import AdminNavBar from "@/components/AdminNavBar";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const Admin = () => {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/home" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <AdminNavBar />
      <div className="py-6 animate-fade-in">
        <AdminDashboard />
      </div>
    </motion.div>
  );
};

export default Admin;
