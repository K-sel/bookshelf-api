// @ts-types="npm:@types/express@4.17.15"
import { Request, Response, NextFunction } from "express";

/**
 * Middleware qui enregistre les informations de base sur chaque requête HTTP.
 *
 * @param {Request} req - L'objet requête Express contenant les détails de la requête entrante.
 * @param {Response} _res - L'objet réponse Express (non utilisé dans cette fonction).
 * @param {NextFunction} next - Fonction permettant de passer au middleware suivant dans la chaîne.
 * @returns {void}
 *
 * @description
 * Ce middleware capture et affiche dans la console la méthode HTTP, l'URL et l'hôte
 * pour chaque requête entrante. Il est utile pour le débogage et la surveillance
 * du trafic de l'application.
 *
 * @example
 * // Dans votre fichier de configuration Express
 * import reqLogger from './middlewares/reqLogger';
 * app.use(reqLogger);
 */
export default function reqLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
}
