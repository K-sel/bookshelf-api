// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { validatePostUserRequestBody, validateLanguageParams, validateLoginRequestBody, validateMail } from "../middlewares/usersValidationMiddleware.ts";
import { usersController } from "../controllers/usersController.ts";

const router = express.Router();

/**
* @swagger
* /users:
*   post:
*     summary: Crée un nouvel utilisateur
*     description: Crée un utilisateur avec les informations fournies après validation du format et de la langue
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: Utilisateur créé avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 message:
*                   type: string
*                   example: Utilisateur ajouté avec succès
*                 id:
*                   type: string
*                   example: 550e8400-e29b-41d4-a716-446655440000
*       400:
*         description: Format de données invalide
*       422:
*         description: Langue non supportée
*       500:
*         description: Erreur serveur
*/
router.post("/", validateLanguageParams, validatePostUserRequestBody, usersController.createUser);

/**
* @swagger
* /users/login:
*   post:
*     summary: Authentification d'un utilisateur
*     description: Connecte un utilisateur avec son email et mot de passe
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*     responses:
*       200:
*         description: Connexion réussie
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   $ref: '#/components/schemas/UserData'
*                 message:
*                   type: string
*                   example: Connexion approuvée
*       401:
*         description: Email ou mot de passe incorrect
*       422:
*         description: Format de données invalide
*       500:
*         description: Erreur serveur
*/
router.post("/login", validateLoginRequestBody , usersController.login);

/**
* @swagger
* /users/{id}:
*   patch:
*     summary: Met à jour les informations d'un utilisateur
*     description: Modifie les données d'un utilisateur après validation du format de l'email et de la langue
*     tags: [Users]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: Identifiant unique de l'utilisateur
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*               firstname:
*                 type: string
*               name:
*                 type: string
*               age:
*                 type: number
*               language:
*                 type: string
*                 enum: [fr, it, en, de]
*     responses:
*       200:
*         description: Modifications enregistrées avec succès
*       400:
*         description: Format d'email invalide
*       401:
*         description: Utilisateur non trouvé
*       409:
*         description: Aucune modification effectuée
*       422:
*         description: Langue non supportée
*       500:
*         description: Erreur serveur
*/
router.patch("/:id", validateMail, validateLanguageParams, usersController.updateUser)

/**
* @swagger
* /users:
*   delete:
*     summary: Supprime un compte utilisateur
*     description: Supprime un utilisateur après authentification par email et mot de passe
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*     responses:
*       204:
*         description: Compte supprimé avec succès
*       401:
*         description: Email ou mot de passe incorrect
*       422:
*         description: Format de données invalide
*       500:
*         description: Erreur serveur
*/
router.delete("/", validateLoginRequestBody , usersController.deleteUser);


export default router;