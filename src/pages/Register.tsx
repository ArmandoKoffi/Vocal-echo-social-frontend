import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, AlertTriangle, Check } from "lucide-react";
import { register } from "@/api/authApi";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import Logo from "@/components/Logo";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordFeedback, setPasswordFeedback] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie si les mots de passe correspondent
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    // Évalue la force du mot de passe
    const checkPasswordStrength = () => {
      let strength = 0;
      const feedback = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
      };

      if (feedback.length) strength += 20;
      if (feedback.lowercase) strength += 20;
      if (feedback.uppercase) strength += 20;
      if (feedback.number) strength += 20;
      if (feedback.special) strength += 20;

      setPasswordFeedback(feedback);
      setPasswordStrength(strength);
    };

    checkPasswordStrength();
  }, [password]);

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Faible";
    if (passwordStrength < 80) return "Moyen";
    return "Fort";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si le mot de passe est suffisamment fort
    if (passwordStrength < 60) {
      toast({
        title: "Mot de passe trop faible",
        description:
          "Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions d'utilisation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({ username, email, password, gender });

      if (response.success) {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vous connecter avec vos identifiants.",
        });

        // Rediriger vers la page de connexion au lieu de connecter automatiquement
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Échec de l'inscription",
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Fonction pour prévenir le copier-coller du mot de passe
  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: "Action non autorisée",
      description:
        "Veuillez saisir votre mot de passe manuellement pour des raisons de sécurité.",
      variant: "destructive",
    });
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
          Créer un nouveau compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou{" "}
          <Link
            to="/login"
            className="font-medium text-voicify-orange hover:text-voicify-orange/90"
          >
            connectez-vous à votre compte existant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="dark:text-gray-300">
                Nom d'utilisateur
              </Label>
              <div className="mt-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Exemple : Koffi Armand"
                  className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

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
              <Label htmlFor="gender" className="dark:text-gray-300">
                Genre
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) =>
                  setGender(value as "male" | "female" | "other")
                }
                className="mt-2 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="dark:text-gray-300">
                    Homme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="dark:text-gray-300">
                    Femme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="dark:text-gray-300">
                    Autre
                  </Label>
                </div>
              </RadioGroup>
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
                  autoComplete="new-password"
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

              {password && (
                <div className="mt-2 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span>Force: {getStrengthLabel()}</span>
                      <span>{password.length}/8 caractères min.</span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className="h-1.5"
                      indicatorClassName={getStrengthColor()}
                    />
                  </div>

                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center">
                      {passwordFeedback.length ? (
                        <Check size={12} className="text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle
                          size={12}
                          className="text-red-500 mr-1"
                        />
                      )}
                      <span
                        className={
                          passwordFeedback.length
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        Au moins 8 caractères
                      </span>
                    </li>
                    <li className="flex items-center">
                      {passwordFeedback.uppercase ? (
                        <Check size={12} className="text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle
                          size={12}
                          className="text-red-500 mr-1"
                        />
                      )}
                      <span
                        className={
                          passwordFeedback.uppercase
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        Au moins une majuscule
                      </span>
                    </li>
                    <li className="flex items-center">
                      {passwordFeedback.number ? (
                        <Check size={12} className="text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle
                          size={12}
                          className="text-red-500 mr-1"
                        />
                      )}
                      <span
                        className={
                          passwordFeedback.number
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        Au moins un chiffre
                      </span>
                    </li>
                    <li className="flex items-center">
                      {passwordFeedback.special ? (
                        <Check size={12} className="text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle
                          size={12}
                          className="text-gray-500 mr-1"
                        />
                      )}
                      <span
                        className={
                          passwordFeedback.special
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        Au moins un caractère spécial (recommandé)
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="dark:text-gray-300">
                Confirmer le mot de passe
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  onPaste={preventCopyPaste}
                  onCopy={preventCopyPaste}
                  className={`w-full pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    !passwordsMatch && confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertTriangle size={12} className="mr-1" />
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-voicify-orange focus:ring-voicify-orange border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                J'accepte les{" "}
                <Link
                  to="/terms-of-service"
                  className="text-voicify-blue hover:underline"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/privacy-policy"
                  className="text-voicify-blue hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-voicify-orange hover:bg-voicify-orange/90"
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
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
                  Ou s'inscrire avec
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
                      "Inscription Google non disponible dans cette démo",
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
                      "Inscription Facebook non disponible dans cette démo",
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

export default Register;
