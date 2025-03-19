// controllers/booksController.ts
import { Request, Response } from "express";
import {
  queryBooks,
  insertBook,
  queryBooksStatus,
  patchStatus,
  deleteBook,
} from "../database/repositories/bookRepository.ts";
import { Book } from "../interfaces/IBook.ts";
import { RowDataPacket } from "mysql2";

/**
 * Contrôleur pour gérer les opérations CRUD sur les livres.
 * Fournit des méthodes pour récupérer, ajouter et rechercher des livres dans la base de données.
 *
 * @module booksController
 */
export const booksController = {
  /**
   * Récupère tous les livres de la base de données.
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
   * Récupère les livres filtrés par statut de lecture.
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

      const book = await queryBooksStatus(status) as RowDataPacket[];

      if (!book || book.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Vous n'avez aucun livre avec le statut : ${status}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data: book,
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
   * Récupère un livre spécifique par son identifiant unique.
   */
  getBookById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);

      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID de livre non valide",
          error: "L'ID doit être au format UUID v4",
        });
        return;
      }

      const books = await queryBooks(id) as RowDataPacket[];

      if (!books || books.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data: books[0],
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
   * Crée un nouveau livre dans la base de données.
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
   * Met à jour le statut de lecture d'un livre existant.
   */
  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { status } = req.body;

      const books = await queryBooks(id) as RowDataPacket[];
      if (!books || books.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`,
        });
      } else if (books[0] && books[0].status === status) {
        res.status(409).json({
          success: false,
          message:
            "Le statut que vous essayez de mettre est déja le statut actuel",
          error: "Impossible de modifier le statut",
        });
      } else {
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
  

  /**
   * Supprime un livre de la base de données par son identifiant.
   */
  deleteBookById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);

      const books = await queryBooks(id) as RowDataPacket[];
      if (!books || books.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`,
        });
      } else {
        await deleteBook(id);
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la suppression du livre, veuillez vérifier l'ID.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};