// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { booksController } from "../controllers/booksController.ts";
import { validatePostRequestBody, validateGetStatusParams, validatePatchRequestParams } from "../middlewares/booksValidationMiddleware.ts";

const router = express.Router();

/**
* @swagger
* /books:
*   get:
*     summary: Récupère tous les livres
*     description: Retourne la liste complète des livres dans la base de données
*     tags: [Books]
*     responses:
*       200:
*         description: Liste des livres récupérée avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Book'
*                 message:
*                   type: string
*                   example: Livres récupérés avec succès
*       500:
*         description: Erreur serveur
*/
router.get("/", booksController.getAllBooks);

/**
* @swagger
* /books/{id}:
*   get:
*     summary: Récupère un livre par ID
*     description: Retourne les détails d'un livre spécifique identifié par son ID
*     tags: [Books]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: Identifiant unique du livre
*     responses:
*       200:
*         description: Détails du livre récupérés avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   $ref: '#/components/schemas/Book'
*                 message:
*                   type: string
*                   example: Livre récupéré avec succès
*       400:
*         description: ID invalide
*       404:
*         description: Livre non trouvé
*       500:
*         description: Erreur serveur
*/
router.get("/:id", booksController.getBookById);

/**
* @swagger
* /books/status/{status}:
*   get:
*     summary: Récupère les livres par statut de lecture
*     description: Retourne tous les livres correspondant au statut de lecture spécifié
*     tags: [Books]
*     parameters:
*       - in: path
*         name: status
*         required: true
*         schema:
*           type: string
*           enum: [read, to-read, pending]
*         description: Statut de lecture des livres à récupérer
*     responses:
*       200:
*         description: Livres récupérés avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Book'
*                 message:
*                   type: string
*                   example: Livres avec statut 'read' récupérés avec succès
*       400:
*         description: Statut invalide
*       404:
*         description: Aucun livre trouvé avec ce statut
*       422:
*         description: Statut non valide
*       500:
*         description: Erreur serveur
*/
router.get("/status/:status", validateGetStatusParams, booksController.getBookByStatus);

/**
* @swagger
* /books/{id}:
*   patch:
*     summary: Met à jour le statut d'un livre
*     description: Modifie le statut de lecture d'un livre spécifique
*     tags: [Books]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: Identifiant unique du livre
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - status
*             properties:
*               status:
*                 type: string
*                 enum: [read, to-read, pending]
*                 description: Nouveau statut du livre
*     responses:
*       204:
*         description: Statut mis à jour avec succès
*       400:
*         description: Paramètres manquants ou invalides
*       404:
*         description: Livre non trouvé
*       409:
*         description: Conflit - Le statut est déjà celui demandé
*       422:
*         description: Statut non valide
*       500:
*         description: Erreur serveur
*/
router.patch("/:id", validatePatchRequestParams, validateGetStatusParams, booksController.updateStatus);

/**
* @swagger
* /books/{id}:
*   delete:
*     summary: Supprime un livre
*     description: Supprime définitivement un livre de la base de données
*     tags: [Books]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: Identifiant unique du livre à supprimer
*     responses:
*       204:
*         description: Livre supprimé avec succès
*       404:
*         description: Livre non trouvé
*       500:
*         description: Erreur serveur
*/
router.delete("/:id", booksController.deleteBookById);

/**
* @swagger
* /books:
*   post:
*     summary: Ajoute un nouveau livre
*     description: Crée un nouveau livre dans la base de données
*     tags: [Books]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/BookInput'
*     responses:
*       201:
*         description: Livre créé avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 message:
*                   type: string
*                   example: Livre ajouté avec succès
*                 id:
*                   type: string
*                   example: 550e8400-e29b-41d4-a716-446655440000
*       400:
*         description: Données invalides
*       500:
*         description: Erreur serveur
*/
router.post("/", validatePostRequestBody, booksController.createBook);

export default router;