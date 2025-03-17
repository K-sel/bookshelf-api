// Gestion de la connexion à la base de données
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "./config.ts";

/**
 * Configuration de la base de données
 * @interface DbConfig
 * @property {string} hostname - L'adresse du serveur de base de données
 * @property {number} port - Le port du serveur de base de données
 * @property {string} username - Le nom d'utilisateur pour la connexion
 * @property {string} password - Le mot de passe pour la connexion
 * @property {string} db - Le nom de la base de données
 */

/**
 * Statut possible d'un livre
 * @type {('read'|'to-read'|'pending')}
 */
type BookStatus = 'read' | 'to-read' | 'pending';

/**
 * Langues supportées par l'application
 * @type {('fr'|'en'|'de'|'it')}
 */
type SupportedLanguage = 'fr' | 'en' | 'de' | 'it';

/**
 * Structure d'un livre dans la base de données
 * @interface Book
 * @property {string} id - Identifiant unique du livre (UUID)
 * @property {string} author - Nom de l'auteur du livre
 * @property {string} title - Titre du livre
 * @property {string} cover - URL ou chemin vers l'image de couverture
 * @property {BookStatus} status - Statut de lecture du livre
 * @property {string} summary - Résumé du livre
 */

/**
 * Structure d'un utilisateur dans la base de données
 * @interface User
 * @property {string} id - Identifiant unique de l'utilisateur (UUID)
 * @property {string} firstname - Prénom de l'utilisateur
 * @property {string} name - Nom de famille de l'utilisateur
 * @property {number} age - Âge de l'utilisateur (entre 0 et 140)
 * @property {SupportedLanguage} language - Langue préférée de l'utilisateur (par défaut 'fr')
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} password - Mot de passe hashé de l'utilisateur
 * @property {boolean} isAdmin - Indique si l'utilisateur est un administrateur
 */

/**
 * Établit une connexion à la base de données MySQL et initialise le schéma si nécessaire.
 *
 * @async
 * @returns {Promise<Client>} Une promesse qui se résout avec le client de base de données connecté.
 * @throws {Error} Si la connexion échoue ou si une erreur survient lors de l'initialisation du schéma.
 *
 * @description
 * Cette fonction:
 * 1. Se connecte à la base de données MySQL en utilisant la configuration fournie
 * 2. Sélectionne la base de données 'bookshelf'
 * 3. Crée la table Books si elle n'existe pas déjà
 * 4. Crée la table Users si elle n'existe pas déjà
 * 5. Retourne l'instance du client connecté pour une utilisation ultérieure
 *
 * @example
 * try {
 *   const client = await dbConnect();
 *   // Utiliser le client pour exécuter des requêtes
 *   await client.close(); // Fermer la connexion après utilisation
 * } catch (error) {
 *   console.error("Erreur de connexion:", error);
 * }
 */
export async function dbConnect(): Promise<Client> {
  try {
    const client: Client = await new Client().connect(dbConfig);

    await client.execute(`USE bookshelf`);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Books (
          id varchar(36) NOT NULL,
          author text NOT NULL,
          title text NOT NULL,
          cover text NOT NULL,
          status enum('read', 'to-read', 'pending') NOT NULL,
          summary text NOT NULL,
          PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await client.execute(`
    CREATE TABLE IF NOT EXISTS Users (
        id varchar(36) NOT NULL,
        firstname varchar(256) NOT NULL,
        name varchar(256) NOT NULL,
        age int NOT NULL CHECK (age >= 0 AND age <= 140),
        language enum('fr','en','de','it') NOT NULL DEFAULT 'fr',
        email varchar(256) NOT NULL,
        password text NOT NULL,
        isAdmin tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

    console.log("Database connected succesfully...");

    return client;
  } catch (error) {
    throw new Error(
      `Connexion à la base de données échouée: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}