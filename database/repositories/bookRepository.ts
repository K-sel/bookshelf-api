// Opérations CRUD pour les livres
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { Book } from "../../interfaces/IBook.ts";
import { dbConnect } from "../db-connect.ts";
import {
  instanceOfValidBookForDbStorage,
  generateValidUUID,
} from "../validators/bookValidator.ts";

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
  } finally {
    // Fermer la connexion même en cas d'erreur
    if (client) {
      await client.close();
    }
  }
}

/**
 * Récupère les livres depuis la base de données selon leur statut.
 *
 * @param status - Le statut de lecture des livres à rechercher ("read", "to-read", "pending", etc.)
 * @returns Promise<any[]> - Retourne une promesse contenant un tableau des livres correspondant au statut
 * @throws {Error} - Lance une erreur si la requête à la base de données échoue
 *
 * @description
 * Cette fonction établit une connexion à la base de données, exécute une requête SQL
 * pour sélectionner tous les livres ayant le statut spécifié, puis ferme la connexion.
 * La connexion est fermée même en cas d'erreur grâce au bloc finally.
 *
 * @example
 * // Exemple d'utilisation pour récupérer tous les livres avec le statut "read"
 * const readBooks = await queryBooksStatus("read");
 */
export async function queryBooksStatus(status: string) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query(`SELECT * FROM books WHERE status = ?`, [
      status,
    ]);
    client.close();
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Fermer la connexion même en cas d'erreur
    if (client) {
      await client.close();
    }
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
      await client.query(
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

/**
 * Met à jour le statut d'un livre dans la base de données.
 *
 * @param id - L'identifiant unique du livre à mettre à jour
 * @param status - Le nouveau statut à appliquer au livre (ex: "read", "to-read", "pending")
 * @returns Promise<any> - Retourne une promesse contenant le résultat de l'opération de mise à jour
 * @throws {Error} - Lance une erreur si la mise à jour échoue ou si la connexion à la base de données rencontre un problème
 *
 * @description
 * Cette fonction établit une connexion à la base de données, exécute une requête SQL UPDATE
 * pour modifier le statut d'un livre spécifié par son ID, puis ferme la connexion.
 * La connexion est fermée dans le bloc finally pour garantir qu'elle est toujours libérée,
 * même en cas d'erreur pendant l'exécution de la requête.
 *
 * La fonction utilise des paramètres préparés pour éviter les injections SQL, en passant
 * les valeurs status et id comme arguments distincts de la requête SQL.
 *
 * @example
 * // Exemple d'utilisation pour marquer un livre comme lu
 * try {
 *   const result = await patchStatus("123", "read");
 *   console.log("Statut mis à jour avec succès");
 * } catch (error) {
 *   console.error("Échec de la mise à jour du statut:", error);
 * }
 */
export async function patchStatus(id: string, status: string) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query(
      `UPDATE books SET status = ? WHERE id = ?;`,
      [status, id]
    );

    client.close();
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Fermer la connexion même en cas d'erreur
    if (client) {
      await client.close();
    }
  }
}
