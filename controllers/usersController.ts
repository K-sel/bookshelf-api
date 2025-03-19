import { Request, Response } from "express";
import { User } from "../interfaces/IUser.ts";
import {
  insertUser,
  patchUser,
  queryUsers,
} from "../database/repositories/userRepository.ts";
import { verifyPassword } from "../utils/cryptography.ts";

export const usersController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const password = req.body.password;
      const email = req.body.email;

      const [user] = await queryUsers(email);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Cet email ne correspond à aucun compte",
        });
        return;
      }

      const passwordOK = await verifyPassword(password, user.password);

      if (passwordOK && user.email) {
        const data = {
          id: user.id,
          firstname: user.firstname,
          name: user.name,
          age: user.age,
          language: user.language,
          email: user.email,
        };
        res.status(200).json({
          success: true,
          data: data,
          message: "Connexion approuvée",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Connexion refusée, mot de passe incorrect",
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

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const fields = req.body;

      const allowedKeys: string[] = [
        "firstname",
        "name",
        "age",
        "language",
        "email",
      ];

      const patchRequests = [];

      const [user] = await queryUsers(null, id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Cet id ne correspond à aucun compte",
        });
        return;
      }

      for (const keyInNewFields in fields) {
        if (fields[keyInNewFields] != user[keyInNewFields]) {
          if (allowedKeys.includes(keyInNewFields)) {
            patchRequests.push(
              patchUser(id, keyInNewFields, fields[keyInNewFields])
            );
          }
        }
      }

      if (patchRequests.length > 0) {
        await Promise.all(patchRequests);
        res.status(200).json({
          success: true,
          message: "Modifications enregistrées",
        });
      } else {
        res.status(409).json({
          success: false,
          message:
            "Modifications refusées, les valeurs entrées sont déja les valeurs actuelles",
          error: "Impossible de modifier les valeurs de l'utilisateur",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la modification de l'utilisateur, veuillez controler vos saisies.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user: User = req.body;
      const result = await insertUser(user);

      if (result) {
        res.status(201).json({
          success: true,
          message: "Utilisateur ajouté avec succès",
          id: result,
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
