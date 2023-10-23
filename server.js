const express = require('express');
const mysql = require('mysql2');

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  //switch statements

  // app.get("/", (req, res)=>{
  //   db.query(......)
  // })

  // https://www.w3schools.com/sql/sql_groupby.asp

  // req.params
  // req.body