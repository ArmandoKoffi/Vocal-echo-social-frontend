import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voicify-orange"></div>
      </div>
    );
  }

  // Rediriger vers la page d'accueil si l'utilisateur est déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  // Si l'utilisateur n'est pas authentifié, afficher le contenu pour invités
  return <>{children}</>;
};

export default GuestGuard;
