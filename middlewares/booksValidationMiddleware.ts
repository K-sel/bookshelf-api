import { Request, Response, NextFunction } from "express";
import { instanceOfBook, BOOK_FORMAT } from "../interfaces/IBook.ts";

/**
 * Middleware qui valide les données de livre dans la requête.
 *
 * @remarks
 * - Le format doit correspondre au type Book -> (IBook.ts)
 */
export const validatePostRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bookData = req.body;

  if (!instanceOfBook(bookData)) {
    res.status(400).json({
      success: false,
      message: "Les données ne correspondent pas au format Book attendu",
      error: "Validation échouée",
      formatAttendu: BOOK_FORMAT,
    });
    return;
  }

  next();
};

/**
 * Middleware qui valide le paramètre de statut de livre dans la requête.
 *
 * @remarks
 * - Vérifie que le statut du livre est l'une des trois valeurs attendues : "read", "to-read", ou "pending"..
 */
export const validateGetStatusParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bookStatus = req.params.status ? req.params.status : req.body.status;

  if (
    bookStatus != "read" &&
    bookStatus != "to-read" &&
    bookStatus != "pending"
  ) {
    res.status(422).json({
      success: false,
      message:
        "Le statut du livre ne correspond pas a l'un des trois formats attendus.",
      error: "Validation échouée",
      formatAttendu: `read || to-read || pending`,
    });
  }

  next();
};

/**
 * Middleware qui valide les paramètres requis pour les requêtes PATCH.
 * 
 * @remarks
 * - Vérifie que l'ID du livre et le nouveau statut sont tous deux présents dans la requête.
 */
export const validatePatchRequestParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params.id;
  const status = req.body.status;

  if (id && status) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: `Il manque le(s) paramètère(s) attendus.`,
      error: "Validation échouée",
      formatAttendu: `:id/ && Body : { status : read || to-read || pending}`,
    });
  }
};
