import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, MessageSquare, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Logo from "@/components/Logo"; // Ajout de l'import

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Début de la nouvelle navbar */}
      <motion.nav
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md sticky top-0 z-50"
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
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </motion.div>

            {/* Boutons */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-voicify-blue px-4 py-2 rounded-lg transition-colors"
                >
                  Connexion
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/register">
                  <Button className="bg-voicify-orange hover:bg-voicify-orange/90 rounded-lg">
                    S'inscrire
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section avec bouton animé */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold font-montserrat tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-voicify-orange xl:inline">
                  Exprimez-vous
                </span>{" "}
                <span className="block text-voicify-blue xl:inline">
                  avec votre voix
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Découvrez le premier réseau social dédié à la communication
                vocale. Partagez vos idées, vos pensées et vos émotions en 60
                secondes.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-voicify-orange hover:bg-voicify-orange/90 rounded-lg"
                      >
                        Commencer maintenant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto rounded-lg"
                      >
                        Se connecter
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center lg:justify-end">
              <div className="relative w-80 h-80">
                <motion.div
                  className="absolute top-0 left-0 w-64 h-64 bg-voicify-orange/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-56 h-56 bg-voicify-blue/20 rounded-full"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 7,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.div
                      className="absolute w-full h-full bg-voicify-orange rounded-full opacity-20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />
                    <motion.div
                      className="bg-voicify-orange w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mic size={36} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:text-center"
          >
            <h2 className="text-base text-voicify-orange font-semibold tracking-wide uppercase">
              Fonctionnalités
            </h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
              Communiquez différemment
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvrez toutes les possibilités offertes par VocalExpress.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="mt-10"
          >
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-voicify-orange text-white">
                  <Headphones className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Enregistrement de 60 secondes
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Enregistrez vos pensées en un instant et partagez-les avec
                    le monde entier.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-voicify-blue text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Commentaires vocaux
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Répondez aux publications avec votre voix ou du texte, selon
                    votre préférence.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-voicify-orange text-white">
                  <Share2 className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Partage facile
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Partagez vos publications sur d'autres réseaux sociaux en un
                    clic.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-voicify-blue text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Modération intelligente
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Un système avancé de signalement et de modération pour une
                    communauté saine.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-voicify-blue">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-montserrat">
            <span className="block">
              Prêt à rejoindre la révolution vocale?
            </span>
            <span className="block text-voicify-orange">
              Inscrivez-vous gratuitement aujourd'hui.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex rounded-md shadow"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-voicify-blue hover:bg-gray-50 rounded-lg"
                >
                  S'inscrire maintenant
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="mt-8 flex justify-center space-x-6">
            <span className="text-gray-400">
              © 2025 VocalExpress - KOFFI KOFFI ARMAND. Tous droits réservés.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
