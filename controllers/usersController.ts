import { Request, Response } from "express";
import { User } from "../interfaces/IUser.ts";
import { insertUser } from "../database/repositories/userRepository.ts";

export const usersController = {
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user: User = req.body;
      const result = await insertUser(user);

      if (result === true) {
        res.status(201).json({
          success: true,
          message: "Utilisateur ajouté avec succès",
        });
      }
    } catch (error) {
      let statusCode: number;

      if (error instanceof Error) {
        statusCode =
          error.message ===
          "Format de l'utilisateur invalide pour l'insertion en base de données"
            ? 400
            : 500;
      } else {
        statusCode = 500;
      }

      res.status(statusCode).json({
        success: false,
        message: "Erreur lors de l'ajout de l'utilisateur",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
