const mysql = require("mysql2/promise");

var mysqlSettings = {
  host: "localhost",
  user: "root",
  database: "mss_cw",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  password: "1234",
};

const pool = mysql.createPool(mysqlSettings);

pool.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});

pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});

pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});

var getConnection = function (callback) {
  pool.getConnection(function (err, connection) {
    console.log("hello");
    callback(err, connection);
  });
};

module.exports.getConnection = getConnection;
module.exports.pool = pool;
