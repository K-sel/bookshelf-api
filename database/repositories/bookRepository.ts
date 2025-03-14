// Opérations CRUD pour les livres
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { Book } from "../../interfaces/IBook.ts";
import { dbConnect } from "../db-connect.ts";
import { instanceOfValidBookForDbStorage, generateValidUUID } from "../validators/bookValidator.ts";

export async function queryAll() {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query("SELECT * FROM books");
    client.close();
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function queryById(id: string) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query(`SELECT * FROM books WHERE id = ?`, [id]);
    client.close();

    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function insertBook(data: Book) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const book = {
      id: generateValidUUID(),
      ...data,
    };

    if (instanceOfValidBookForDbStorage(book)) {
      const results = await client.query(
        `INSERT INTO Books (id, author, title, cover, status, summary) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          book.id,
          book.author,
          book.title,
          book.cover,
          book.status,
          book.summary,
        ]
      );

      client.close();
      console.log(results);
      return true;
    } else {
      throw new Error(
        "Format de livre invalide pour l'insertion en base de données"
      );
    }
  } catch (error) {
    console.error(
      `Erreur lors de l'insertion du livre: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error; // Remonter l'erreur pour la gestion dans l'API
  } finally {
    // Fermer la connexion même en cas d'erreur
    if (client) {
      await client.close();
    }
  }
}
