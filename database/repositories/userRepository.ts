// Opérations CRUD pour les livres
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { User } from "../../interfaces/IUser.ts";
import { dbConnect } from "../db-connect.ts";
import { generateValidUUID } from "../../utils/uuid.ts";
import { isInstanceOfUserValidForDbStorage } from "../validators/userValidator.ts";
import { hashPassword } from "../../utils/cryptography.ts";

export async function queryUsers(
  email: string | null = null,
  _id: string | null = null
) {
  let client: Client | null = null;

  try {
    client = await dbConnect();
    let results = null;

    if (_id) {
      results = await client.query(`SELECT * FROM Users WHERE id = ?`, [_id]);
    } else {
      results =
        email === null
          ? await client.query("SELECT * FROM Users")
          : await client.query(`SELECT * FROM Users WHERE email = ?`, [email]);
    }

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

export async function insertUser(data: User): Promise<string> {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const user = {
      id: generateValidUUID(),
      ...data,
    };

    if (isInstanceOfUserValidForDbStorage(user)) {
      const hash = await hashPassword(user.password);

      await client.query(
        `INSERT INTO Users (id, name, firstname, age, language, email, password, isAdmin) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.firstname,
          user.age,
          user.language,
          user.email,
          hash,
          user.isAdmin,
        ]
      );

      client.close();
      // Cas unique de retour :  Si l'insertion est réussie, sinon une erreur est remontée dans tous les cas
      return user.id;
    } else {
      throw new Error(
        "Format de l'utilisateur invalide pour l'insertion en base de données"
      );
    }
  } catch (error) {
    console.error(
      `Erreur lors de l'insertion de l'utilisateur: ${
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

export async function patchUser(id: string, key: string, value: string) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query(
      `UPDATE Users SET ${key} = ? WHERE id = ?;`,
      [value, id]
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

export async function deleteUser(id: string) {
  let client: Client | null = null;

  try {
    client = await dbConnect();

    const results = await client.query(`DELETE FROM Users WHERE id = ?;`, [id]);

    client.close();
    console.log(results);
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
