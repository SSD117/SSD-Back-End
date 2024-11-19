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
      SELECT f.facility_id, p.program_type AS exercise, p.program_name, f.address, ${distance_sql} AS distance, p.time 
      FROM facility f LEFT JOIN program p ON f.facility_id = p.facility_id
      ${whereClause}
      ${havingClause}
      LIMIT ?
      OFFSET ?
    `;
    params.push(itemsPerPage, offset);

    console.log(sql, params);

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
      SELECT f.facility_name, f.facility_type, f.address, p.program_name, p.program_type as exercise, p.begin, p.end, p.day, p.time, p.recruit_cnt as recruit, p.price 
      FROM facility f LEFT JOIN program p ON f.facility_id = p.facility_id 
      ${whereClause}
      LIMIT ?
      OFFSET ?
    `;
    params.push(itemsPerPage, offset);

    const [results, fields] = await pool.query(sql, params);

    return results;
  };
}

export default Sport;
