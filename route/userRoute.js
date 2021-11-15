const express = require("express");
const router = express.Router();

const pool = require("../db/DBConnection").pool;
const SQLManager = require("./../db/xml/SQLManager");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

// Save User
router.post("/save", async function (req, res) {
  var receivedObj = req.body;
  var conn;
  try {
    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");

    let userObj = Object.assign({}, receivedObj);

    bcrypt.hash(userObj.password, saltRounds, async function (err, hash) {
      userObj.password = hash;
      userObj.isActive = 1;

      // insert data into core_user table
      const [resultSave, field0] = await conn.query(
        await SQLManager("user", "Insert"),
        userObj
      );

      await conn.query("COMMIT");

      return res.json({
        success: true,
        message: "USER SAVED SUCCESSFULLY",
      });
    });

    throw new Error("Something went wrong!");
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: err.message,
    });
  } finally {
    if (undefined != conn) {
      await conn.query("ROLLBACK");
      conn.release();
    }
  }
});

// Fetch User
router.get("/fetch", async function (req, res) {
  var conn;
  try {
    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");

    // fetch data from core_company
    const [resultSet, field0] = await conn.query(
      await SQLManager("user", "Fetch").toString()
    );
    await conn.query("COMMIT");

    _.mapKeys(resultSet, (v, k) => _.camelCase(k));

    return res.json({
      success: true,
      message: "FETCHED USER SUCCESSFULLY",
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

// Login User
router.post("/login", async function (req, res) {
  var conn;
  try {
    let loginObj = Object.assign({}, req.body);

    conn = await pool.getConnection();
    await conn.query("START TRANSACTION");

    // check user from core_user with username
    const [resultSet, field0] = await conn.query(
      await SQLManager("user", "FetchByUserName").toString(),
      [loginObj.userName]
    );

    await conn.query("COMMIT");

    let result = await bcrypt.compare(loginObj.password, resultSet[0].password);

    if (result) {
      resultSet[0].password = null;
      return res.json({
        success: true,
        message: "LOGIN SUCCESS",
        data: resultSet,
      });
    } else
      return res.json({
        success: false,
        message: "PASSWORD NOT MATCHED!",
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
