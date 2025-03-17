// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { validatePostUserRequestBody, validateLanguageParams } from "../middlewares/usersValidationMiddleware.ts";
import { usersController } from "../controllers/usersController.ts";

const router = express.Router();

router.post("/", validateLanguageParams, validatePostUserRequestBody, usersController.createUser);

export default router;