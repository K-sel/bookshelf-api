import express from "express";
import { booksController } from "../controllers/booksController.ts";
import {
  validatePostRequestBody,
  validateGetStatusParams,
  validatePatchRequestParams,
} from "../middlewares/booksValidationMiddleware.ts";

const router = express.Router();

router.get("/", booksController.getAllBooks);

router.get("/:id", booksController.getBookById);

router.get(
  "/status/:status",
  validateGetStatusParams,
  booksController.getBookByStatus
);

router.patch(
  "/:id",
  validatePatchRequestParams,
  validateGetStatusParams,
  booksController.updateStatus
);

router.delete("/:id", booksController.deleteBookById);

router.post("/", validatePostRequestBody, booksController.createBook);

export default router;
