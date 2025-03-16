// controllers/booksController.ts
import { Request, Response } from "express";
import {
  queryBooks,
  insertBook,
  queryBooksStatus,
  patchStatus,
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
   * Récupère les livres en fonction de leur statut de lecture.
   *
   * @param req - L'objet Request contenant les paramètres de la requête HTTP
   * @param res - L'objet Response pour envoyer la réponse HTTP
   * @returns Promise<void> - Ne retourne rien directement, envoie la réponse via l'objet res
   *
   * @description
   * Cette fonction extrait le statut de lecture depuis les paramètres de la requête,
   * interroge la base de données pour trouver les livres correspondants et renvoie
   * le résultat au client.
   *
   * Codes de statut HTTP:
   * - 200: Succès, renvoie les livres trouvés
   * - 400: Requête invalide (statut manquant)
   * - 404: Aucun livre trouvé avec ce statut
   * - 500: Erreur serveur lors du traitement de la requête
   *
   * @example
   * // Exemple d'utilisation pour récupérer les livres avec statut "to-read"
   * GET api/books/status/to-read
   */
  getBookByStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const status = String(req.params.status);

      if (!status) {
        res.status(400).json({
          success: false,
          message: "Statut de lecture du livre non valide",
          error: `Le statut doit être soit "read" soit "to-read" soit "pending".`,
        });
        return;
      }

      const book = await queryBooksStatus(status);

      if (!book || book.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Vous n'avez aucun livre avec le statut : ${status}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data: book, // Puisque queryById renvoie un tableau
          message: "Livre(s) récupéré(s) avec succès",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du/des livre(s).",
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


  /**
 * Met à jour le statut d'un livre existant.
 * 
 * @param req - L'objet Request contenant l'ID du livre dans les paramètres d'URL et le nouveau statut dans le corps de la requête
 * @param res - L'objet Response pour envoyer la réponse HTTP
 * @returns Promise<void> - Ne retourne rien directement, envoie la réponse via l'objet res
 * 
 * @description
 * Cette fonction permet de modifier le statut de lecture d'un livre identifié par son ID.
 * Elle vérifie d'abord l'existence du livre, puis si le nouveau statut est différent
 * de l'actuel avant d'effectuer la modification.
 * 
 * La fonction attend un objet JSON dans le corps de la requête avec la propriété "status".
 * 
 * Codes de statut HTTP:
 * - 204: Succès, le statut a été mis à jour (pas de contenu retourné)
 * - 404: Livre non trouvé avec l'ID spécifié
 * - 409: Conflit, le statut demandé est identique au statut actuel
 * - 500: Erreur serveur lors du traitement de la requête
 * 
 * @example
 * // Exemple de requête pour mettre à jour le statut d'un livre
 * PATCH /api/books/123
 * Content-Type: application/json
 * 
 * {
 *   "status": "read"
 * }
 * 
 * // Réponse en cas de succès: 204 No Content (sans corps)
 */
  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { status } = req.body;

      const book = await queryBooks(id);
      if (!book || book.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`,
        });
      } else if (book[0].status === status) {
        res.status(409).json({
          success: false,
          message:
            "Le statut que vous essayez de mettre est déja le statut actuel",
          error: "Impossible de modifier le statut",
        });
      } else {
        // ID présent -> Query la DB pour modifier la valeurs
        await patchStatus(id, status);
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la récupération du livre, veuillez vérifier l'ID.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
