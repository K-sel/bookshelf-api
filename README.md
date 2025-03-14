# 📚 Bookshelf API

Une API REST moderne pour la gestion d'une bibliothèque personnelle, développée avec des technologies de pointe.

## 🌟 À propos du projet

Bookshelf est une API REST conçue pour permettre aux utilisateurs de gérer leur collection de livres de manière simple et efficace. Elle offre toutes les fonctionnalités CRUD (Create, Read, Update, Delete) nécessaires pour manipuler une bibliothèque personnelle.

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
- `POST /books` - Ajouter un nouveau livre
- `PUT /books/:id` - Mettre à jour un livre existant
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

- `200` - Requête traitée avec succès (GET, PUT)
- `201` - Ressource créée avec succès (POST)
- `400` - Requête incorrecte (validation échouée)
- `404` - Ressource non trouvée
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
Ce projet est actuellement **en développement actif**. De nouvelles fonctionnalités sont régulièrement ajoutées et l'architecture est constamment améliorée.

## 📝 Changelog

### v0.2.0 (Current)
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
- ✅ Méthode `queryAll` pour interroger la base de données

### À venir
- ⏳ Routes PUT/DELETE pour modifier/supprimer un livre
- ⏳ Filtrage des livres par statut
- ⏳ Tests automatisés
- ⏳ Documentation de l'API avec Swagger
- ⏳ Mise en place d'un système d'authentification

## 🔍 Ce que j'ai appris

Ce projet m'a permis d'approfondir ma compréhension des systèmes d'API modernes et des pratiques de sécurité en développement. J'ai particulièrement apprécié la découverte de l'écosystème Deno et son approche "sécurité par défaut", ainsi que l'application des principes REST pour créer une API cohérente et intuitive.

Développé avec 💙 par K-sel