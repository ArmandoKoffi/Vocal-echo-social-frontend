
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/register" className="flex items-center text-gray-500 hover:text-voicify-orange transition-colors">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Retour à l'inscription</span>
          </Link>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8 transition-colors duration-300"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Conditions d'utilisation</h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Acceptation des conditions</h2>
              <p>En accédant à VocalExpress, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, vous êtes interdit d'utiliser ou d'accéder à ce site.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Description du service</h2>
              <p>VocalExpress est une plateforme de partage de notes vocales qui permet aux utilisateurs de s'exprimer par la voix. Les utilisateurs peuvent enregistrer, partager et interagir avec des messages vocaux créés par d'autres utilisateurs.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Droits et responsabilités</h2>
              <p>En utilisant VocalExpress, vous vous engagez à :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Fournir des informations exactes lors de l'inscription</li>
                <li>Maintenir la sécurité de votre compte et mot de passe</li>
                <li>Ne pas utiliser le service pour des activités illégales ou préjudiciables</li>
                <li>Ne pas harceler, menacer ou intimider d'autres utilisateurs</li>
                <li>Ne pas publier de contenu offensant, diffamatoire, violent ou inapproprié</li>
                <li>Respecter les droits de propriété intellectuelle d'autrui</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Propriété intellectuelle</h2>
              <p>Tout le contenu publié sur VocalExpress reste la propriété de son créateur. En publiant du contenu, vous accordez à VocalExpress une licence mondiale, non exclusive, transférable et libre de redevance pour utiliser, reproduire, modifier, adapter, publier, traduire et distribuer votre contenu sur la plateforme.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Limitation de responsabilité</h2>
              <p>VocalExpress ne garantit pas que le service sera ininterrompu, sécurisé ou exempt d'erreurs. Vous utilisez la plateforme à vos propres risques. VocalExpress ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Modification des conditions</h2>
              <p>VocalExpress se réserve le droit de modifier ces conditions à tout moment. Il est de votre responsabilité de vérifier régulièrement les conditions d'utilisation pour vous tenir informé des changements.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Résiliation</h2>
              <p>VocalExpress se réserve le droit, à sa seule discrétion, de résilier votre accès à tout ou partie du service, avec ou sans préavis, pour toute raison, y compris, sans limitation, une violation des conditions d'utilisation.</p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dernière mise à jour : 18 avril 2025
            </p>
            <div className="mt-4">
              <Link 
                to="/register" 
                className="text-voicify-orange hover:text-voicify-orange/90 font-medium"
              >
                Retourner à l'inscription
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
