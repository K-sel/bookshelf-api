// @ts-types="npm:@types/express@4.17.15"
import { Request, Response, NextFunction } from "express";

/**
 * Middleware qui log dans la console les informations de base sur chaque requête
 * @param req 
 * @param _res 
 * @param next 
 */
export default function reqLogger (req: Request, _res: Response, next: NextFunction) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

