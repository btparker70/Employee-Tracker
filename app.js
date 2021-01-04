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
            // based on their answer, either call the bid or the post functions
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
function addPrompt() { };

