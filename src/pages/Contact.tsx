import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Send, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/api/contactApi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!Object.values(formData).every(Boolean)) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs du formulaire",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);

      toast({
        title: "Message envoyé",
        description:
          "Nous avons bien reçu votre message et y répondrons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6 gap-2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">Contactez-nous</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="dark:text-gray-300">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="dark:text-gray-300">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="dark:text-gray-300">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet de votre message"
                    className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="dark:text-gray-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Détaillez votre demande ici..."
                    className="mt-1 min-h-[150px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-voicify-orange hover:bg-voicify-orange/90 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Nos coordonnées
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                    <Mail className="h-5 w-5 text-voicify-orange" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Email</p>
                    <a
                      href="mailto:armandokoffikoffi@gmail.com"
                      className="text-voicify-blue hover:underline dark:text-blue-400"
                    >
                      armandokoffikoffi@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                    <Phone className="h-5 w-5 text-voicify-orange" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Téléphone</p>
                    <a
                      href="tel:+2250718216848"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      +225 07 18 21 68 48
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                    <MapPin className="h-5 w-5 text-voicify-orange" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">Adresse</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Côte D'Ivoire
                      <br />
                      San Pedro, Bardot
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Heures d'ouverture
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Lundi - Vendredi
                  </span>
                  <span className="font-medium dark:text-white">
                    8h00 - 17h00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Samedi
                  </span>
                  <span className="font-medium dark:text-white">
                    10h00 - 15h00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Dimanche
                  </span>
                  <span className="font-medium dark:text-white">Fermé</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Notre équipe de support répond généralement dans un délai de
                  24 heures ouvrées.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-voicify-orange to-voicify-blue text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Besoin d'une réponse rapide ?
              </h3>
              <p className="mb-4 text-white/90">
                Consultez notre FAQ pour trouver des réponses aux questions les
                plus fréquentes.
              </p>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={() => navigate("/faq")}
              >
                Voir la FAQ
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
