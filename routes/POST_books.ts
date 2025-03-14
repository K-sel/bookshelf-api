// @ts-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "express";
import { instanceOfBook, BOOK_FORMAT } from "../interfaces/IBook.ts";
import { insertBook } from "../database/repositories/bookRepository.ts";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    
    // type check a ajouter ici, les ids sont générés apres avec des uuid donc pas de id dans la strcuture
    if (instanceOfBook(body)) {
      try {
        const result = await insertBook(body);
        if (result === true) {
          res.status(201).send({ message: "Livre ajouté avec succès" });
        } else {
          // Si insertBook retourne une erreur au lieu de false
          res.status(400).json({ 
            message: "Erreur lors de l'ajout du livre", 
            error: result 
          });
        }
      } catch (error) {
        // Gestion améliorée des erreurs
        res.status(400).json({ 
          message: "Erreur lors de l'ajout du livre", 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } else {
      res.status(400).json({
        message: "Les données ne correspondent pas au format Book attendu.",
        formatAttendu: BOOK_FORMAT,
      });
    }
  });

// router.post("/", async (req: Request, res: Response) => {
//   const body = req.body;

//   // type check a ajouter ici, les ids sont générés apres avec des uuid donc pas de id dans la strcuture
//   if (instanceOfBook(body)) {
//     try {
//       if (await insertBook(body)) {
//         res.sendStatus(201);
//       }
//     } catch (error) {
//       res
//         .sendStatus(400)
//         .json({ message: `error, could'nt add your book : ${error}` });
//     }
//   } else {
//     res.status(400).json({
//       message: `Les données ne correspondent pas au format Book attendu.`,
//       formatAttendu: BOOK_FORMAT,
//     });
//   }
// });

export default router;
