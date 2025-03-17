// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { booksController } from "../controllers/booksController.ts";
import { validatePostRequestBody, validateGetStatusParams, validatePatchRequestParams } from "../middlewares/booksValidationMiddleware.ts";

const router = express.Router();

/**
 * @route GET /books
 * @desc Récupère tous les livres
 * @returns {Object} Succès, données des livres, message
 * @status 200 Succès | 500 Erreur serveur
 */
router.get("/", booksController.getAllBooks);

/**
 * @route GET /books/:id
 * @desc Récupère un livre par ID
 * @param {string} id - Identifiant du livre
 * @returns {Object} Succès, données du livre, message
 * @status 200 Succès | 400 ID invalide | 404 Non trouvé | 500 Erreur serveur
 */
router.get("/:id", booksController.getBookById);

/**
 * @route GET /books/status/:status
 * @desc Récupère les livres par statut de lecture
 * @param {string} status - Statut ("read", "to-read", "pending")
 * @returns {Object} Succès, données des livres, message
 * @status 200 Succès | 400 Statut invalide | 404 Aucun livre | 500 Erreur serveur
 */
router.get("/status/:status", validateGetStatusParams, booksController.getBookByStatus);

/**
 * @route PATCH /books/:id
 * @desc Met à jour le statut d'un livre
 * @param {string} id - Identifiant du livre
 * @body {Object} status - Nouveau statut du livre
 * @status 204 Succès | 404 Non trouvé | 409 Conflit | 500 Erreur serveur
 */
router.patch("/:id", validatePatchRequestParams, validateGetStatusParams, booksController.updateStatus);

/**
 * @route DELETE /books/:id
 * @desc Supprime un livre de la base de données
 * @param {string} id - Identifiant du livre
 * @status 204 Succès | 404 Non trouvé | 500 Erreur serveur
 */
router.delete("/:id", booksController.deleteBookById);

/**
 * @route POST /books
 * @desc Ajoute un nouveau livre
 * @body {Object} livre - Données du livre (title, author, status, etc.)
 * @returns {Object} Succès, message
 * @status 201 Créé | 400 Données invalides | 500 Erreur serveur
 */
router.post("/", validatePostRequestBody, booksController.createBook);

export default router;