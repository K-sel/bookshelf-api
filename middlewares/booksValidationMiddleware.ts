import { Request, Response, NextFunction } from "express";
import { instanceOfBook, BOOK_FORMAT } from "../interfaces/IBook.ts";

/**
 * Middleware qui valide les données de livre dans la requête.
 *
 * @param {Request} req - L'objet requête Express contenant les données du livre dans req.body.
 * @param {Response} res - L'objet réponse Express pour renvoyer des erreurs de validation.
 * @param {NextFunction} next - Fonction permettant de passer au middleware suivant si la validation réussit.
 * @returns {void}
 *
 * @description
 * Ce middleware vérifie que les données du livre soumises dans le corps de la requête
 * correspondent à la structure attendue pour un objet Book. Si la validation échoue,
 * il renvoie une réponse d'erreur 400 avec des détails sur le format attendu.
 *
 * @responses
 * - 400: Les données ne correspondent pas au format attendu
 *
 * @example
 * // Dans votre fichier de routes
 * import { validateBookData } from './middlewares/validation';
 * router.post('/books', validateBookData, booksController.createBook);
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
