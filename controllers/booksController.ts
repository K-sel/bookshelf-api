// controllers/booksController.ts
import { Request, Response } from "express";
import {
  queryBooks,
  insertBook,
} from "../database/repositories/bookRepository.ts";
import { Book } from "../interfaces/IBook.ts";

/**
 * Contrôleur pour gérer les opérations CRUD sur les livres.
 * Fournit des méthodes pour récupérer, ajouter et rechercher des livres dans la base de données.
 * 
 * @module booksController
 */
export const booksController = {
  /**
   * Récupère tous les livres de la base de données.
   *
   * @async
   * @param {Request} _req - L'objet requête Express (non utilisé dans cette méthode).
   * @param {Response} res - L'objet réponse Express utilisé pour renvoyer le statut et les données au client.
   * @returns {Promise<void>} Une promesse qui ne renvoie pas de valeur.
   *
   * @description
   * Cette méthode interroge la base de données pour récupérer tous les livres disponibles
   * et les renvoie au client dans un format JSON structuré.
   *
   * @responses
   * - 200: Livres récupérés avec succès
   * - 500: Erreur interne du serveur lors de la récupération
   *
   * @example
   * // Exemple d'appel API
   * // GET /api/books
   * //
   * // Réponse réussie:
   * // {
   * //   "success": true,
   * //   "data": [
   * //     {
   * //       "id": "550e8400-e29b-41d4-a716-446655440000",
   * //       "title": "Les Misérables",
   * //       "author": "Victor Hugo",
   * //       ...
   * //     },
   * //     {
   * //       "id": "550e8400-e29b-41d4-a716-446655440001",
   * //       "title": "Notre-Dame de Paris",
   * //       "author": "Victor Hugo",
   * //       ...
   * //     }
   * //   ],
   * //   "message": "Livres récupérés avec succès"
   * // }
   */
  getAllBooks: async (_req: Request, res: Response): Promise<void> => {
    try {
      const books = await queryBooks();
      res.status(200).json({
        success: true,
        data: books,
        message: "Livres récupérés avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des livres",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Récupère un livre spécifique par son identifiant.
   *
   * @async
   * @param {Request} req - L'objet requête Express contenant l'ID du livre dans les paramètres (req.params.id).
   * @param {Response} res - L'objet réponse Express utilisé pour renvoyer le statut et les données au client.
   * @returns {Promise<void>} Une promesse qui ne renvoie pas de valeur.
   *
   * @description
   * Cette méthode extrait l'ID du livre des paramètres de la requête, vérifie sa validité,
   * puis tente de récupérer le livre correspondant depuis la base de données.
   * Elle renvoie soit le livre trouvé, soit une erreur appropriée.
   *
   * @responses
   * - 200: Livre récupéré avec succès
   * - 400: ID de livre non valide ou manquant
   * - 404: Livre non trouvé
   * - 500: Erreur interne du serveur lors de la récupération
   *
   * @example
   * // Exemple d'appel API
   * // GET /api/books/550e8400-e29b-41d4-a716-446655440000
   * //
   * // Réponse réussie:
   * // {
   * //   "success": true,
   * //   "data": {
   * //     "id": "550e8400-e29b-41d4-a716-446655440000",
   * //     "title": "Les Misérables",
   * //     "author": "Victor Hugo",
   * //     ...
   * //   },
   * //   "message": "Livre récupéré avec succès"
   * // }
   */
  getBookById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);

      // Controle que l'id est présent sinon, fin de la fonction et renvoi de l'erreur au client
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID de livre non valide",
          error: "L'ID doit être au format UUID v4",
        });
        return;
      }

      // ID présent -> Query la DB pour récupérer la valeur
      const book = await queryBooks(id);

      if (!book || book.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data: book[0], // Puisque queryById renvoie un tableau
          message: "Livre récupéré avec succès",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du livre.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Ajoute un nouveau livre dans la base de données.
   *
   * @async
   * @param {Request} req - L'objet requête Express contenant les données du livre dans le corps (req.body).
   * @param {Response} res - L'objet réponse Express utilisé pour renvoyer le statut et les données au client.
   * @returns {Promise<void>} Une promesse qui ne renvoie pas de valeur.
   *
   * @description
   * Cette méthode extrait les données du livre du corps de la requête, tente de l'insérer
   * dans la base de données via la fonction insertBook(), et renvoie une réponse appropriée.
   *
   * @responses
   * - 201: Livre ajouté avec succès
   * - 400: Format de livre invalide
   * - 500: Erreur interne du serveur lors de l'insertion
   *
   * @example
   * // Exemple d'appel API
   * // POST /api/books
   * // Content-Type: application/json
   * //
   * // {
   * //   "title": "Les Misérables",
   * //   "author": "Victor Hugo",
   * //   "cover": "url_to_cover_image.jpg",
   * //   "status": "available",
   * //   "summary": "Un roman historique..."
   * // }
   */
  createBook: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData: Book = req.body;
      const result = await insertBook(bookData);

      if (result === true) {
        res.status(201).json({
          success: true,
          message: "Livre ajouté avec succès",
        });
      }
    } catch (error) {
      let statusCode: number;

      if (error instanceof Error) {
        statusCode =
          error.message ===
          "Format de livre invalide pour l'insertion en base de données"
            ? 400
            : 500;
      } else {
        statusCode = 500;
      }

      res.status(statusCode).json({
        success: false,
        message: "Erreur lors de l'ajout du livre",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
