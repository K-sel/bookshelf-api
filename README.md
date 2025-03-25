# 📚 Bookshelf API

Une API REST moderne pour la gestion d'une bibliothèque personnelle, développée avec des technologies de nouvelles génération.

## 📑 Table des matières
- [À propos du projet](#-à-propos-du-projet)
- [Transition de Deno à Node.js](#-transition-de-deno-à-nodejs)
- [Stack Technologique](#️-stack-technologique)
- [Pourquoi cette stack?](#-pourquoi-cette-stack)
- [Endpoints API](#-endpoints-api)
- [Format des Réponses API](#-format-des-réponses-api)
- [Structure des Données](#-structure-des-données)
- [Statut du Projet](#-statut-du-projet)
- [Changelog](#-changelog)
- [Ce que j'ai appris](#-ce-que-jai-appris)

## 🌟 À propos du projet

Bookshelf est une API REST conçue pour permettre aux utilisateurs de gérer leur collection de livres de manière simple et efficace. Elle offre toutes les fonctionnalités CRUD (Create, Read, Update, Delete) nécessaires pour manipuler une bibliothèque personnelle.

Ce projet représente un défi d'apprentissage personnel significatif, car j'ai développé cette API entièrement seul - il s'agit en fait de ma toute première API REST. Je me suis formé à des technologies que je n'avais jamais utilisées auparavant, comme TypeScript, Node.js et Express.js.

Mon apprentissage s'est principalement appuyé sur la documentation officielle, qui est remarquablement bien fournie, ainsi que sur des tutoriels de YouTubeurs généreux qui partagent gratuitement leurs connaissances. Pour certains aspects plus complexes, j'ai également utilisé Claude 3.7 sonnet comme outil d'assistance, mais toujours de manière réfléchie et critique - en m'assurant de comprendre chaque ligne de code suggérée et en l'adaptant à mon architecture, plutôt qu'en copiant aveuglément des solutions. Avec ce défi, j'ai également pu mettre en relation des concepts récemment acquis lors de mon Bachelor, notamment la logique MVC (Modèle-Vue-Contrôleur) et le routage que j'avais découverts avec Laravel, et les appliquer dans un contexte technologique différent. Cette démarche autodidacte démontre ma capacité à maîtriser rapidement de nouvelles technologies, à transférer des connaissances entre différents frameworks, et surtout ma détermination à relever des défis techniques complexes.

## 📝 Transition de Deno à Node.js

Après avoir initialement développé ce projet avec Deno, j'ai pris la décision stratégique de migrer vers Node.js. Cette transition a été motivée par plusieurs considérations pratiques :

Bien que Deno offre des avantages notables comme le compilateur TypeScript intégré, le linting par défaut et un modèle de sécurité plus strict, j'ai constaté que l'écosystème de bibliothèques disponibles reste encore limité par rapport à npm. Pour un projet en évolution comme celui-ci, l'accès à un écosystème mature et diversifié de packages s'est avéré crucial.

Cette migration m'a permis de :
- Accéder à une plus grande variété de bibliothèques et outils via npm
- Bénéficier de solutions plus matures pour l'intégration avec MySQL
- Faciliter la collaboration potentielle avec d'autres développeurs plus familiers avec l'écosystème Node.js
- Simplifier le déploiement grâce à la multitude de services d'hébergement optimisés pour Node.js

Cette décision illustre ma capacité à évaluer objectivement les technologies et à faire des choix pragmatiques pour le bien du projet, sans m'attacher dogmatiquement à des choix technologiques initiaux lorsque d'autres solutions s'avèrent plus adaptées.

## 🛠️ Stack Technologique

Ce projet a été délibérément construit avec des technologies robustes et sécurisées:

- **[Node.js](https://nodejs.org/)** - Un environnement d'exécution JavaScript côté serveur fiable et largement adopté
- **[TypeScript](https://www.typescriptlang.org/)** - Apporte la vérification de types statique, améliorant la robustesse du code et réduisant les erreurs potentielles à l'exécution.
- **[npm](https://www.npmjs.com/)** - Le plus grand écosystème de bibliothèques open source au monde
- **[Express](https://expressjs.com/)** - Framework web éprouvé pour la création d'APIs RESTful.
- **[MySQL2](https://github.com/sidorares/node-mysql2)** - Client MySQL performant avec support des promesses et des requêtes préparées
- **[UUID](https://github.com/uuidjs/uuid)** - Génération d'identifiants uniques pour les livres et utilisateurs.
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Bibliothèque robuste pour le hachage sécurisé des mots de passe.

## 🔐 Pourquoi cette stack?

Le choix de ces technologies a été guidé par plusieurs facteurs:

### Écosystème Mature
Node.js et npm offrent accès à des milliers de bibliothèques robustes et bien maintenues, ce qui permet d'accélérer le développement tout en bénéficiant des meilleures pratiques de la communauté.

### Robustesse du Typage
TypeScript permet de détecter de nombreuses erreurs avant même l'exécution du code, rendant l'application plus fiable. Les interfaces clairement définies pour les modèles de livres et d'utilisateurs garantissent l'intégrité des données.

### Architecture Moderne
L'utilisation du modèle RESTful avec des réponses bien structurées et des codes HTTP appropriés assure une intégration facile avec n'importe quel front-end ou service tiers.

## 🌐 Endpoints API

### Livres
- `GET /books` - Récupérer la liste complète des livres
- `GET /books/:id` - Récupérer un livre spécifique par son ID
- `GET /books/status/:status` - Récupérer tous les livres avec un statut spécifique
- `POST /books` - Ajouter un nouveau livre
- `PATCH /books/:id` - Mettre à jour le statut d'un livre existant
- `DELETE /books/:id` - Supprimer un livre

### Utilisateurs
- `POST /users` - Créer un nouvel utilisateur
- `POST /users/login` - Authentifier un utilisateur
- `PATCH /users/:id` - Mettre à jour les informations d'un utilisateur
- `DELETE /users` - Supprimer un compte utilisateur

## 📊 Format des Réponses API

Toutes les réponses de l'API suivent une structure cohérente pour faciliter l'intégration:

### Réponses avec succès:

```json
{
  "success": true,
  "data": { /* Les données demandées */ },
  "message": "Description de l'opération réussie"
}
```

### Réponses d'erreur:

```json
{
  "success": false,
  "message": "Description courte de l'erreur",
  "error": "Détails supplémentaires sur l'erreur"
}
```

### Codes HTTP utilisés:

- `200` - Requête traitée avec succès (GET)
- `201` - Ressource créée avec succès (POST)
- `204` - Requête traitée avec succès, pas de contenu retourné (PATCH, DELETE)
- `400` - Requête incorrecte (validation échouée)
- `401` - Non autorisé (authentification échouée)
- `404` - Ressource non trouvée
- `409` - Conflit (par exemple, tentative de modification vers un statut identique)
- `422` - Entité non traitable (validation de format échouée)
- `500` - Erreur serveur interne

## 📋 Structure des Données

### Livre
```typescript
interface Book {
  id: string;          // UUID généré automatiquement
  title: string;       // Titre du livre
  author: string;      // Auteur du livre
  status: string;      // "read", "to-read", ou "pending"
  cover: string;       // Chemin vers l'image de couverture
  summary: string;     // Résumé ou description du livre
}
```

### Utilisateur
```typescript
interface User {
  id: string;          // UUID généré automatiquement
  name: string;        // Nom de l'utilisateur
  firstname: string;   // Prénom de l'utilisateur
  age: number;         // Âge de l'utilisateur
  language: string;    // Langue préférée (fr, it, en, de)
  email: string;       // Adresse email (unique)
  password: string;    // Mot de passe (haché avec bcryptjs)
  isAdmin: boolean;    // Indique si l'utilisateur est administrateur
}
```

## 🚧 Statut du Projet
Ce projet est actuellement **en développement actif**. L'API de base est complète, la gestion des utilisateurs est implémentée, et je travaille maintenant sur l'association des livres aux utilisateurs et les fonctionnalités de sécurité avancées.

## 📝 Changelog

### v1.2.0 (Current)
- ✅ Migration de Deno vers Node.js pour bénéficier d'un écosystème plus large de bibliothèques
- ✅ Refactoring complet du code pour l'adapter à l'environnement Node.js
- ✅ Intégration de MySQL2 avec support des promesses pour une meilleure gestion des requêtes
- ✅ Optimisation des performances et de la gestion des erreurs
- ✅ Documentation mise à jour pour refléter les changements technologiques
- ✅ Hachage sécurisé des mots de passe avec bcryptjs

### v1.1.0
- ✅ Système complet de gestion des utilisateurs (CRUD)
- ✅ Route POST `/users` pour créer un nouvel utilisateur
- ✅ Route POST `/users/login` pour authentifier un utilisateur
- ✅ Route PATCH `/users/:id` pour mettre à jour les informations d'un utilisateur
- ✅ Route DELETE `/users` pour supprimer un compte utilisateur
- ✅ Validation des données utilisateur (email, langue, etc.)
- ✅ Documentation complète des nouveaux endpoints et fonctionnalités

### v1.0.0
- ✅ Route DELETE `/books/:id` pour supprimer un livre
- ✅ Documentation complète de toutes les fonctions et endpoints dans ce README.cd
- ✅ API CRUD complète avec gestion robuste des erreurs
- ✅ Implémentation des bonnes pratiques REST pour les codes de statut HTTP
- ✅ Finalisation et stabilisation de l'architecture de base

### v0.3.0
- ✅ Route GET `/books/status/:status` pour filtrer les livres par statut
- ✅ Route PATCH `/books/:id` pour mettre à jour le statut d'un livre
- ✅ Validation améliorée des données et des paramètres & Ajout de middlewares de validation
- ✅ Gestion des conflits avec le code 409 pour les mises à jour redondantes
- ✅ Documentation technique complète des endpoints et des fonctions

### v0.2.0
- ✅ Route POST `/books` pour ajouter un livre
- ✅ Validation des données entrantes pour les nouveaux livres
- ✅ Amélioration de la gestion des erreurs avec messages détaillés
- ✅ Utilisation de requêtes préparées pour prévenir les injections SQL
- ✅ Refactoring de l'architecture pour une meilleure séparation des responsabilités

### v0.1.0
- ✅ Mise en place de la structure de base du projet
- ✅ Connexion à la base de données MySQL configurée
- ✅ Middleware de logging des requêtes (requestLogger) implémenté
- ✅ Route GET `/books` pour récupérer tous les livres
- ✅ Route GET `/books/:id` pour récupérer un livre spécifique

### À venir (v2.0.0)
- ⏳ Association des livres aux utilisateurs (bibliothèques personnelles)
- ⏳ Système d'authentification avec JWT
- ⏳ Documentation de l'API avec Swagger

## 🔍 Ce que j'ai appris

Ce projet m'a permis d'approfondir ma compréhension des systèmes d'API modernes et des pratiques de sécurité en développement. J'ai particulièrement apprécié d'explorer les différences entre Deno et Node.js, ce qui m'a permis de mieux comprendre les forces et faiblesses de chaque technologie.

La migration de Deno vers Node.js a été une expérience enrichissante qui m'a appris l'importance de l'adaptabilité dans le développement logiciel. Cette transition m'a donné une perspective précieuse sur les compromis technologiques et m'a aidé à développer un jugement plus nuancé sur le choix des outils.

L'implémentation de la gestion des utilisateurs et de l'authentification m'a également permis de mettre en pratique des concepts avancés de sécurité, notamment le hachage sécurisé des mots de passe et la validation robuste des données utilisateur.

Développé avec 💙 par K-sel !
