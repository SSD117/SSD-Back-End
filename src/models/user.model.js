import pool from "../util/database.js";

class User {
  static findUser = async (id) => {
    const [results, fields] = await pool.query(
      "SELECT user_id, email, rating, name, age, gender, height, weight, school, phone, balance, latitude, longitude FROM user WHERE user_id = ?;",
      id
    );
    return results;
  };

  static insertUser = async (data) => {
    await pool.query(
      "INSERT INTO user(email, password, rating, name, age, gender, height, weight, school, latitude, longitude, phone, experience) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [
        data.email,
        data.password,
        data.rating,
        data.name,
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.school,
        data.latitude,
        data.longitude,
        data.phone,
        data.experience.toUpperCase() == "Y" ? 1 : 0,
      ]
    );

    const [[{ user_id }], fields] = await pool.query(
      "SELECT user_id FROM user WHERE email = ?",
      [data.email]
    );

    const params = [];
    const clause = [];
    let insertClause = "";

    if (data.exercies) {
      data.exercies.forEach((exercise) => {
        params.push(...[user_id, exercise, 0]);
        clause.push("(?, ?, ?)");
      });
      insertClause = clause.join(", ");
    }

    await pool.query(
      `INSERT INTO exercise(user_id, exercise_name, is_recommend) values ${insertClause}`,
      params
    );
  };

  static updateUser = async (data) => {
    let stmts = [],
      values = [],
      columns = [
        "email",
        "password",
        "rating",
        "name",
        "age",
        "gender",
        "height",
        "weight",
        "school",
        "balance",
        "experience",
      ];

    for (let c of columns) {
      if (c in data) {
        stmts.push(`${c} = ?`);
        values.push(data[c]);
      }
    }

    await pool.query(`UPDATE user SET ${stmts.join(", ")} WHERE user_id = ?`, [
      ...values,
      data.id,
    ]);
  };

  static deleteUser = async (user_id) => {
    await pool.query("DELETE FROM user WHERE user_id = ?", user_id);
  };
}

export default User;
