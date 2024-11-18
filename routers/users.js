import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/users.controller.js";

const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (req.session.user_id == null)
    return res.status(302).send({ message: "로그인이 필요합니다" });
  next();
});

userRouter.get("/", getUser);

userRouter.patch("/", updateUser);

userRouter.delete("/", deleteUser);

export default userRouter;
