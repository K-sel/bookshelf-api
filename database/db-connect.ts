// Gestion de la connexion à la base de données
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "./config.ts";

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