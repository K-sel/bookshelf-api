// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import { validatePostUserRequestBody, validateLanguageParams, validateLoginRequestBody } from "../middlewares/usersValidationMiddleware.ts";
import { usersController } from "../controllers/usersController.ts";

const router = express.Router();

router.post("/", validateLanguageParams, validatePostUserRequestBody, usersController.createUser);
router.post("/login", validateLoginRequestBody , usersController.login)

export default router;