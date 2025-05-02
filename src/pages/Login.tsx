import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { login } from "@/api/authApi";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login: authLogin, rememberMe, setRememberMe } = useAuth();

  // Modifications dans la fonction handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      if (response.success) {
        // Mettre à jour le contexte d'authentification
        authLogin(response.token, response.user);

        // Redirection en fonction du rôle de l'utilisateur
        if (response.user?.isAdmin) {
          navigate("/admin"); // Redirection vers le dashboard admin
        } else {
          navigate("/"); // Redirection normale pour les autres utilisateurs
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Échec de la connexion",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center px-4 sm:px-0">
          <Link
            to="/landing"
            className="flex items-center text-gray-500 hover:text-voicify-orange transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Retour</span>
          </Link>
          <Link to="#" className="flex justify-center">
            <div className="flex items-center">
              <Logo />
              <span className="text-6xl font-montserrat font-bold bg-gradient-to-r from-voicify-orange to-voicify-blue bg-clip-text text-transparent ml-9"></span>
            </div>
          </Link>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Connectez-vous à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou{" "}
          <Link
            to="/register"
            className="font-medium text-voicify-orange hover:text-voicify-orange/90"
          >
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="dark:text-gray-300">
                Adresse email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Exemple : user_name@gmail.com"
                  className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="dark:text-gray-300">
                Mot de passe
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-voicify-blue hover:text-voicify-blue/90 dark:text-voicify-blue/90"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-voicify-orange hover:bg-voicify-orange/90"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => {
                  toast({
                    title: "Information",
                    description:
                      "Connexion Google non disponible dans cette démo",
                  });
                }}
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54L20.0303 3.11C17.9903 1.19 15.2103 0 12.0003 0C7.31033 0 3.25033 2.69 1.28033 6.6L5.27033 9.71C6.29033 6.76 8.91033 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.33 17.24 16.07 18.09L19.93 21.19C22.19 19.09 23.49 15.94 23.49 12.27Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26999 14.29C5.02999 13.57 4.89999 12.8 4.89999 12C4.89999 11.2 5.02999 10.43 5.26999 9.71L1.28 6.6C0.47 8.24 0 10.06 0 12C0 13.94 0.47 15.76 1.28 17.4L5.26999 14.29Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24C15.2104 24 17.9904 22.92 20.0004 21.19L16.0704 18.09C15.0004 18.82 13.6204 19.25 12.0004 19.25C8.91035 19.25 6.29035 17.24 5.27035 14.29L1.28035 17.4C3.25035 21.31 7.31035 24 12.0004 24Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => {
                  toast({
                    title: "Information",
                    description:
                      "Connexion Facebook non disponible dans cette démo",
                  });
                }}
              >
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2">Facebook</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
