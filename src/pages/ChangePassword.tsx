import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "none",
    score: 0,
  });
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Vérifier la force du mot de passe à chaque changement
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ strength: "none", score: 0 });
      return;
    }

    let score = 0;

    // Longueur minimale
    if (newPassword.length >= 8) score += 1;
    if (newPassword.length >= 10) score += 1;

    // Complexité
    if (/[a-z]/.test(newPassword)) score += 1; // Minuscules
    if (/[A-Z]/.test(newPassword)) score += 1; // Majuscules
    if (/[0-9]/.test(newPassword)) score += 1; // Chiffres
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 2; // Caractères spéciaux

    // Classification
    let strength = "faible";
    if (score >= 4) strength = "moyen";
    if (score >= 6) strength = "fort";

    setPasswordStrength({ strength, score });

    // Vérifier si les mots de passe correspondent
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmError("");
    }
  }, [newPassword, confirmPassword]);

  // Vérifier si les mots de passe correspondent à chaque changement
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmError("");
    }
  }, [confirmPassword, newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérification des champs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas");
      toast({
        title: "Erreur de confirmation",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }

    // Soumettre la requête à l'API
    setIsLoading(true);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Mot de passe modifié",
          description: "Votre mot de passe a été modifié avec succès",
        });

        // Redirection vers la page des paramètres
        navigate("/settings");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Désactiver le copier-coller pour le champ de confirmation
  const preventPasteInConfirm = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: "Action non autorisée",
      description:
        "Le collage n'est pas autorisé dans ce champ pour des raisons de sécurité",
      variant: "destructive",
    });
  };

  // Fonction pour obtenir la couleur de l'indicateur de force
  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case "faible":
        return "bg-red-500";
      case "moyen":
        return "bg-yellow-500";
      case "fort":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Fonction pour obtenir le pourcentage de remplissage
  const getStrengthPercentage = () => {
    if (passwordStrength.strength === "none") return "0%";
    const percentage = (passwordStrength.score / 8) * 100;
    return `${Math.min(percentage, 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6 gap-2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="h-8 w-8"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">
            Changer de mot de passe
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password" className="dark:text-gray-300">
                Mot de passe actuel
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={toggleShowCurrentPassword}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="dark:text-gray-300">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={toggleShowNewPassword}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>

              {/* Indicateur de force */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: getStrengthPercentage() }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Force:
                      <span
                        className={`ml-1 font-medium ${
                          passwordStrength.strength === "faible"
                            ? "text-red-500"
                            : passwordStrength.strength === "moyen"
                            ? "text-yellow-500"
                            : passwordStrength.strength === "fort"
                            ? "text-green-500"
                            : ""
                        }`}
                      >
                        {passwordStrength.strength === "none"
                          ? "Non évalué"
                          : passwordStrength.strength}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {newPassword.length}/8 caractères min.
                    </p>
                  </div>
                </div>
              )}

              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                <li className="flex items-center">
                  {newPassword.length >= 8 ? (
                    <Check size={12} className="text-green-500 mr-1" />
                  ) : (
                    <AlertTriangle size={12} className="text-gray-400 mr-1" />
                  )}
                  Au moins 8 caractères
                </li>
                <li className="flex items-center">
                  {/[A-Z]/.test(newPassword) ? (
                    <Check size={12} className="text-green-500 mr-1" />
                  ) : (
                    <AlertTriangle size={12} className="text-gray-400 mr-1" />
                  )}
                  Au moins une majuscule
                </li>
                <li className="flex items-center">
                  {/[0-9]/.test(newPassword) ? (
                    <Check size={12} className="text-green-500 mr-1" />
                  ) : (
                    <AlertTriangle size={12} className="text-gray-400 mr-1" />
                  )}
                  Au moins un chiffre
                </li>
                <li className="flex items-center">
                  {/[^a-zA-Z0-9]/.test(newPassword) ? (
                    <Check size={12} className="text-green-500 mr-1" />
                  ) : (
                    <AlertTriangle size={12} className="text-gray-400 mr-1" />
                  )}
                  Au moins un caractère spécial (recommandé)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="dark:text-gray-300">
                Confirmer le nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onPaste={preventPasteInConfirm}
                  className={`pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    confirmError ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
              {confirmError && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertTriangle size={12} className="mr-1" />
                  {confirmError}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-voicify-orange hover:bg-voicify-orange/90 flex items-center gap-2"
                disabled={
                  isLoading ||
                  !!confirmError ||
                  passwordStrength.strength === "none" ||
                  passwordStrength.strength === "faible"
                }
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                    <span>Modification en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Changer mon mot de passe</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
