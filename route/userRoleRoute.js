const express = require("express");
const router = express.Router();

const pool = require("../db/DBConnection").pool;
const SQLManager = require("./../db/xml/SQLManager");
const _ = require("lodash");

// Fetch user roles
router.get("/fetch/all", async function (req, res) {
  var conn;
  try {
    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");

    // fetch data from core_user_role
    const [resultSet, field0] = await conn.query(
      await SQLManager("user_role", "FetchAll").toString()
    );
    await conn.query("COMMIT");

    _.mapKeys(resultSet, (v, k) => _.camelCase(k));

    return res.json({
      success: true,
      message: "FETCHED USER ROLES SUCCESSFULLY",
      data: resultSet,
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (undefined != conn) {
      await conn.query("ROLLBACK");
      conn.release();
    }
  }
});

module.exports = router;
