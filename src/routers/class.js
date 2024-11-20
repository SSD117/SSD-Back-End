import express from "express";
import {
  getClass,
  registerClass,
  deleteClass,
  getBookmark,
  addBookmark,
  cancelBookmark,
} from "../controllers/class.controller.js";

const classRouter = express.Router();

classRouter.use((req, res, next) => {
  if (req.session.user_id == null)
    return res.status(302).send({ message: "로그인이 필요합니다" });
  next();
});

classRouter.get("/", getClass);

classRouter.post("/", registerClass);

classRouter.delete("/", deleteClass);

classRouter.get("/bookmark", getBookmark);

classRouter.post("/bookmark", addBookmark);

classRouter.delete("/bookmark", cancelBookmark);

export default classRouter;
