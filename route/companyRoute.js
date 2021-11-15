const express = require("express");
const router = express.Router();

const pool = require("../db/DBConnection").pool;
const SQLManager = require("./../db/xml/SQLManager");
const _ = require("lodash");

// Save Company details
router.post("/save", async function (req, res) {
  var receivedObj = req.body;
  var conn;
  try {
    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");

    let companyObj = Object.assign({}, receivedObj);

    // insert data into core_company table
    const [resultSave, field0] = await conn.query(
      await SQLManager("company", "Insert"),
      companyObj
    );

    await conn.query("COMMIT");

    return res.json({
      success: true,
      message: "COMPANY SAVED SUCCESSFULLY",
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

// Fetch Company details
router.get("/fetch", async function (req, res) {
  var conn;
  try {
    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");
    
    // fetch data from core_company
    const [resultSet, field0] = await conn.query(
      await SQLManager("company", "Fetch").toString()
    );
    await conn.query("COMMIT");

    _.mapKeys(resultSet, (v, k) => _.camelCase(k));

    return res.json({
      success: true,
      message: "FETCHED COMPANY SUCCESSFULLY",
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
