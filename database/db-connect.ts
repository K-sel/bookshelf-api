// Gestion de la connexion à la base de données
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "./config.ts";

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
 * 4. Retourne l'instance du client connecté pour une utilisation ultérieure
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
  `)

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