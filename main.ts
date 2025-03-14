// @ts-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "express";
import booksRoutes from "./routes/booksRoutes.ts";
import reqLogger from "./middlewares/reqLogger.ts";

// Init
const app = express();
const PORT: number = Number(Deno.env.get("APP_PORT")) || 3000;
app.listen(PORT);
console.log(`Server is running on http://localhost:${PORT}`);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(reqLogger);

// Routes
app.use("/books", booksRoutes)


// Landing
app.get("/", (_req: Request, res: Response) => {
  res.send(`Bienvenue sur mon l'API Bookshelf, écrite par K-sel !`);
});


