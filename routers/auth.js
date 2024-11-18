import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/login", login);

authRouter.get("/logout", logout);

authRouter.post("/register", register);

export default authRouter;
