import pool from "../util/database.js";

class User {
  static findUser = async (id) => {
    const [results, fields] = await pool.query(
      "SELECT user_id, email, rating, name, age, gender, height, weight, school, balance FROM user WHERE user_id = ?;",
      id
    );
    return results;
  };

  static insertUser = async (data) => {
    await pool.query(
      "INSERT INTO user(email, password, rating, name, age, gender, height, weight, school, preference, intense, frequency, place, friend, goal, method, type) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
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
        data.preference,
        data.intense,
        data.frequency,
        data.place,
        data.friend,
        data.goal,
        data.method,
        data.type,
      ]
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
        "preference",
        "intense",
        "frequency",
        "place",
        "friend",
        "goal",
        "method",
        "type",
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

  static deleteUser = async (id) => {
    await pool.query("DELETE FROM user WHERE user_id = ?", values);
  };
}

export default User;
