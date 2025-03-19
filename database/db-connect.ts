// Gestion de la connexion à la base de données
import { PoolConnection, createPool } from 'mysql2/promise';
import { dbConfig } from "./config.ts";

// Créer un pool de connexions
const pool = createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function dbConnect(): Promise<PoolConnection> {
  try {
    const connection = await pool.getConnection();
    
    // Initialisation du schéma
    await connection.query(`
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

    await connection.query(`
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

    console.log("Database connected successfully...");

    return connection;
  } catch (error) {
    throw new Error(
      `Connexion à la base de données échouée: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}