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
                'View All Employees',
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

                case 'View All Employees':
                    viewEmployees();
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
        let cloned = res.map(({ name }) => ({ name }));
        const table = cTable.getTable(cloned);
        console.log(table);

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
        let cloned = res.map(({ title, salary, name }) => ({ title, salary, name }));
        const table = cTable.getTable(cloned);
        console.log(table);

        runSearch();
    });
};

const viewEmployees = () => {
    const query =
        `SELECT first_name, last_name, role.title AS title, department.name AS department
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        let cloned = res.map(({ first_name, last_name, title, department }) => ({ first_name, last_name, title, department }));
        const table = cTable.getTable(cloned);
        console.log(table);

        runSearch();
    });
};


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