import express from "express";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.ts"; // Note: utilisez .js pour les imports en ES modules
import reqLogger from "./middlewares/reqLogger.ts";
import usersRoutes from "./routes/usersRoutes.ts";

// Init
const app = express();
const PORT: number = 3000;

// Application du middleware CORS à toutes les routes
app.use(cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(reqLogger);

// Routes
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});