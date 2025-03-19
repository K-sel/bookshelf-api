import { Request, Response } from "express";
import { User } from "../interfaces/IUser.ts";
import {
  deleteUser,
  insertUser,
  patchUser,
  queryUsers,
} from "../database/repositories/userRepository.ts";
import { verifyPassword } from "../utils/cryptography.ts";

/**
 * Objet contenant les méthodes de contrôleur pour la gestion des utilisateurs dans l'API.
 */
export const usersController = {
  /**
   * Gère l'authentification d'un utilisateur.
   *
   * @param req - L'objet Request contenant les informations de la requête HTTP.
   * @param res - L'objet Response utilisé pour envoyer la réponse HTTP.
   * @returns Une promesse void qui se résout lorsque la réponse est envoyée.
   *
   * @remarks
   * - Vérifie si l'email existe dans la base de données.
   * - Authentifie l'utilisateur en vérifiant le mot de passe.
   * - Renvoie les données de l'utilisateur en cas de succès (statut 200).
   * - Renvoie une erreur 401 si l'email n'existe pas ou si le mot de passe est incorrect.
   * - Renvoie une erreur 500 en cas d'erreur serveur.
   */
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

  /**
   * Met à jour les informations d'un utilisateur spécifique.
   *
   * @param req - L'objet Request contenant les informations de la requête HTTP, y compris l'ID de l'utilisateur et les champs à mettre à jour.
   * @param res - L'objet Response utilisé pour envoyer la réponse HTTP.
   * @returns Une promesse void qui se résout lorsque la réponse est envoyée.
   *
   * @remarks
   * - Vérifie si l'utilisateur existe avec l'ID fourni.
   * - Limite les modifications aux champs autorisés (firstname, name, age, language, email).
   * - Ignore les champs qui n'ont pas changé.
   * - Exécute toutes les modifications en parallèle via Promise.all.
   * - Renvoie une erreur 401 si l'ID n'existe pas.
   * - Renvoie une erreur 409 si aucune modification n'a été appliquée.
   * - Renvoie une erreur 500 en cas d'erreur serveur.
   */
  updateUser: async (req: Request, res: Response): Promise<void> => {
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
          message: "Modifications refusées, controlez vos saisies",
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

  /**
   * Crée un nouvel utilisateur dans le système.
   *
   * @param req - L'objet Request contenant les informations de la requête HTTP, y compris les données de l'utilisateur à créer.
   * @param res - L'objet Response utilisé pour envoyer la réponse HTTP.
   * @returns Une promesse void qui se résout lorsque la réponse est envoyée.
   *
   * @remarks
   * - Insère un nouvel utilisateur avec les données fournies dans le corps de la requête.
   * - Renvoie un statut 201 avec l'ID de l'utilisateur créé en cas de succès.
   * - Renvoie une erreur 400 si le format de l'utilisateur est invalide.
   * - Renvoie une erreur 500 en cas d'erreur serveur.
   */
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

  /**
   * Supprime un compte utilisateur après vérification des identifiants.
   *
   * @param req - L'objet Request contenant les informations de la requête HTTP, y compris l'email et le mot de passe pour l'authentification.
   * @param res - L'objet Response utilisé pour envoyer la réponse HTTP.
   * @returns Une promesse void qui se résout lorsque la réponse est envoyée.
   *
   * @remarks
   * - Vérifie si l'email existe dans la base de données.
   * - Authentifie l'utilisateur en vérifiant le mot de passe avant la suppression.
   * - Renvoie un statut 204 (No Content) en cas de suppression réussie.
   * - Renvoie une erreur 401 si l'email n'existe pas ou si le mot de passe est incorrect.
   * - Renvoie une erreur 500 en cas d'erreur serveur.
   */
  deleteUser: async (req: Request, res: Response): Promise<void> => {
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
        await deleteUser(user.id);
        res.status(204).end();
      } else {
        res.status(401).json({
          success: false,
          message: "Connexion refusée, mot de passe incorrect",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du compte.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
