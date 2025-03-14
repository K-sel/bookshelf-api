// Gestion de la connexion à la base de données
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "./config.ts";

export async function dbConnect(): Promise<Client> {
  try {
    const client: Client = await new Client().connect(dbConfig);

    await client.execute(`USE bookshelf`);
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