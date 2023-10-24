SELECT name AS Department_Name, id AS Department_ID
FROM department;

SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department, salary AS Salary
FROM role
JOIN department ON role.department_id = department.id;

SELECT 
  e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department, r.salary AS Salary, m.first_name AS Manager_First_Name, m.last_name AS Manager_Last_Name
FROM employee AS e
JOIN role AS r ON e.role_id = r.id
JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id;

INSERT INTO department (name) 
VALUES (?);

INSERT INTO role (title, salary, department_id) 
VALUES (?, ?, ?);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (?, ?, ?, ?);

UPDATE employee
SET role_id = ?
WHERE id = ?;
 
