// Packages required for the app
let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');
 
// Connect to the database
let connection = require('./connection');

connection.connect(function (err) {
    if (err) throw err;
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
                    //Recursively call function if there is a problem to ensure app does not fail in the case that the switch statement does not read properly
                    chooseOperation();
            }
        });
}

// Allows manager to see all the products and asks if he would like to perform another function
function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {
        // Table to display the current inventory of what is in the database
        table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Product Price', 'Stock']
            , colWidths: [25, 25, 25]
        }); 
        for (let item in res) {
            table.push(
                [res[item].id, res[item].product_name, res[item].department_name, `$${res[item].price.toFixed(2)}`, res[item].stock_quantity]
            );
        };
        console.log(`\r\n${table.toString()}\r\n`);
        newRequest();
    });

};

// Shows all inventory with a quantity less than 50 and asks if he would like to perform another function
function viewLowInventory() {  
    connection.query('SELECT * FROM products WHERE stock_quantity < 50', function (err, res) {
        if (err) throw err; 
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

        //Displays the table with the low quantity items
        console.log(`\r\n All items with a low inventory, or stock less than 50\r\n`)
        console.log(`\r\n${table.toString()}\r\n`);
        newRequest();
    });
};

// Allows the manager to add product to any of the currently listed products in product table
function addToInventory() {
    //empty array to be filled with all products
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
                            console.log(' Is an invalid input attempt')
                            return false;
                        }
                    }
                }
            ])
            .then(answers => {
                connection.query("UPDATE products SET stock_quantity = (stock_quantity + ?) WHERE product_name = ?;",
                    [answers.amountAdded, answers.productInc], function (err, res) {
                        if (err) throw err;
                        console.log(`\r\n --------------Addition--------------`)
                        console.log(`\n Product Increased: ${answers.productInc}`)
                        console.log(`\n Amount Added: ${answers.amountAdded}\r\n`)
                        newRequest();
                    });
            });
    });
};
 
// Function to allow the manager to add a new product. Ensure s/he is adding it to a department that exists and is not adding a product that is already in the table
function addNewProduct() {
    //Array to be filled with all the departments. 
    let choicesArray = [];
    connection.query(
        "SELECT departments.department_name AS Departments FROM departments;",
        function (err, res) {
            if (err) throw err;
            for (department in res) {
                choicesArray.push(res[department].Departments)
            }
        }
    );

    inquirer
        .prompt([ 
             {
                name: "productAdded",
                type: "input", 
                message: "What product would you like to add?",
                validate: function (value) {
                    if (value.length > 0 && value.match(/[^\s]+/i) && isNaN(value) === true) {
                        return true;
                    } else {
                        console.log(' Is an invalid attempt')
                        return false;
                    }
                }
            }, {
                name: "departmentAdded",
                type: "list",
                message: 'Which department would you like to add the product to?',
                //use a list here to prevent the supervisor manager from entering a department that does not exist
                choices: choicesArray,
            }, {
                name: "itemPrice",
                type: "input",
                message: "How much does the new item cost?",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    } else {
                        console.log(' Is an invalid attempt')
                        return false;
                    }
                }
            }, {
                name: "itemAmount",
                type: "input",
                message: "What is the incoming quantity of the new item?",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    } else {
                        console.log(' Is an invalid attempt')
                        return false;
                    }
                }
            } 
        ])
        .then(answers => {
            connection.query("SELECT EXISTS (SELECT product_name from products WHERE product_name = ?) AS Products",
                [answers.productAdded], function (err, res) {
                    if (err) throw err;
                    if (res[0].Products === 0) {
                        connection.query(
                            "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                            [
                                answers.productAdded.toLowerCase(),
                                answers.departmentAdded.toLowerCase(),
                                answers.itemPrice,
                                answers.itemAmount,

                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log(`\n------------------Successfully added --------------`);
                                console.log(`\n Product: ${answers.productAdded}`);
                                console.log(`\r\n Department: ${answers.departmentAdded}`);
                                console.log(`\r\n Quantity: ${answers.itemAmount}\r\n`); 
                                newRequest();
                            }
                        );
                    } else {
                        console.log(`\r\n The Product you would like to add already exists, please try again`);
                        newRequest();
                    }

                });
        });
};

// use function to prevent repeating requests to choose another operation
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


