let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazon',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n\n");
    supervisorDuty();
});


function supervisorDuty() {
    console.log(`\r\nHello Bamazon Supervisor!\r\n`)
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'supervisorDuty',
                message: 'Which operation would you like to perform?',
                choices: ['View product sales by department', 'Create new department']
            }
        ])
        .then(answers => {
            switch (answers.supervisorDuty) {
                case 'View product sales by department':
                    viewProductSales();
                    break;
                case 'Create new department':
                    createNewDept();
                    break;
                default:
                    console.log(`\r\n Sorry there has been an error \r\n`);
                    supervisorDuty();
            }
        });
}

function viewProductSales() {

}

function createNewDept() {
    inquirer
        .prompt([
            {
                name: "departmentAdded",
                type: "input",
                message: "What is the name of the new department?",
                validate: function (value) {
                    if (value.length > 0 && value.match(/[^\s]+/i)) {
                        return true;
                    } else {
                        console.log('Invalid input')
                        return false;
                    }
                }
            }, {
                name: "newDeptOH",
                type: "input",
                message: "What is the overhead of the new department?",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    } else {
                        console.log('Invalid input')
                        return false;
                    }
                }
            }
        ])
        .then(answers => {
            connection.query(
                "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
                [
                    answers.departmentAdded,
                    answers.newDeptOH,
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(`\r\n Department  Added\r\n`);
                    // recall the function to display the table if the user wants to place another order. End the connection otherwise
                }
            );
        });
}

// use function to prevent repeating reests to choose another operation
function newRequest() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'newRequest',
            message: 'Do you want to make another request?',
            default: true
        },
    ]).then(response => {
        if (response.newRequest) {
            supervisorDuty(); 
        } else {
            console.log(`\r\n Have a nice day !\r\n`)
            connection.end();
        } 
    });
}