# 📚 Bookshelf API

Une API REST moderne pour la gestion d'une bibliothèque personnelle, développée avec des technologies de nouvelles génération.

## 🌟 À propos du projet

Bookshelf est une API REST conçue pour permettre aux utilisateurs de gérer leur collection de livres de manière simple et efficace. Elle offre toutes les fonctionnalités CRUD (Create, Read, Update, Delete) nécessaires pour manipuler une bibliothèque personnelle.

Ce projet représente un défi d'apprentissage personnel significatif, car j'ai développé cette API entièrement seul - il s'agit en fait de ma toute première API REST. Je me suis formé à des technologies que je n'avais jamais utilisées auparavant, comme TypeScript, Deno et Express.js.

Mon apprentissage s'est principalement appuyé sur la documentation officielle de Deno, qui est remarquablement bien fournie, ainsi que sur des tutoriels de YouTubeurs généreux qui partagent gratuitement leurs connaissances. Pour certains aspects plus complexes, j'ai également utilisé Claude 3.7 sonnet comme outil d'assistance, mais toujours de manière réfléchie et critique - en m'assurant de comprendre chaque ligne de code suggérée et en l'adaptant à mon architecture, plutôt qu'en copiant aveuglément des solutions. Avec ce défi, j'ai également pu mettre en relation des concepts récemment acquis lors de mon Bachelor, notamment la logique MVC (Modèle-Vue-Contrôleur) et le routage que j'avais découverts avec Laravel, et les appliquer dans un contexte technologique différent. Cette démarche autodidacte démontre ma capacité à maîtriser rapidement de nouvelles technologies, à transférer des connaissances entre différents frameworks, et surtout ma détermination à relever des défis techniques complexes.

## 🛠️ Stack Technologique

Ce projet a été délibérément construit avec des technologies robustes et sécurisées:

- **[Deno](https://deno.land/)** - Un runtime JavaScript/TypeScript moderne qui offre une sécurité renforcée par défaut, contrairement à Node.js qui donne un accès illimité aux ressources système.
- **[TypeScript](https://www.typescriptlang.org/)** - Apporte la vérification de types statique, améliorant la robustesse du code et réduisant les erreurs potentielles à l'exécution.
- **[JSR](https://jsr.io/)** - Le gestionnaire de paquets officiel de Deno, offrant une alternative moderne et sécurisée à npm.
- **[Express](https://expressjs.com/)** - Framework web éprouvé pour la création d'APIs RESTful.
- **[MySQL](https://www.mysql.com/)** - Système de gestion de base de données relationnelle robuste et éprouvé.
- **[UUID](https://github.com/uuidjs/uuid)** - Génération d'identifiants uniques pour les livres.

## 🔐 Pourquoi cette stack?

Le choix de ces technologies a été guidé par plusieurs facteurs:

### Sécurité Renforcée
Deno offre un modèle de sécurité basé sur les permissions explicites, contrairement à Node.js qui donne un accès illimité aux ressources système. Cela signifie que l'application ne peut accéder qu'aux ressources auxquelles elle est explicitement autorisée.

### Robustesse du Typage
TypeScript permet de détecter de nombreuses erreurs avant même l'exécution du code, rendant l'application plus fiable. Les interfaces clairement définies pour les modèles de livres garantissent l'intégrité des données.

### Architecture Moderne
L'utilisation du modèle RESTful avec des réponses bien structurées et des codes HTTP appropriés assure une intégration facile avec n'importe quel front-end ou service tiers.

## 🌐 Endpoints API

- `GET /books` - Récupérer la liste complète des livres
- `GET /books/:id` - Récupérer un livre spécifique par son ID
- `GET /books/status/:status` - Récupérer tous les livres avec un statut spécifique
- `POST /books` - Ajouter un nouveau livre
- `PATCH /books/:id` - Mettre à jour le statut d'un livre existant
- `DELETE /books/:id` - Supprimer un livre

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
- `404` - Ressource non trouvée
- `409` - Conflit (par exemple, tentative de modification vers un statut identique)
- `500` - Erreur serveur interne

## 📋 Structure des Données

Un livre est représenté par l'objet suivant:

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

## 🚧 Statut du Projet
Ce projet est actuellement **en développement actif**. L'API de base est complète, et je travaille maintenant sur les fonctionnalités avancées et la sécurité.

## 📝 Changelog

### v1.0.0 (Current)
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
- ⏳ Système d'authentification avec JWT
- ⏳ Gestion des utilisateurs (inscription, connexion)
- ⏳ Collections de livres par utilisateur
- ⏳ Amélioration de la configuration CORS pour une meilleure sécurité
- ⏳ Stockage sécurisé des tokens JWT en cookies HttpOnly
- ⏳ Documentation de l'API avec Swagger

## 🔍 Ce que j'ai appris

Ce projet m'a permis d'approfondir ma compréhension des systèmes d'API modernes et des pratiques de sécurité en développement. J'ai particulièrement apprécié la découverte de l'écosystème Deno et son approche "sécurité par défaut", ainsi que l'application des principes REST pour créer une API cohérente et intuitive.

Développé avec 💙 par K-sel !!!