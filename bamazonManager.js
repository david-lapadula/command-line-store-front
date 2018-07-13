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
    chooseOperation();
});


function chooseOperation() {
    console.log(`\r\nHello Bamazon Manager!\r\n`)
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'managerChoice',
                message: 'Which operation would you like to perform?',
                choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add new product']
            }
        ])
        .then(answers => {
            switch (answers.managerChoice) {
                case 'View products for sale':
                    viewProducts();
                    break;
                case 'View low inventory':
                    viewLowInventory();
                    break;
                case 'Add to inventory':
                    addToInventory();
                    break;
                case 'Add new product':
                    addNewProduct();
                    break;
                default:
                    console.log(`\r\n Sorry there has been an error \r\n`);
                    chooseOperation();
            }
        });
}

function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {

        // Table to display the current inventory of what is in the database
        table = new Table({
            head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock']
            , colWidths: [25, 25, 25]
        });

        for (let item in res) {
            table.push(
                [res[item].id, res[item].product_name, res[item].department_name, `$${res[item].price.toFixed(2)}`, res[item].stock_quantity]
            );
        };

        console.log(`${table.toString()}\r\n`);

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'newRequest',
                message: 'Do you want to make another request?',
                default: true
            },
        ]).then(response => {
            if (response.newRequest) {
                chooseOperation()
            } else {
                console.log(`\r\n Have a nice day !\r\n`)
                connection.end();
            }
        });
    });

};

function viewLowInventory() {
    let lowInvQuery = 'SELECT * FROM products WHERE stock_quantity < 50';
    connection.query(lowInvQuery, function (err, res) {

        // Table to display the current inventory of what is in the database
        table = new Table({
            head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock']
            , colWidths: [25, 25, 25]
        });

        for (let item in res) {
            table.push(
                [res[item].id, res[item].product_name, res[item].department_name, `$${res[item].price.toFixed(2)}`, res[item].stock_quantity]
            );
        }

        console.log(`${table.toString()}\r\n`);

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'newRequest',
                message: 'Do you want to make another request?',
                default: true
            },
        ]).then(response => {
            if (response.newRequest) {
                chooseOperation()
            } else {
                console.log(`\r\n Have a nice day !\r\n`)
                connection.end();
            }
        });
    });
};


function addToInventory() {
    let products = []
    connection.query("SELECT product_name FROM products", function (err, res) {
        if (err) throw err;
        res.forEach((element) => {
            products.push(element.product_name);
        });
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'productInc',
                    message: 'Which product would you like to stock to?',
                    choices: products
                }, {
                    name: "amountAdded",
                    type: "input",
                    message: "How many would you like to add?",
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        } else {
                            console.log('Invalid attempt')
                            return false;
                        }
                    }
                }
            ])
            .then(answers => {
                connection.query("UPDATE Products SET stock_quantity = (stock_quantity + ?) WHERE product_name = ?;",
                    [answers.amountAdded, answers.productInc], function (err, res) {
                        if (err) throw err;
                        console.log(`\r\n Thankyou for updating the data\r\n`)
                    });
            });

    });
};

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "productAdded",
                type: "input",
                message: "What product would you like to add?",
                validate: function (value) {
                    if (value.length > 0 && value.match(/[^\s]+/i)) {
                        return true;
                    } else {
                        console.log('Invalid attempt')
                        return false;
                    }
                }
            }, {
                name: "departmentAdded",
                type: "input",
                message: "What department does this item belong to?",
                validate: function (value) {
                    if (value.length > 0 && value.match(/[^\s]+/i)) {
                        return true;
                    } else {
                        console.log('Invalid attempt')
                        return false;
                    }
                }
            }, {
                name: "itemPrice",
                type: "input",
                message: "How much does the new item cost?",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    } else {
                        console.log('Invalid attempt')
                        return false;
                    }  
                }
            }, {
                name: "itemAmount",
                type: "input",
                message: "How much quantity of the new item is there?",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    } else {
                        console.log('Invalid attempt')
                        return false;
                    }
                }
            }
        ])
        .then(answers => {
            connection.query(
                "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                [
                  answers.productAdded, 
                  answers.departmentAdded, 
                  answers.itemPrice, 
                  answers.itemAmount, 

                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(`\r\n Product Added\r\n`);
                    // recall the function to display the table if the user wants to place another order. End the connection otherwise
                }
            );
        });  
};

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
            chooseOperation()
        } else {
            console.log(`\r\n Have a nice day !\r\n`)
            connection.end();
        }
    });
}