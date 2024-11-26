import Auth from "../models/auth.model.js";
import User from "../models/user.model.js";
import { makeHash, checkHash } from "../util/crypt.js";
import addressToGeocode from "../util/geocode.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  const data = await Auth.login(email);
  if (data == null)
    return res.status(400).send({ message: "이메일이 존재하지 않습니다" });

  try {
    const data = await Auth.login(email);
    if (!checkHash(password, data.password)) throw new Error();
    req.session.user_id = data.user_id;
  } catch (err) {
    return res.status(400).send({ message: `로그인 실패: ${err}` });
  }

  return res.status(200).send({ message: "로그인 성공" });
};

const logout = async (req, res) => {
  await req.session.destroy();
  return res.status(200).send({ message: "로그아웃 성공" });
};

const register = async (req, res) => {
  const data = await Auth.login(req.body.email);
  if (data != null)
    return res.status(400).send({ message: "이메일이 존재합니다" });

  try {
    req.body.password = await makeHash(req.body.password);
  } catch (err) {
    console.log(er`암호화 에러: ${err}`);
    return res.status(400).send(`암호화 에러: ${err}`);
  }

  let latitude, longitude;
  try {
    const data = await addressToGeocode(req.body.school);
    latitude = data.latitude;
    longitude = data.longitude;
  } catch (err) {
    console.log(`Google Map API 에러: ${err}`);
    return res.status(400).send(`Google Map API 에러: ${err}`);
  }

  try {
    await User.insertUser({ ...req.body, latitude, longitude });
  } catch (err) {
    console.log(`db 에러: ${err}`);
    return res.status(500).send(`db 에러: ${err}`);
  }

  console.log({ ...req.body, latitude, longitude });

  return res.status(200).send({ message: "회원가입 성공" });
};

export { login, logout, register };
