// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { booksController } from "../controllers/booksController.ts";
import { validateBookData } from "../middlewares/validationMiddleware.ts";

const router = express.Router();

/**
 * @route GET /books
 * @desc Récupère tous les livres
 * @access Public
 */
router.get("/", booksController.getAllBooks);

/**
 * @route GET /books/:id
 * @desc Récupère un livre spécifique par son ID
 * @access Public
 */
router.get("/:id", booksController.getBookById);

/**
 * @route POST /books
 * @desc Ajoute un nouveau livre
 * @access Public
 */
router.post("/", validateBookData, booksController.createBook);

export default router;