import pool from "../util/database.js";

class Class {
  static findClass = async (user_id) => {
    const [results, fields] = await pool.query(
      "SELECT program_id AS class_id FROM class WHERE user_id = ?",
      user_id
    );
    return results;
  };

  static findBookmark = async (user_id) => {
    const [results, fields] = await pool.query(
      "SELECT program_id AS class_id FROM bookmark WHERE user_id = ?",
      user_id
    );
    return results;
  };

  static registerClass = async (user_id, program_id) => {
    const [results, fields] = await pool.query(
      "INSERT INTO class (user_id, program_id) VALUE (?, ?)",
      [user_id, program_id]
    );
  };

  static dropClass = async (user_id, program_id) => {
    const [results, fields] = await pool.query(
      "DELETE FROM class WHERE user_id = ? AND program_id = ?",
      [user_id, program_id]
    );
  };

  static addBookmark = async (user_id, program_id) => {
    const [results, fields] = await pool.query(
      "INSERT INTO bookmark (user_id, program_id) VALUE (?, ?)",
      [user_id, program_id]
    );
  };

  static cancelBookmark = async (user_id, program_id) => {
    const [results, fields] = await pool.query(
      "DELETE FROM bookmark WHERE user_id = ? AND program_id = ?",
      [user_id, program_id]
    );
  };
}

export default Class;
