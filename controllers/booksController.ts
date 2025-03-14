// controllers/booksController.ts
import { Request, Response } from "express";
import { queryAll, queryById, insertBook } from "../database/repositories/bookRepository.ts";
import { Book } from "../interfaces/IBook.ts";

/**
 * Contrôleur pour gérer les opérations CRUD sur les livres
 */
export const booksController = {
  /**
   * Récupère tous les livres
   */
  getAllBooks: async (_req: Request, res: Response): Promise<void> => {
    try {
      const books = await queryAll();
      res.status(200).json({
        success: true,
        data: books,
        message: "Livres récupérés avec succès"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des livres",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },

  /**
   * Récupère un livre par son ID
   */
  getBookById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID de livre non valide",
          error: "L'ID doit être au format UUID v4"
        });
        return;
      }

      const book = await queryById(id);
      
      if (!book || book.length === 0) {
        res.status(404).json({
          success: false,
          message: "Livre non trouvé",
          error: `Aucun livre avec l'ID: ${id}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: book[0], // Puisque queryById renvoie un tableau
        message: "Livre récupéré avec succès"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du livre",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },

  /**
   * Ajoute un nouveau livre
   */
  createBook: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData: Book = req.body;
      const result = await insertBook(bookData);
      
      if (result === true) {
        res.status(201).json({
          success: true,
          message: "Livre ajouté avec succès"
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Erreur lors de l'ajout du livre",
          error: result
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Erreur lors de l'ajout du livre",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
};