/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Logo from "@/components/Logo";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation simple de l'email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://vocal-echo-social-backend.onrender.com/api/auth/forgot-password', { email });

      toast({
        title: "Email envoyé",
        description: "Si cette adresse est associée à un compte, vous recevrez un email avec un nouveau mot de passe",
      });

      // Redirection vers la page de connexion
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center px-4 sm:px-0">
          <Link
            to="/login"
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
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Entrez votre email pour recevoir un nouveau mot de passe
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-300"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="dark:text-gray-300">
                Adresse email
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Exemple : user_name@gmail.com"
                  className={`w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    error ? "border-red-500" : ""
                  }`}
                />
                <Mail
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {error}
                </p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-voicify-orange hover:bg-voicify-orange/90 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></span>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Réinitialiser mon mot de passe</span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
