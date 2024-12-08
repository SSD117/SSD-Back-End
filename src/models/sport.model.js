import pool from "../util/database.js";

class Sport {
  static findSport = async (page, exercises, distance, time, user_id) => {
    // 페이지네이션
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const params = [];
    let whereClause = "WHERE 1 = 1";
    let havingClause = "HAVING 1 = 1";
    let distance_sql = `
          (6371 * acos(
              cos(radians(?)) * cos(radians(f.latitude)) *
              cos(radians(f.longitude) - radians(?)) +
              sin(radians(?)) * sin(radians(f.latitude))
          ))`;

    // 운동 필터링
    if (exercises) {
      const exerciseConditions = exercises
        .map(() => "p.program_type = ?")
        .join(" OR ");
      whereClause += ` AND ${exerciseConditions}`;
      params.push(...exercises);
    }

    // 오전, 오후 필터링
    if (time) {
      if (time === "오전") {
        whereClause += `
            AND CAST(SUBSTRING_INDEX(p.time, '~', 1) AS TIME) BETWEEN '00:00:00' AND '11:59:59'
          `;
      } else if (time === "오후") {
        whereClause += `
            AND CAST(SUBSTRING_INDEX(p.time, '~', 1) AS TIME) BETWEEN '12:00:00' AND '23:59:59'
          `;
      }
    }

    // 거리 필터링
    if (distance) {
      const [[{ latitude, longitude }], fields] = await pool.query(
        "SELECT latitude, longitude FROM user WHERE user_id = ?",
        user_id
      );
      havingClause += " AND distance <= ?";
      params.push(latitude, longitude, latitude, distance);
    }

    const sql = `
      SELECT DISTINCT f.facility_id AS sport_id, p.program_type AS exercise, f.facility_name AS program_name, f.address, ${distance_sql} AS distance 
      FROM facility f LEFT JOIN program p ON f.facility_id = p.facility_id
      ${whereClause}
      ${havingClause}
      LIMIT ?
      OFFSET ?
    `;
    params.push(itemsPerPage, offset);

    const [results, fields] = await pool.query(sql, params);

    return results;
  };

  static findSportById = async (id, page, price, day) => {
    // 페이지네이션
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const params = [];
    let whereClause = "WHERE 1 = 1";

    // 스포츠 강좌 id 필터링
    if (id) {
      whereClause += " AND f.facility_id = ?";
      params.push(id);
    }

    // 가격 필터링
    if (price) {
      whereClause += " AND p.price <= ?";
      params.push(price);
    }

    // 요일 필터링
    if (day) {
      const dayConditions = day.map(() => "p.day LIKE ?").join(" OR ");
      whereClause += ` AND (${dayConditions})`;
      params.push(...day.map((d) => `%${d}%`));
    }

    const sql = `
      SELECT p.program_id AS class_id, f.facility_name, f.facility_type, f.address, p.program_name, p.program_type as exercise, p.begin, p.end, p.day, p.time, p.recruit_cnt as recruit, p.price 
      FROM facility f LEFT JOIN program p ON f.facility_id = p.facility_id 
      ${whereClause}
      LIMIT ?
      OFFSET ?
    `;
    params.push(itemsPerPage, offset);

    const [results] = await pool.query(sql, params);

    return results;
  };

  static isExistRecommendSport = async (user_id) => {
    const [[{ result }]] = await pool.query(
      `SELECT CASE WHEN EXISTS ( SELECT 1 FROM exercise WHERE user_id = ? AND is_recommend = 1) THEN 'Y' ELSE 'N' END AS result;`,
      user_id
    );

    if (result == "Y") return true;
    else return false;
  };

  static findRecommendSport = async (user_id) => {
    const [result] = await pool.query(
      "SELECT exercise_name as exercise FROM exercise WHERE user_id = ? AND is_recommend = 1",
      user_id
    );
    return result.map((e) => e.exercise);
  };

  static insertRecommendSport = async (user_id, exercies) => {
    const params = [];
    const clause = [];
    let insertClause = "";

    exercies.forEach((exercise) => {
      params.push(...[user_id, exercise, 1]);
      clause.push("(?, ?, ?)");
    });

    insertClause = clause.join(", ");

    await pool.query(
      `INSERT INTO exercise(user_id, exercise_name, is_recommend) values ${insertClause}`,
      params
    );
  };

  static deleteRecommendSport = async (user_id) => {
    await pool.query(
      `DELETE FROM exercise WHERE user_id = ? AND is_recommend = 1`,
      user_id
    );
  };
}

export default Sport;
