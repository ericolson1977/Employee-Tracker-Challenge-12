const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

// asynchronous function to lauch the CMS
async function init() {
  try {
    // using await to allow for the user to make a selection
    const answers = await inquirer.prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
        name: 'options',
      },
    ]);
    //switch will determine which function to call basedo nthe user's selection
    switch (answers.options) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Quit':
        process.exit();
    }
  } catch (error) {
    console.error('error', error.message);
  };
};

//pulls department name and id from db and diplays in the terminal
function viewAllDepartments() {
  db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

//pulls job role data from db and diplays in the terminal
function viewAllRoles() {
  db.query('SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

//pulls employee data from db and diplays in the terminal
function viewAllEmployees() {
  db.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department, r.salary AS Salary, m.first_name AS Manager_First_Name, m.last_name AS Manager_Last_Name FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id; ', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

//takes user input and uses it to add a new department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the department name:'
      }
    ])
    .then((answers) => {
      db.query('INSERT INTO department (name) VALUES (?);', [answers.name], (err, results) => {
        if (err) throw err;
        console.log(`Added department: ${answers.name}`);
        init();
      });
    });
};

//grabs department info from db in order to use it in an inquirer list prompt
function getDepartmentChoices(callback) {
  db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, results) => {
    if (err) throw err;
    const departmentChoices = results.map((result) => ({
      name: result.Department_Name,
      value: result.Department_ID,
    }));
    callback(departmentChoices);
});
};

//grabs job role info from db in order to use it in an inquirer list prompt
function getRoles(callback) {
  db.query('SELECT id, title FROM role', (err, roles) => {
    if (err) throw err;
    const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));
    callback(roleChoices);
  });
};

//grabs employee info from db in order to use it in an inquirer list prompt
function getEmployees(callback) {
  db.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) throw err;
    const employeeChoices = employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    callback(employeeChoices);
  });
};

//takes user input and uses it to add a new job role to the db
function addRole() {
  getDepartmentChoices((departmentChoices) => {
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the role title:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the role salary:'
      },
      {
        type: 'list',
        name: 'department',
        message: 'Enter the department the role belongs to:',
        choices: departmentChoices
      }
    ])
    .then((answers) => {
      const department_id = answers.department;
      db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [answers.title, answers.salary, department_id], (err, results) => {
        if (err) throw err;
        console.log(`Added role: ${answers.title}`);
        init();
      });
      });
    });
};

//takes user input and uses it to add a new employee to the db
function addEmployee() {
  getRoles((roleChoices) => {
    getEmployees((employeeChoices) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:"
      },
      {
        type: 'list',
        name: 'role',
        message: "Enter the role for this employee:",
        choices: roleChoices
      },
      {
        type: 'list',
        name: 'manager',
        message: "Enter the employee's manager (if applicable):",
        //allows for null entry indicating this employee has no manager and therefore is a manager
        choices: [...employeeChoices, {name:'None', value: null }]
      }
    ])
    .then((answers) => {
      if (answers.manager_id === '') {
        answers.manager_id = null;
      }
      db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [answers.first_name, answers.last_name, answers.role, answers.manager], (err, results) => {
        if (err) throw err;
        console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
        init();
      });
    });
    });
  });
};

//take user input and uses it to update an employee job role and sends to the db
function updateEmployeeRole() {
  getRoles((roleChoices) => {
    getEmployees((employeeChoices) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Enter the employee whose role you want to update:',
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'new_role',
        message: 'Enter the new role for this employee:',
        choices: roleChoices
      }
    ])
    .then((answers) => {
      db.query('UPDATE employee SET role_id = ? WHERE id = ?;', [answers.new_role, answers.employee], (err, results) => {
        if (err) throw err;
        console.log(`Updated role for employee ${answers.employee}`);
        init();
      });
    });
  });
});
};

//verifies connection to server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//function call to start app
init();
