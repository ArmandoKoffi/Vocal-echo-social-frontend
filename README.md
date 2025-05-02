
# VocalExpress - Réseau Social Vocal

VocalExpress est un réseau social qui met l'accent sur la communication vocale. Partagez vos notes vocales, aimez et commentez les publications des autres utilisateurs, et construisez votre réseau.

## Fonctionnalités

- Partage de notes vocales
- Commentaires textuels et vocaux
- Système de likes et followers
- Notifications en temps réel
- Profils utilisateurs personnalisables
- Interface adaptative (responsive design)
- Mode sombre / clair

## Pile technologique

### Frontend
- React avec TypeScript
- React Router pour la navigation
- TanStack Query pour la gestion des requêtes
- Tailwind CSS pour le styling
- Shadcn UI pour les composants
- Framer Motion pour les animations
- Socket.io-client pour les communications en temps réel

### Backend
- Node.js avec Express
- MongoDB pour la base de données
- Socket.io pour les communications en temps réel
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe
- Express-fileupload pour la gestion des fichiers

## Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (v4 ou supérieur)

### Installation du frontend

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Installation du backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Démarrer le serveur en mode développement
npm run dev
```

## Structure du projet

### Frontend

```
src/
  ├── api/          # Fonctions d'appels API
  ├── components/   # Composants React réutilisables
  ├── contexts/     # Contextes React (thème, auth, sockets)
  ├── guards/       # Gardes de routes (auth, guest)
  ├── hooks/        # Hooks personnalisés
  ├── lib/          # Utilitaires et fonctions helper
  └── pages/        # Composants de pages
```

### Backend

```
backend/
  ├── middleware/   # Middlewares Express
  ├── models/       # Modèles Mongoose
  ├── routes/       # Routes API
  ├── uploads/      # Fichiers uploadés (audio, avatars)
  └── server.js     # Point d'entrée du serveur
```

## Utilisation

1. Créez un compte utilisateur
2. Explorez les notes vocales sur la page d'accueil
3. Enregistrez vos propres notes vocales
4. Interagissez avec d'autres utilisateurs en aimant et commentant leurs notes
5. Suivez d'autres utilisateurs pour voir leurs publications dans votre fil d'actualité
6. Recevez des notifications lorsque quelqu'un interagit avec votre contenu

## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou à proposer une pull request.

## Licence

Ce projet est sous licence MIT.
