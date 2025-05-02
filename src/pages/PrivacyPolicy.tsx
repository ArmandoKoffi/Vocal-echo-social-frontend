
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Politique de confidentialité</h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
              <p>Chez VocalExpress, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Informations que nous collectons</h2>
              <p>Nous collectons les types d'informations suivants :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Informations d'inscription :</strong> Nom d'utilisateur, adresse email et genre lors de la création de votre compte.</li>
                <li><strong>Contenu utilisateur :</strong> Notes vocales, descriptions et commentaires que vous publiez sur la plateforme.</li>
                <li><strong>Informations techniques :</strong> Adresse IP, type de navigateur, appareil utilisé, pages visitées et actions effectuées sur la plateforme.</li>
                <li><strong>Informations de profil :</strong> Photo de profil et biographie que vous choisissez de partager.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Utilisation des informations</h2>
              <p>Nous utilisons vos informations pour :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Fournir, maintenir et améliorer notre service</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Communiquer avec vous concernant votre compte ou le service</li>
                <li>Assurer la sécurité de notre plateforme et de nos utilisateurs</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Partage des informations</h2>
              <p>Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos informations dans les circonstances suivantes :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Avec d'autres utilisateurs, conformément aux paramètres de confidentialité que vous avez choisis</li>
                <li>Avec nos fournisseurs de services qui nous aident à exploiter la plateforme</li>
                <li>Pour se conformer à la loi ou à une procédure judiciaire</li>
                <li>Pour protéger les droits, la propriété ou la sécurité de VocalExpress, de nos utilisateurs ou du public</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Sécurité des données</h2>
              <p>Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos informations contre l'accès non autorisé, l'altération, la divulgation ou la destruction. Ces mesures comprennent le chiffrement des données, l'accès restreint aux informations personnelles et l'utilisation de protocoles de sécurité standards du secteur.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Vos droits</h2>
              <p>Vous disposez de certains droits concernant vos informations personnelles :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Accéder à vos informations personnelles</li>
                <li>Corriger les informations inexactes</li>
                <li>Supprimer vos informations personnelles</li>
                <li>Limiter ou vous opposer au traitement de vos données</li>
                <li>Exporter vos données dans un format portable</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Cookies et technologies similaires</h2>
              <p>Nous utilisons des cookies et d'autres technologies similaires pour améliorer votre expérience, comprendre comment notre service est utilisé et personnaliser notre contenu. Vous pouvez contrôler l'utilisation des cookies au niveau du navigateur, mais cela pourrait affecter certaines fonctionnalités de notre service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Modifications de cette politique</h2>
              <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page et en vous envoyant une notification via notre service ou par email.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">9. Contact</h2>
              <p>Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse suivante : armandokoffikoffi@gmail.com</p>
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

export default PrivacyPolicy;
