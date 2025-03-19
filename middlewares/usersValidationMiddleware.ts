import { Request, Response, NextFunction } from "express";
import { USER_FORMAT, isInstanceOfUser } from "../interfaces/IUser.ts";

/**
 * Vérifie si une chaîne de caractères est une adresse email valide selon RFC 5322.
 *
 * @param email - La chaîne à valider comme adresse email.
 * @returns Booléen indiquant si l'email est valide.
 *
 * @remarks
 * Utilise une expression régulière complète conforme à la norme RFC 5322 pour
 * valider le format de l'adresse email.
 */
function isValidEmail(email: string): boolean {
  // Regex complète pour validation d'email selon RFC 5322
  const emailRegex: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

/**
 * Middleware qui valide les données utilisateur dans le corps de la requête POST.
 *
 * @remarks
 * - Vérifie que les données correspondent à la structure attendue pour un utilisateur.
 * - Valide également le format de l'adresse email.
 * - Renvoie une erreur 400 si la validation échoue, avec des détails sur le format attendu.
 */
export const validatePostUserRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.body;

  if (!isInstanceOfUser(user) || !isValidEmail(user.email)) {
    res.status(400).json({
      success: false,
      message:
        "Les données ne correspondent pas au format User attendu, veuillez contrôler vos saisies",
      error: "Validation échouée",
      formatAttendu: USER_FORMAT,
    });
    return;
  }

  next();
};

/**
 * Middleware qui valide le paramètre de langue dans la requête.
 *
 * @remarks
 * - Vérifie que la langue est l'une des quatre valeurs attendues : "fr", "it", "en" ou "de".
 * - Ne vérifie que si le paramètre language est présent.
 * - Renvoie une erreur 422 si la langue n'est pas valide, avec des détails sur les formats acceptés.
 */
export const validateLanguageParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const language = req.body.language;

  if (
    language &&
    language != "fr" &&
    language != "it" &&
    language != "en" &&
    language != "de"
  ) {
    res.status(422).json({
      success: false,
      message:
        "La langue ne correspond pas a l'une des quatres langues attendues.",
      error: "Validation échouée",
      formatAttendu: `fr || it || en || de`,
    });
    return;
  }

  next();
};

/**
 * Middleware qui valide le format de l'adresse email dans la requête.
 *
 * @remarks
 * - Vérifie que l'adresse email est dans un format valide si elle est présente.
 * - Ignore la validation si aucun email n'est fourni.
 * - Renvoie une erreur 400 si l'email n'est pas valide, avec des détails sur le format attendu.
 */
export const validateMail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const email = req.body.email;

  if (email) {
    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        message: "Ceci n'est pas une adresse mail",
        error: "Validation échouée",
        formatAttendu: "xxx@xxx.xx",
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * Middleware qui valide les informations de connexion dans la requête.
 *
 * @remarks
 * - Vérifie que l'email et le mot de passe sont présents dans la requête.
 * - Valide également le format de l'adresse email.
 * - Renvoie une erreur 422 si la validation échoue, avec des détails sur le format attendu.
 */
export const validateLoginRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const email = req.body.email;
  const passowrd = req.body.password;

  if (passowrd && email && isValidEmail(email)) {
    next();
  } else {
    res.status(422).json({
      success: false,
      message:
        "La demande de connexion ne contient pas les données attendues ou leur format est incorrect.",
      error: "Validation échouée",
      formatAttendu: `{
      "email" :string "xxx@xxx.xx",
      "password" :string
      }`,
    });
    return;
  }
};
