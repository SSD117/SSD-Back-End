import User from "../models/user.model.js";
import addressToGeocode from "../util/geocode.js";

const getUser = async (req, res) => {
  try {
    const result = await User.findUser(req.session.user_id);
    return res.status(200).send(...result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`db 에러: ${err}`);
  }
};

const updateUser = async (req, res) => {
  let latitude, longitude;

  if (req.body.school) {
    try {
      const data = await addressToGeocode(req.body.school);
      latitude = data.latitude;
      longitude = data.longitude;
    } catch (err) {
      console.log(`Google Map API 에러: ${err}`);
      return res.status(400).send(`Google Map API 에러: ${err}`);
    }
  }

  try {
    let id = req.session.user_id;
    await User.updateUser({ ...req.body, latitude, longitude, id });
  } catch (err) {
    console.log(`db 에러: ${err}`);
    return res.status(500).send(`db 에러: ${err}`);
  }

  return res.status(200).send({ message: "성공" });
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.session.user_id);
  } catch (err) {
    console.log(`db 에러: ${err}`);
    return res.status(500).send(`db 에러: ${err}`);
  }

  await req.session.destroy();
  return res.status(200).send({ message: "성공" });
};

export { getUser, updateUser, deleteUser };
