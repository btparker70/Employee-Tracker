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

//////// START ////////
// Prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "optionList",
            type: "list",
            message: "Would you like to view, add, update or delete?",
            choices: ["VIEW", "ADD", "UPDATE", "DELETE", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.optionList === "VIEW") {
                viewPrompt();
            }
            else if (answer.optionList === "ADD") {
                addPrompt();
            }
            else if (answer.optionList === "UPDATE") {
                updatePrompt();
            }
            else if (answer.optionList === "DELETE") {
                deletePrompt();
            } else {
                connection.end();
            }
        });
}

//////// VIEW ////////
// View departments, roles, employees 
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

//////// ADD ////////
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

//////// UPDATE ////////
// Update tables
function updatePrompt() {
    inquirer
        .prompt({
            name: "updateList",
            type: "list",
            message: "Would you like to update departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.updateList === "DEPARTMENTS") {
                updateDepartments();
            }
            else if (answer.updateList === "ROLES") {
                updateRoles();
            }
            else if (answer.updateList === "EMPLOYEES") {
                updateEmployees();
            }
            else {
                start();
            }
        });
};

// Update departments table
function updateDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        // Choose which department to edit from list of all departments
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to update?"
                },
                {
                    name: "name",
                    type: "input",
                    message: "What would you like rename the department?"
                }
            ])
            .then(function (answer) {
                // Get the id of the chosen department
                var chosenDeptartment;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name === answer.choice) {
                        chosenDeptartment = results[i];
                    }
                }
                // Update the table with the changes
                connection.query("UPDATE departments SET ? WHERE ?",
                    [
                        {
                            name: answer.name
                        },
                        {
                            id: chosenDeptartment.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Department updated successfully!");
                        start();
                    }
                );
            })
    })
};

// Update roles table
function updateRoles() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;

        // Choose which role to edit from list of all roles
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "Which role would you like to update?"
                },
                {
                    name: "title",
                    type: "input",
                    message: "What would you like rename the role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the updated salary?"
                },
                {
                    name: "departmentId",
                    type: "input",
                    message: "What is the updated department id?"
                },
            ])
            .then(function (answer) {
                // Get the id of the chosen role
                var chosenRole;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenRole = results[i];
                    }
                }
                // Update the table with the changes
                connection.query("UPDATE roles SET ? WHERE ?",
                    [
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: answer.departmentId
                        },
                        {
                            id: chosenRole.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Role updated successfully!");
                        start();
                    }
                );
            })
    })
};

// Update employees table
function updateEmployees() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;

        // Choose which employee to edit from list of all employees
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name + ' ' + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                },
                {
                    name: "firstName",
                    type: "input",
                    message: "What would you like rename their first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What would you like rename their last name?"
                },
                {
                    name: "roleId",
                    type: "input",
                    message: "What is their updated role id?"
                },
                {
                    name: "managerId",
                    type: "input",
                    message: "What is their updated manager id?"
                }
            ])
            .then(function (answer) {
                // Get the id of the chosen employee
                var chosenEmployee;
                // Parse only first name from the prompt
                var firstNameParse = answer.choice.split(" ", 1).toString();
                for (var i = 0; i < results.length; i++) {
                    if (results[i].first_name === firstNameParse) {
                        chosenEmployee = results[i];
                    }
                }

                // Update the table with the changes
                connection.query("UPDATE employees SET ? WHERE ?",
                    [
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.roleId,
                            manager_id: answer.managerId
                        },
                        {
                            id: chosenEmployee.id
                        },
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Employee updated successfully!");
                        start();
                    }
                );
            })
    })
};

//////// DELETE ////////
function deletePrompt() {
    inquirer
        .prompt({
            name: "deleteList",
            type: "list",
            message: "Would you like to make deletions from departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.deleteList === "DEPARTMENTS") {
                deleteDepartments();
            }
            else if (answer.deleteList === "ROLES") {
                deleteRoles();
            }
            else if (answer.deleteList === "EMPLOYEES") {
                deleteEmployees();
            }
            else {
                start();
            }
        });
};

// Delete departments table
function deleteDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        // Choose which department to delete from the list of all departments
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this department?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteDepartments();
                } else {
                    // Get the id of the chosen department
                    var chosenDeptartment;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].name === answer.choice) {
                            chosenDeptartment = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM departments WHERE ?",
                        {
                            id: chosenDeptartment.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Department deleted successfully!");
                            start();
                        }
                    );
                }
            })
    })
};

// Delete roles table
function deleteRoles() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;

        // Choose which role to delete from the list of all roles
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "Which role would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this role?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteRoles();
                } else {
                    // Get the id of the chosen role
                    var chosenRole;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].title === answer.choice) {
                            chosenRole = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM roles WHERE ?",
                        {
                            id: chosenRole.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Role deleted successfully!");
                            start();
                        }
                    );
                }
            })
    })
};

// Delete employees table
function deleteEmployees() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;

        // Choose which employee to delete from the list of all employees
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name + ' ' + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Which emplooyee would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this employee?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteEmployees();
                } else {
                    // Get the id of the chosen department
                    var chosenEmployee;
                    // Parse only first name from the prompt
                    var firstNameParse = answer.choice.split(" ", 1).toString();
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].first_name === firstNameParse) {
                            chosenEmployee = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM employees WHERE ?",
                        {
                            id: chosenEmployee.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Employee deleted successfully!");
                            start();
                        }
                    );
                }
            })
    })
};