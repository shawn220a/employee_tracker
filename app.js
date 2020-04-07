const inquirer = require('inquirer');
const db = require('./db/DB');
require('console.table');

mainQuestions();

function mainQuestions() {
  inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'How would you like to start?',
    choices: [
      {
        name: 'View all the employees',
        value: 'view-employees'
      },
      // {
      //   name: 'View all the employees by department',
      //   value: 'view-employees-by-department'
      // },
      // {
      //   name: 'View all the employees by manager',
      //   value: 'view-employees-by-manager'
      // },
      {
        name: 'Add an employee',
        value: 'add-employee'
      },
      // {
      //   name: 'Remove an employee',
      //   value: 'remove-employee'
      // },
      {
        name: 'Update an employee\'s role',
        value: 'update-employee-role'
      },
      // {
      //   name: 'Update an employee\'s manager',
      //   value: 'update-employee-manager'
      // },
      {
        name: 'View all the roles',
        value: 'view-roles'
      },
      {
        name: 'Add a role',
        value: 'add-role'
      },
      // {
      //   name: 'Remove a role',
      //   value: 'remove-role'
      // },
      {
        name: 'View all the departments',
        value: 'view-departments'
      },
      {
        name: 'Add a department',
        value: 'add-department'
      },
      // {
      //   name: 'Remove a department',
      //   value: 'remove-department'
      // },
      {
        name: 'Quit',
        value: 'quit'
      }
    ]
  }).then((answers) => {
    const { choice } = answers;

    switch (choice) {
      case 'view-employees':
        return viewEmployees();
      case 'view-roles':
        return viewRoles();
      case 'view-departments':
        return viewDepartments();
      case 'add-employee':
        return addNewEmployee();
      case 'update-employee-role':
        return updateEmployeesRole();
      case 'add-role':
        return addRole();
      case 'add-department':
        return addDepartment();
      default:
        quit();
    }
  });
}

async function viewEmployees() {
  const employees = await db.findEmployees();

  console.log('\n');
  console.table(employees);

  mainQuestions();
}

async function viewRoles() {
  const roles = await db.findRoles();

  console.log('\n');
  console.table(roles);

  mainQuestions();
}

async function viewDepartments() {
  const departments = await db.findDepartments();

  console.log('\n');
  console.table(departments);

  mainQuestions();
}

async function addNewEmployee() {
  const roles = await db.findRoles();
  const employees = await db.findEmployees();

  const employee = await inquire.prompt([
    {
      name: 'first_name',
      message: 'What is the employee\'s first name?'
    },
    {
      name: 'last_name',
      message: 'What is the employee\'s last name?'
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await inquire.prompt({
    type: 'list',
    name: 'roleId',
    message: 'What is the employee\'s role?',
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: 'None', value: null });

  const { managerId } = await inquire.prompt({
    type: 'list',
    name: 'managerId',
    message: 'Who is the employee\'s manager?',
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createNewEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  mainQuestions();
}

async function updateEmployeesRole() {
  const employees = await db.findEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await inquire.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Which employee\'s role do you want to update?',
      choices: employeeChoices
    }
  ]);

  const roles = await db.findRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await inquire.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Which role do you want to assign the selected employee?',
      choices: roleChoices
    }
  ]);

  await db.updateEmployeesRole(employeeId, roleId);

  console.log('Updated employee\'s role');

  mainQuestions();
}

async function addRole() {
  const departments = await db.findDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await inquire.prompt([
    {
      name: 'title',
      message: 'What is the name of the role?'
    },
    {
      name: 'salary',
      message: 'What is the salary of the role?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department does the role belong to?',
      choices: departmentChoices
    }
  ]);

  await db.createNewRole(role);

  console.log(`Added ${role.title} to the database`);

  mainQuestions();
}

async function addDepartment() {
  const department = await inquire.prompt([
    {
      name: 'name',
      message: 'What is the name of the department?'
    }
  ]);

  await db.createNewDepartment(department);

  console.log(`Added ${department.name} to the database`);

  mainQuestions();
}

function quit() {
  console.log('Goodbye!');
  process.exit();
}