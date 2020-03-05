const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'shawn220321',
  database: 'employee_db'
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
});

connection.end();