// @ts-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "express";
import { queryAll } from "../database/db.ts";

const booksRouter = express.Router();
const books = await queryAll();

interface Book {
  id: string;
  title: string;
  author: string;
  status: "read" | "to-read" | "pending";
  cover: string;
  summary: string;
}

booksRouter.get("/", (_req: Request, res: Response): void => {
    res.status(200).json(books);
  });
  
  booksRouter.get("/:id", (req: Request, res: Response): void => {
    
    const idx = String(req.params.id);
  
    if(idx) {
      const book = books.find((el: Book) => el.id === idx);
  
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    }else{
      res.status(400).json({ message: "Id not valid" });
    }
    
  });

export default booksRouter;