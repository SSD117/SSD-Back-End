import Class from "../models/class.model.js";

const getClass = async (req, res) => {
  try {
    const results = await Class.findClass(req.session.user_id);
    return res.status(200).send({ class_id: results.map((e) => e.class_id) });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const registerClass = async (req, res) => {
  try {
    await Class.registerClass(req.session.user_id, req.query.class_id);
    return res.status(201).send({ message: "스포츠 강좌 등록 성공" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const deleteClass = async (req, res) => {
  try {
    await Class.deleteClass(req.session.user_id, req.query.class_id);
    return res.status(200).send({ message: "스포츠 강좌 취소 성공" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const getBookmark = async (req, res) => {
  try {
    const results = await Class.findBookmark(req.session.user_id);
    return res.status(200).send({ class_id: results.map((e) => e.class_id) });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
const addBookmark = async (req, res) => {
  try {
    await Class.addBookmark(req.session.user_id, req.query.class_id);
    return res.status(201).send({ message: "즐겨찾기 등록 성공" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const cancelBookmark = async (req, res) => {
  try {
    await Class.cancelBookmark(req.session.user_id, req.query.class_id);
    return res.status(200).send({ message: "즐겨찾기 취소 성공" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

export {
  getClass,
  registerClass,
  deleteClass,
  getBookmark,
  addBookmark,
  cancelBookmark,
};