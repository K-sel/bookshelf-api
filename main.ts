// @ts-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "express";
import booksRouter from "./routes/books.ts";
import reqLogger from "./middlewares/reqLogger.ts";

const app = express();
const PORT: number = Number(Deno.env.get("APP_PORT")) || 3000;

app.use(reqLogger);
app.use("/books", booksRouter)

app.get("/", (_req: Request, res: Response) => {
  res.send(`Bienvenue sur mon l'API Bookshelf, écrite par K-sel !`);
});

app.listen(PORT);
console.log(`Server is running on http://localhost:${PORT}`);
