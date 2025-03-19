// Opérations CRUD pour les livres
import { PoolConnection } from "mysql2/promise";
import { dbConnect } from "../db-connect.ts";
import { generateValidUUID } from "../../utils/uuid.ts";
import { isInstanceOfUserValidForDbStorage } from "../validators/userValidator.ts";
import { hashPassword } from "../../utils/cryptography.ts";
import { User } from "../../interfaces/IUser.ts"; // Ajout de l'import pour le type User

/**
 * Interroge la base de données pour récupérer des utilisateurs selon différents critères.
 *
 * @param email - L'adresse email à rechercher. Si null, ce critère ne sera pas utilisé.
 * @param _id - L'identifiant unique de l'utilisateur à rechercher. Si null, ce critère ne sera pas utilisé.
 * @returns Une promesse qui résout avec les résultats de la requête.
 * @throws Renvoie l'erreur si la connexion à la base de données ou la requête échoue.
 *
 * @remarks
 * - Si _id est fourni, la fonction recherche uniquement par identifiant.
 * - Si _id est null mais email est fourni, la fonction recherche par email.
 * - Si les deux paramètres sont null, tous les utilisateurs sont retournés.
 * - La connexion à la base de données est toujours fermée, même en cas d'erreur.
 */
export async function queryUsers(
  email: string | null = null,
  _id: string | null = null
) {
  let connection: PoolConnection | null = null;

  try {
    connection = await dbConnect();
    let rows = null;

    if (_id) {
      [rows] = await connection.query(`SELECT * FROM Users WHERE id = ?`, [
        _id,
      ]);
    } else {
      [rows] = await connection.query(`SELECT * FROM Users WHERE email = ?`, [
        email,
      ]);
    }

    connection.release();

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Libérer la connexion même en cas d'erreur
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Insère un nouvel utilisateur dans la base de données.
 *
 * @param data - Les données de l'utilisateur à insérer. L'ID sera généré automatiquement.
 * @returns Une promesse qui résout avec l'identifiant UUID du nouvel utilisateur créé.
 * @throws Erreur si le format de l'utilisateur est invalide ou si l'insertion en base de données échoue.
 *
 * @remarks
 * - La fonction génère automatiquement un UUID valide pour l'utilisateur.
 * - Le mot de passe de l'utilisateur est haché avant d'être stocké.
 * - La fonction vérifie que les données de l'utilisateur sont valides pour le stockage.
 * - La connexion à la base de données est toujours fermée, même en cas d'erreur.
 * - Si l'insertion réussit, l'identifiant de l'utilisateur est retourné.
 */
export async function insertUser(data: User): Promise<string> {
  let connection: PoolConnection | null = null;

  try {
    connection = await dbConnect();

    const user = {
      id: generateValidUUID(),
      ...data,
    };

    if (isInstanceOfUserValidForDbStorage(user)) {
      const hash = await hashPassword(user.password);

      await connection.query(
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

      connection.release();
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
    // Libérer la connexion même en cas d'erreur
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Met à jour une propriété spécifique d'un utilisateur dans la base de données.
 *
 * @param id - L'identifiant unique de l'utilisateur à mettre à jour.
 * @param key - Le nom de la colonne/propriété à modifier.
 * @param value - La nouvelle valeur à attribuer à la propriété spécifiée.
 * @returns Une promesse qui résout avec les résultats de la requête de mise à jour.
 * @throws Renvoie l'erreur si la connexion à la base de données ou la requête échoue.
 *
 * @remarks
 * - Cette fonction exécute une requête UPDATE SQL avec les paramètres fournis.
 * - Aucune validation n'est effectuée sur le nom de la colonne (key), ce qui pourrait présenter un risque d'injection SQL.
 * - La connexion à la base de données est toujours fermée, même en cas d'erreur.
 * - Attention : il n'y a pas de vérification que l'utilisateur existe avant la mise à jour.
 */
export async function patchUser(id: string, key: string, value: string) {
  let connection: PoolConnection | null = null;

  try {
    connection = await dbConnect();

    const [rows] = await connection.query(
      `UPDATE Users SET ${key} = ? WHERE id = ?;`,
      [value, id]
    );

    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Libérer la connexion même en cas d'erreur
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Supprime un utilisateur de la base de données.
 *
 * @param id - L'identifiant unique de l'utilisateur à supprimer.
 * @returns Une promesse qui résout avec les résultats de la requête de suppression.
 * @throws Renvoie l'erreur si la connexion à la base de données ou la requête échoue.
 *
 * @remarks
 * - Cette fonction exécute une requête DELETE SQL pour supprimer l'utilisateur spécifié par son id.
 * - Le résultat de l'opération est affiché dans la console avant d'être retourné.
 * - La connexion à la base de données est toujours fermée, même en cas d'erreur.
 * - Aucune vérification n'est effectuée pour confirmer que l'utilisateur existe avant la suppression.
 * - L'opération est définitive et ne peut pas être annulée.
 */
export async function deleteUser(id: string) {
  let connection: PoolConnection | null = null;

  try {
    connection = await dbConnect();

    const [rows] = await connection.query(`DELETE FROM Users WHERE id = ?;`, [
      id,
    ]);

    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Libérer la connexion même en cas d'erreur
    if (connection) {
      connection.release();
    }
  }
}
