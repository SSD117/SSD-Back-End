import pool from "../util/database.js";

class Auth {
  static login = async (email) => {
    const [results, fields] = await pool.query(
      "SELECT user_id, password, email FROM user WHERE email = ?",
      email
    );
    return results[0];
  };
}

export default Auth;
