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
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
        name: 'options',
      },
    ]);

    switch (answers.options) {
      case 'View All Departments':

        break;
      case 'View All Roles':

        break;
      case 'View All Employees':

        break;
      case 'Add Department':

        break;
      case 'Add Role':

        break;
      case 'Add Employee':

        break;
      case 'Update Employee Role':

        break;
    }
  } catch (error) {
    console.error('error', error.message);
  }
};

app.get('/api/departments', (req, res) => {
  db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, results) => {
    console.log(results); res.json(results)
  })
});

app.get('/api/roles', (req, res) => {
  db.query('SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
    console.log(results); res.json(results)
  })
});

app.get('/api/employees', (req, res) => {
  db.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department, r.salary AS Salary, m.first_name AS Manager_First_Name, m.last_name AS Manager_Last_Name FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id; ', (err, results) => {
    console.log(results); res.json(results)
  })
});

app.post('/api/add-department', (req, res) => {
  db.query('INSERT INTO department (name) VALUES (?);', req.body.name, (err, results) => {
    console.log(results); res.json(results)
  })
});

app.post('/api/add-role', (req, res) => {
  db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [req.body.title, req.body.salary, req.body.department_id], (err, results) => {
    console.log(results); res.json(results)
  })
});

app.post('/api/add-employee', (req, res) => {
  db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id], (err, results) => {
    console.log(results); res.json(results)
  })
});

app.put('/api/role/:id', (req, res) => {
  db.query('UPDATE employee SET role_id = ? WHERE id = ?;', [req.body.role_id, req.params.id], (err, results) => {
    console.log(results); res.json(results)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

init();