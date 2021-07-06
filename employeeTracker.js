// Dependencies
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: process.env.DB_USER,

    // Your password
    password: process.env.DB_PASS,
    database: 'employeetracker_db',
});

const start = () => {
    console.log(
        ``
    );
    runSearch();
};

const runSearch = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'Find data within a specific range',
                'Search for a specific song',
                `See if an artist's song and album charted together`,
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View All Departments':
                    viewDepartments();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'View All Roles':
                    multiSearch();
                    break;

                case 'Add A Role':
                    multiSearch();
                    break;

                case 'View All Employees':
                    rangeSearch();
                    break;

                case 'Add An Employee':
                    rangeSearch();
                    break;

                case 'Update Employee Role':
                    rangeSearch();
                    break;

                case 'Exit':
                    connection.end();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

const viewDepartments = () => {
    const query =
      'SELECT name FROM department';
    connection.query(query, (err, res) => {
      if (err) throw err;
      res.forEach(({ name }) => console.log(name));
      runSearch();
    });
};

const viewRoles = () => {
    const query =
        `SELECT title, salary, department_id, department.name AS name
        FROM role
        LEFT JOIN department ON role.id = department.id`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      res.forEach(({ title, salary, name }) => console.log(title, salary, name));
      runSearch();
    });
};





// const viewDepartments = () => {
//     const query =
//       'SELECT name FROM department';
//     connection.query(query, (err, res) => {
//       if (err) throw err;
//       res.forEach(({ name }) => console.log(name));
//       runSearch();
//     });
// };

// Connect to the DB
connection.connect((err) => {
    if (err) throw err;
    if (dotenv.error) {
        throw dotenv.error
    };
    console.log(`connected as id ${connection.threadId}\n`);
    start();
});


//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// |
// |    _____
// |   | ____|
// |   |  _| |
// |   | |___|
// |   |_____|
// |
// |    __  __
// |   |  \/  |
// |   | |\/| |
// |   | |  | |
// |   |_|  |_|
// |
// |
// | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 