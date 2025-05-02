import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems: FAQItem[] = [
    {
      id: "faq1",
      question: "Comment enregistrer une note vocale ?",
      answer:
        "Pour enregistrer une note vocale, cliquez sur le bouton rond orange avec l'icône de microphone situé en bas à droite de votre écran. Vous pourrez alors enregistrer votre message, le mettre en pause si nécessaire, et ajouter une description avant de le publier.",
      category: "Fonctionnalités",
    },
    {
      id: "faq2",
      question: "Comment modifier mon profil ?",
      answer:
        "Pour modifier votre profil, rendez-vous dans les Paramètres en cliquant sur votre avatar puis 'Paramètres'. Dans l'onglet 'Profil', vous pourrez modifier votre nom d'utilisateur, votre email, votre biographie et votre avatar.",
      category: "Compte",
    },
    {
      id: "faq3",
      question: "Comment signaler un contenu inapproprié ?",
      answer:
        "Pour signaler un contenu inapproprié, cliquez sur les trois points verticaux en haut à droite de la publication concernée, puis sélectionnez 'Signaler'. Suivez les instructions pour indiquer la raison du signalement. Notre équipe examinera le contenu dans les plus brefs délais.",
      category: "Communauté",
    },
    {
      id: "faq4",
      question: "Comment modifier mes paramètres de confidentialité ?",
      answer:
        "Pour modifier vos paramètres de confidentialité, accédez aux Paramètres via votre avatar, puis sélectionnez l'onglet 'Confidentialité'. Vous pourrez y définir qui peut voir vos publications, vous envoyer des messages ou commenter vos notes vocales.",
      category: "Confidentialité",
    },
    {
      id: "faq5",
      question: "Comment contacter l'équipe Voicify ?",
      answer:
        "Pour contacter l'équipe Voicify, rendez-vous dans les Paramètres, puis dans l'onglet 'Aide'. Cliquez sur le bouton 'Contact' pour nous envoyer un message. Nous vous répondrons dans les meilleurs délais.",
      category: "Support",
    },
    {
      id: "faq6",
      question: "Puis-je modifier une note vocale après sa publication ?",
      answer:
        "Non, une fois qu'une note vocale est publiée, elle ne peut pas être modifiée. Vous pouvez toutefois la supprimer et en publier une nouvelle si nécessaire.",
      category: "Fonctionnalités",
    },
    {
      id: "faq7",
      question: "Comment supprimer mon compte ?",
      answer:
        "Pour supprimer votre compte, rendez-vous dans les Paramètres, puis dans l'onglet 'Confidentialité'. En bas de la page, vous trouverez l'option 'Supprimer mon compte'. Notez que cette action est irréversible et entraînera la suppression de toutes vos données.",
      category: "Compte",
    },
    {
      id: "faq8",
      question: "Quelle est la durée maximale d'une note vocale ?",
      answer:
        "La durée maximale d'une note vocale est d'une minute (60 secondes). Cette limite permet de garder les contenus concis et pertinents pour tous les utilisateurs.",
      category: "Fonctionnalités",
    },
    {
      id: "faq9",
      question: "Comment passer en mode sombre ?",
      answer:
        "Pour passer en mode sombre, cliquez sur l'icône de soleil/lune dans la barre de navigation. Vous pouvez également configurer ce paramètre dans les 'Paramètres' > 'Apparence'.",
      category: "Interface",
    },
    {
      id: "faq10",
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Oui, la sécurité de vos données est notre priorité. Nous utilisons des protocoles de chiffrement avancés pour protéger vos informations personnelles et vos contenus. Pour plus de détails, consultez notre politique de confidentialité.",
      category: "Confidentialité",
    },
  ];

  const filteredFAQs = searchQuery.trim()
    ? faqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  const categories = [...new Set(faqItems.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <div className="container mx-auto max-w-3xl px-4 py-8">
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
          <h1 className="text-2xl font-bold dark:text-white">
            Questions fréquentes
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </motion.div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryFAQs = filteredFAQs.filter(
                (item) => item.category === category
              );
              if (categoryFAQs.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    {category}
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    {categoryFAQs.map((item, index) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="px-4 py-3 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 dark:text-gray-300">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun résultat trouvé pour "{searchQuery}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-voicify-orange/10 to-voicify-blue/10 p-6 rounded-lg dark:from-voicify-orange/20 dark:to-voicify-blue/20"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter
            directement.
          </p>
          <Button
            onClick={() => navigate("/contact")}
            className="bg-voicify-blue hover:bg-voicify-blue/90"
          >
            Contacter l'équipe
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
