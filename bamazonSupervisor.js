let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');
let connection = mysql.createConnection({
    host: '127.0.0.1',
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
    connection.query(
        `SELECT D.department_id, D.department_name, D.over_head_costs, P.product_sales,
        (P.product_sales - over_head_costs) AS total_profit
        FROM departments D
        LEFT JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name) P
        ON P.department_name = D.department_name`,
        function (err, res) {
            if (err) throw err;
            console.log(res);
            // recall the function to display the table if the user wants to place another order. End the connection otherwise
            let keys = Object.keys(res[0]);
            console.log(keys)
            // Table to display the current inventory of what is in the database
            table = new Table({
                head: [keys[0], keys[1], keys[2], keys[3], keys[4]]
                , colWidths: [25, 25, 25]
            });

            for (let item in res) {
                table.push(
                    [res[item].department_id, res[item].department_name, res[item].over_head_costs, res[item].product_sales, res[item].total_profit]
                );
            }

            console.log(table.toString());
            //     newRequest();  
        }
    );

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
                "SELECT EXISTS (SELECT * FROM departments WHERE ?) AS department",
                {
                    department_name: answers.departmentAdded
                },
                function (err, res) {
                    if (err) throw err;
                    if(res[0].department === 1) {
                        console.log('That Department already exists! Try again'); 
                        newRequest(); 
                    } else {
                        connection.query(
                            "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
                            [
                                answers.departmentAdded,
                                answers.newDeptOH,
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log(`\r\n Department Added\r\n`);
                                newRequest(); 
                            }
                        );

                    }
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
