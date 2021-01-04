// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "3s#W1Df$0Hk%",
    database: "employees_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// Prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "optionList",
            type: "list",
            message: "Would you like to view or add?",
            choices: ["VIEW", "ADD", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.optionList === "VIEW") {
                viewPrompt();
            }
            else if (answer.optionList === "ADD") {
                addPrompt();
            } else {
                connection.end();
            }
        });
}

// Choose to view departments, roles, employees 
function viewPrompt() {
    inquirer
        .prompt({
            name: "viewList",
            type: "list",
            message: "Would you like to view departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer view respective tables
            if (answer.viewList === "DEPARTMENTS") {
                viewDepartments();
            }
            else if (answer.viewList === "ROLES") {
                viewRoles();
            }
            else if (answer.viewList === "EMPLOYEES") {
                viewEmployees();
            }
            else {
                start();
            }
        });
}

// View departments table
function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        console.table(results)
    })
};

// View roles table
function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;
        console.table(results)
    })
};

// View employees table
function viewEmployees() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        console.table(results)
    })
};



// Add to tables
function addPrompt() {
    inquirer
        .prompt({
            name: "addList",
            type: "list",
            message: "Would you like to add to departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.addList === "DEPARTMENTS") {
                addDepartments();
            }
            else if (answer.addList === "ROLES") {
                addRoles();
            }
            else if (answer.addList === "EMPLOYEES") {
                addEmployees();
            }
            else {
                start();
            }
        });
};

// Add to departments table
function addDepartments() {
    inquirer
        .prompt(
            {
                name: "name",
                type: "input",
                message: "What is the new department name?"
            }
        )
        .then(function (answer) {
            connection.query("INSERT INTO departments SET ?",
                {
                    name: answer.name
                },
                function (err) {
                    if (err) throw err;
                    console.log("New department added successfully.");
                    start();
                })
        })

};

// Add to roles table
function addRoles() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?"
            },
            {
                name: "departmentId",
                type: "input",
                message: "What is the department ID of the new role?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentId,
                },
                function (err) {
                    if (err) throw err;
                    console.log("New role added successfully.");
                    start();
                })
        })

};

// Add to employees table
function addEmployees() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the new employee?"
            },
            {
                name: "roleId",
                type: "input",
                message: "What is the role ID of the new employee?"
            },
            {
                name: "managerId",
                type: "input",
                message: "What is the manager ID of the new employee?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO employees SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId
                },
                function (err) {
                    if (err) throw err;
                    console.log("New employee added successfully.");
                    start();
                })
        })
};