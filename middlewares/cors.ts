// cors.ts
import { Request, Response, NextFunction } from "express";

/**
* Middleware pour configurer les en-têtes CORS (Cross-Origin Resource Sharing).
* 
* @returns Une fonction middleware Express qui gère les en-têtes CORS et les requêtes preflight.
* 
* @remarks
* - Permet l'accès depuis n'importe quelle origine ('*').
* - Autorise les méthodes HTTP: GET, POST, PUT, DELETE, PATCH et OPTIONS.
* - Autorise les en-têtes 'Content-Type' et 'Authorization'.
* - Traite automatiquement les requêtes preflight OPTIONS avec un statut 204.
* - NOTE: Cette implémentation devrait être renforcée avec une authentification JWT,
*   car actuellement l'accès est autorisé depuis toutes les origines.
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