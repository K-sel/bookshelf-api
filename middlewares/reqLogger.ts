import { Request, Response, NextFunction } from "express";

/**
 * Middleware qui enregistre les informations de base sur chaque requête HTTP.
 */
export default function reqLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
}
