// @ts-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "express";
import { queryAll } from "../database/repositories/bookRepository.ts";
const router = express.Router();
const books = await queryAll();

interface Book {
  id: string;
  title: string;
  author: string;
  status: "read" | "to-read" | "pending";
  cover: string;
  summary: string;
}



router.get("/", (_req: Request, res: Response): void => {
  res.status(200).json(books);
});

router.get("/:id", (req: Request, res: Response): void => {
  const idx = String(req.params.id);

  if (idx) {
    const book = books.find((el: Book) => el.id === idx);

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid id, ID format is uuid v4" });
  }
});

export default router;
