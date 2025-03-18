import { Request, Response } from "express";
import { User } from "../interfaces/IUser.ts";
import {
  insertUser,
  queryUsers,
} from "../database/repositories/userRepository.ts";
import { verifyPassword } from "../utils/cryptography.ts";


export const usersController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const password = req.body.password;
      const email = req.body.email;

      const user = await queryUsers(email);

      if (!user || user.length === 0) {
        res.status(401).json({
          success: false,
          message: "Cet email ne correspond à aucun compte",
        });
        return;
      }

      const passwordOK = await verifyPassword(password, user[0].password);

      if (passwordOK && user[0].email) {
        res.status(200).json({
          success: true,
          data: user,
          message: "Connexion approuvée",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Connexion refusée",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur la connexion",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

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
