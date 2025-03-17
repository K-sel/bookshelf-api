import { Request, Response, NextFunction } from "express";
import { USER_FORMAT, isInstanceOfUser } from "../interfaces/IUser.ts";

function isValidEmail(email: string): boolean {
  // Regex complète pour validation d'email selon RFC 5322
  const emailRegex: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

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

export const validateLanguageParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const language = req.body.language;

  if (
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
  }

  next();
};
