// cors.ts
import { Request, Response, NextFunction } from "express";

/**
 * Middleware pour activer les requêtes CORS -> A Implémenter JWT Auth !!!! Car access = *
 */
export const corsMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Définir les en-têtes CORS basiques
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    
    next();
  };
};