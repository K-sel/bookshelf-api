// Opérations CRUD pour les livres
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { Book } from "../../interfaces/IBook.ts";
import { dbConnect } from "../db-connect.ts";
import { instanceOfValidBookForDbStorage, generateValidUUID } from "../validators/bookValidator.ts";

/**
 * Interroge la base de données MySQL pour récupérer des livres.
 * Si _id est null, tous les livres seront retournés.
 * Sinon, seul le livre correspondant à l'identifiant sera retourné.
 * 
 * @example
 * // Récupérer tous les livres
 * const allBooks = await query();
 * 
 * @example
 * // Récupérer un livre spécifique par son ID
 * const book = await query("123");
 */
export async function queryBooks(_id: string | null = null) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results =
      _id === null
        ? await client.query("SELECT * FROM books")
        : await client.query(`SELECT * FROM books WHERE id = ?`, [_id]);
    client.close();
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Insère un nouveau livre dans la base de données.
 * 
 * Cette fonction génère un UUID valide pour le livre et vérifie que les données
 * sont dans un format valide avant l'insertion.
 * 
 * @param {Book} data - Les données du livre à insérer. L'ID sera généré automatiquement.
 * @returns {Promise<boolean>} Une promesse qui se résout avec `true` si l'insertion est réussie.
 * @throws {Error} Si le format du livre est invalide ou si l'insertion échoue pour une autre raison.
 * 
 * @example
 * try {
 *   const newBook = {
 *     author: "Victor Hugo",
 *     title: "Les Misérables",
 *     cover: "url_to_cover_image.jpg",
 *     status: "available",
 *     summary: "Un roman historique..."
 *   };
 *   
 *   const success = await insertBook(newBook);
 *   console.log("Livre inséré avec succès:", success);
 * } catch (error) {
 *   console.error("Échec de l'insertion:", error);
 * }
 */
export async function insertBook(data: Book): Promise<boolean> {
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

      // Cas unique de retour :  Si l'insertion est réussie, sinon une erreur est remontée dans tous les cas
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
