const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

const pool = mysql.createPool({
  connectionLimit: 10, // Jumlah maksimal koneksi
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true, // Tunggu koneksi tersedia jika perlu
  queueLimit: 0, // Tidak ada batas antrian
  connectTimeout: 10000, // Timeout koneksi dalam milidetik
  acquireTimeout: 10000, // Timeout pengambilan koneksi dalam milidetik
});

pool.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const User = function (user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
};

User.create = (newUser, result) => {
  pool.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findByUsername = (username, result) => {
  pool.query(`SELECT * FROM users WHERE username = ?`, [username], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

module.exports = User;
