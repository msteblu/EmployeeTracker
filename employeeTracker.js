// Dependencies
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST,

    // PORT
    port: 3306,

    // USERNAME
    user: process.env.DB_USER,

    // PASSWORD
    password: process.env.DB_PASS,
    database: 'employeetracker_db',
});

// First function
const start = () => {
    console.log(`
        - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        |                                                     |
        |    _____                 _                          |
        |   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    |
        |   |  _| | '_ ' _ \| '_ \| |/ _ \| | | |/ _ \/ _ \   |
        |   | |___| | | | | | |_) | | (_) | |_| |  __/  __/   |
        |   |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___|   |
        |                   |_|            |___/              |
        |    __  __                                           |
        |   |  \/  | __ _ _ __   __ _  __ _  ___ _ __         |
        |   | |\/| |/ _' | '_ \ / _' |/ _' |/ _ \ '__|        |
        |   | |  | | (_| | | | | (_| | (_| |  __/ |           |
        |   |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|           |
        |                             |___/                   |
        |                                                     |
        | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    
    `);

    runSearch();
};

// USER OPTIONS
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
                'Add A Department',
                `Add A Role`,
                'Add An Employee',
                'Update Employee Role',
                'Update Employee Manager',
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

                case 'Add A Department':
                    addDepartment();
                    break;

                case 'Add A Role':
                    addRole();
                    break;

                case 'Add An Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateERole();
                    break;
                case 'Update Employee Manager':
                    updateEManager();
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

// View All Departments
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

// View All Roles 
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

// View All Employees
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

// Add A Department
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'addDepartment',
                type: 'input',
                message: 'What is the name of the department?',
            }
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.addDepartment,
                },
                (err) => {
                    if (err) throw err;
                    console.log('The department was added successfully!');

                    runSearch();
                }
            );
        });
};

// Add A Role
const addRole = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'addTitle',
                    type: 'input',
                    message: `What is the role's title?`,
                },
                {
                    name: 'addSalary',
                    type: 'input',
                    message: `What is the role's salary?`,
                },
                {
                    name: 'addDepartment',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ name }) => {
                            choiceArray.push(name);
                        });
                        return choiceArray;
                    },
                    message: `What department is the role in?`,
                }
            ])
            .then((answer) => {
                let chosenDepartment;
                results.forEach((department) => {
                    if (department.name === answer.addDepartment) {
                        chosenDepartment = department;
                    }
                });

                connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: answer.addTitle,
                        salary: answer.addSalary,
                        department_id: chosenDepartment.id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('The role was added successfully!');

                        runSearch();
                    }
                );
            });
    })
};

// Add An Employee
const addEmployee = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        connection.query(`SELECT * FROM employee`, (err, results2) => {
            if (err) throw err;
            console.log(results);
            inquirer
                .prompt([
                    {
                        name: 'addFirst',
                        type: 'input',
                        message: `What is the employee's first name?`,
                    },
                    {
                        name: 'addLast',
                        type: 'input',
                        message: `What is the employee's last name?`,
                    },
                    {
                        name: 'addRole',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            results.forEach(({ title }) => {
                                choiceArray.push(title);
                            });
                            return choiceArray;
                        },
                        message: `What role does the employee have?`,
                    },
                    {
                        name: 'addManager',
                        type: 'rawlist',
                        choices() {
                            const choiceArray2 = [];
                            results2.forEach(({ first_name, last_name }) => {
                                let fullName = first_name + " " + last_name;
                                choiceArray2.push(fullName);
                            });
                            return choiceArray2;
                        },
                        message: `Who is the employee's manager?`,
                    }
                ])
                .then((answer) => {
                    let chosenRole;
                    results.forEach((role) => {
                        if (role.title === answer.addRole) {
                            chosenRole = role;
                        }
                    });

                    let chosenManager;
                    results2.forEach((employee) => {
                        if ((employee.first_name + " " + employee.last_name) === answer.addManager) {
                            chosenManager = employee;
                        }
                    });

                    connection.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: answer.addFirst,
                            last_name: answer.addLast,
                            role_id: chosenRole.id,
                            manager_id: chosenManager.id,
                        },
                        (err) => {
                            if (err) throw err;
                            console.log('The employee was added successfully!');

                            runSearch();
                        }
                    );
                });
        })
    })
};

// Update An Employee Role
const updateERole = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        connection.query('SELECT * FROM role', (err, results2) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: 'upEmployee',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            results.forEach(({ first_name, last_name }) => {
                                let fullName = first_name + " " + last_name;
                                choiceArray.push(fullName);
                            });
                            return choiceArray;
                        },
                        message: `Which employee would you like to update?`,
                    },
                    {
                        name: 'upRole',
                        type: 'rawlist',
                        choices() {
                            const choiceArray2 = [];
                            results2.forEach(({ title }) => {
                                choiceArray2.push(title);
                            });
                            return choiceArray2;
                        },
                        message: `What is the employee's new role?`,
                    },
                ])
                .then((answer) => {
                    let chosenEmployee;
                    results.forEach((employee) => {
                        if ((employee.first_name + " " + employee.last_name) === answer.upEmployee) {
                            chosenEmployee = employee;
                        }
                    });

                    let chosenRole;
                    results2.forEach((role) => {
                        if ((role.title) === answer.upRole) {
                            chosenRole = role;
                        }
                    });

                    connection.query(
                        'UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: chosenRole.id,
                            },
                            {
                                id: chosenEmployee.id,
                            },
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log('Role updated successfully!');

                            runSearch();
                        }
                    );
                });
        });
    });
};

// Update An Employee's Manager
const updateEManager = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'upEEmployee',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ first_name, last_name }) => {
                            let fullName = first_name + " " + last_name;
                            choiceArray.push(fullName);
                        });
                        return choiceArray;
                    },
                    message: `Which employee would you like to update?`,
                },
                {
                    name: 'upManager',
                    type: 'rawlist',
                    choices() {
                        const choiceArray2 = [];
                        results.forEach(({ first_name, last_name }) => {
                            let fullName = first_name + " " + last_name;
                            choiceArray2.push(fullName);
                        });
                        return choiceArray2;
                    },
                    message: `Who is the employee's new manager?`,
                },
            ])
            .then((answer) => {
                let chosenEmployee;
                results.forEach((employee) => {
                    if ((employee.first_name + " " + employee.last_name) === answer.upEEmployee) {
                        chosenEmployee = employee;
                    }
                });

                let chosenManager;
                    results.forEach((employee) => {
                        if ((employee.first_name + " " + employee.last_name) === answer.upManager) {
                            chosenManager = employee;
                        }
                    });

                connection.query(
                    'UPDATE employee SET ? WHERE ?',
                    [
                        {
                            manager_id: chosenManager.id,
                        },
                        {
                            id: chosenEmployee.id,
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('Manager updated successfully!');

                        runSearch();
                    }
                );
            });
    });
};

const viewMEmployees = () => {

};

const deleteDepartments = () => {

};

const deleteRoles = () => {

};

const deleteEmployees = () => {

};

const viewDepartmentBudget = () => {

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


//  - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// |                                                     |
// |    _____                 _                          |
// |   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    |
// |   |  _| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \   |
// |   | |___| | | | | | |_) | | (_) | |_| |  __/  __/   |
// |   |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___|   |
// |                   |_|            |___/              |
// |    __  __                                           |
// |   |  \/  | __ _ _ __   __ _  __ _  ___ _ __         |
// |   | |\/| |/ _` | `_ \ / _` |/ _` |/ _ \ `__|        |
// |   | |  | | (_| | | | | (_| | (_| |  __/ |           |
// |   |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|           |
// |                             |___/                   |
// |                                                     |
// | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _