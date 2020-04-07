const connection = require('./connection');

class DB {
  constructor(connection) {
    this.connection = connection;
  };

  findEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  };

  findRoles() {
    return this.connection.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  findDepartments() {
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
    );
  }

  createNewDepartment(department) {
    return this.connection.query("INSERT INTO department SET ?", department);
  }

  createNewRole(role) {
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  createNewEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  updateEmployeesRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }
};

module.exports = new DB(connection);