import pool from "../util/database.js";

class Class {
  static findClass = async (user_id) => {
    const [results, fields] = await pool.query(
      "SELECT c.program_id AS class_id, p.program_name AS class_name FROM program p LEFT JOIN class c ON p.program_id = c.program_id WHERE user_id = ?",
      user_id
    );
    return results;
  };

  static findBookmark = async (user_id) => {
    const [results, fields] = await pool.query(
      "SELECT b.program_id AS class_id, p.program_name AS class_name FROM program p LEFT JOIN bookmark b ON p.program_id = b.program_id WHERE user_id = ?",
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
