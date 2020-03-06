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

function start() {
  console.log('hello');
}

connection.end();