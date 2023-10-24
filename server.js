const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

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

async function init() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
        name: 'options',
      },
    ]);

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
  }
};

function viewAllDepartments() {
  db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

function viewAllRoles() {
  db.query('SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

function viewAllEmployees() {
  db.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department, r.salary AS Salary, m.first_name AS Manager_First_Name, m.last_name AS Manager_Last_Name FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id; ', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

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
}

function addRole() {
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
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID for this role:'
      }
    ])
    .then((answers) => {
      db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [answers.title, answers.salary, answers.department_id], (err, results) => {
        if (err) throw err;
        console.log(`Added role: ${answers.title}`);
        init();
      });
    });
}

function addEmployee() {
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
        type: 'input',
        name: 'role_id',
        message: "Enter the role ID for this employee:"
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the manager's ID for this employee (if applicable):",
        default: null,
      }
    ])
    .then((answers) => {
      if (answers.manager_id === '') {
        answers.manager_id = null;
      }
      db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, results) => {
        if (err) throw err;
        console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
        init();
      });
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the ID of the employee whose role you want to update:'
      },
      {
        type: 'input',
        name: 'new_role_id',
        message: 'Enter the new role ID for this employee:'
      }
    ])
    .then((answers) => {
      db.query('UPDATE employee SET role_id = ? WHERE id = ?;', [answers.new_role_id, answers.employee_id], (err, results) => {
        if (err) throw err;
        console.log(`Updated role for employee with ID ${answers.employee_id}`);
        init();
      });
    });
}

// app.get('/api/departments', (req, res) => {
//   db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.get('/api/roles', (req, res) => {
//   db.query('SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.get('/api/employees', (req, res) => {
//   db.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department, r.salary AS Salary, m.first_name AS Manager_First_Name, m.last_name AS Manager_Last_Name FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id; ', (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.post('/api/add-department', (req, res) => {
//   db.query('INSERT INTO department (name) VALUES (?);', req.body.name, (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.post('/api/add-role', (req, res) => {
//   db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [req.body.title, req.body.salary, req.body.department_id], (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.post('/api/add-employee', (req, res) => {
//   db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id], (err, results) => {
//     console.log(results); res.json(results)
//   })
// });

// app.put('/api/role/:id', (req, res) => {
//   db.query('UPDATE employee SET role_id = ? WHERE id = ?;', [req.body.role_id, req.params.id], (err, results) => {
//     console.log(results); res.json(results)
//   })
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

init();

//why is prompts listed twice
//remove index columns
// UI
// Modularization
//Bonus
//README
//Video WAlkthrough