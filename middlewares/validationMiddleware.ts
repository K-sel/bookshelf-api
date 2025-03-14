import { Request, Response, NextFunction } from "express";
import { instanceOfBook, BOOK_FORMAT } from "../interfaces/IBook.ts";

/**
 * Middleware de validation pour les données de livre
 */
export const validateBookData = (req: Request, res: Response, next: NextFunction): void => {
  const bookData = req.body;

  if (!instanceOfBook(bookData)) {
    res.status(400).json({
      success: false,
      message: "Les données ne correspondent pas au format Book attendu",
      error: "Validation échouée",
      formatAttendu: BOOK_FORMAT
    });
    return;
  }

  next();
};