import axios from "axios";
import Sport from "../models/sport.model.js";
import configDotenv from "dotenv";

const getSport = async (req, res) => {
  try {
    const { page = 1, exercises, distance = 5, time } = req.body;
    const results = await Sport.findSport(
      page,
      exercises,
      distance,
      time,
      req.session.user_id
    );
    res.status(200).send({ sports: results });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

const getSportDetail = async (req, res) => {
  try {
    const { page = 1, price, day } = req.body;
    const results = await Sport.findSportById(
      req.params.sport_id,
      page,
      price,
      day
    );
    res.status(200).send({ sports: results });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

const getAISurvey = async (req, res) => {
  try {
    const isExist = await Sport.isExistRecommendSport(req.session.user_id);
    let results = "";
    if (isExist) {
      results = await Sport.findRecommendSport(req.session.user_id);
    }

    res.status(200).send({ sports: results });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

const postAISurvey = async (req, res) => {
  try {
    const { data } = await axios.post(process.env.AI_SERVER_URL, req.body, {
      "Content-Type": "application/json",
    });

    await Sport.deleteRecommendSport(req.session.user_id);

    if (data) {
      await Sport.insertRecommendSport(req.session.user_id, data.sports);
      return res.status(200).send({ message: "AI 설문조사 전송 성공" });
    }

    return res.status(400).send({ message: "AI 설문조사 전송 실패" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export { getSport, getSportDetail, getAISurvey, postAISurvey };
