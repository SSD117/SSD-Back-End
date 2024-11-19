import Sport from "../models/sport.model.js";

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

export { getSport, getSportDetail };
