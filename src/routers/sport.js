import express from "express";
import {
  getSport,
  getSportDetail,
  getAISurvey,
  postAISurvey,
} from "../controllers/sport.controller.js";

const sportRouter = express.Router();

sportRouter.use((req, res, next) => {
  if (req.session.user_id == null)
    return res.status(302).send({ message: "로그인이 필요합니다" });
  next();
});

sportRouter.get("/", getSport);

sportRouter.get("/detail/:sport_id", getSportDetail);

sportRouter.get("/ai", getAISurvey);

sportRouter.post("/ai", postAISurvey);

export default sportRouter;
