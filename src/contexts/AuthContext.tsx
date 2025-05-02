import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, getCurrentUser } from "@/api/authApi";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  rememberMe: false,
  setRememberMe: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState<boolean>(
    localStorage.getItem("rememberMe") === "true"
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await getCurrentUser();
          setUser(data.data);
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setToken(null);
          setUser(null);
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          navigate("/landing");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token, toast, navigate]);

  const login = (newToken: string, userData: User) => {
    if (rememberMe) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("token", newToken);
      localStorage.removeItem("rememberMe");
    }

    setToken(newToken);
    setUser(userData);

    toast({
      title: "Connexion réussie",
      description: (
        <span>
          Bienvenue, <strong>{userData.username}</strong>, sur VocalExpress !
        </span>
      ),
    });

    navigate("/home");
  };

  const logout = () => {
    const username = user?.username || "";

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);

    toast({
      title: "Déconnexion réussie",
      description: (
        <span>
          À bientôt, <strong>{username}</strong>. VocalExpress vous remercie de
          votre fidélité !
        </span>
      ),
    });

    navigate("/landing");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
        rememberMe,
        setRememberMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
