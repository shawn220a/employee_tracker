const mysql = require('mysql');
const util = require('util');

require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASS,
  database: 'employee_db'
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;