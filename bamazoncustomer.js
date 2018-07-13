let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');
let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'bamazon',
});

// Object used for the query 
let purchaseOrder = {};

connection.connect(function (err) {
	if (err) throw err;
	displayProduct();
});

function displayProduct() {
	console.log(`\r\nWelcome to Bamazon! Here are your items to choose from!\r\n`);
	
	connection.query('SELECT id, product_name, price FROM products', function (err, res) {

		// Table to display the current inventory of what is in the database
		table = new Table({
			head: ['Product ID', 'Product Name', 'Price']
			, colWidths: [25, 25, 25]
		});

		for (let item in res) {
			table.push(
				[res[item].id, res[item].product_name, `$${res[item].price.toFixed(2)}`]
			);
		}

		console.log(table.toString());

		purchaseRequest();
	});

}; 
 
function purchaseRequest() {
 
	inquirer
		.prompt([
			{
				name: "productID",
				type: "input",
				message: "Please select the ID of the product you want to order",
				validate: function (value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					} else {
						console.log('Invalid Query')
						return false;
					}
				}
			},
			{
				name: "unitsPurchased",
				type: "input",
				message: "How many would you like?",
				validate: function (value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					} else {
						console.log('Invalid Query')
						return false;
					}
				}
			}
		])
		.then(function (answer) {
			//update the purchase order object based on the user input
			purchaseOrder.id = answer.productID;
			purchaseOrder.amount = answer.unitsPurchased;
			processRequest();
		});

};

function processRequest() {
	let query = connection.query(
		"SELECT * FROM products WHERE ?",
		{
			id: purchaseOrder.id
		}, 
		function (err, res) {
			if (err) throw err;
			// if the result is empty then the order id is incorrect and cannot be found. Call purchase request function again.
			if (!res.length) {
				console.log(`\r\n That id does not exist, please try again\r\n`);
				purchaseRequest();
			// If the amount exceeds the inventory, user must choose another quantity. Call purchase request function again.
			} else if (res[0].stock_quantity < purchaseOrder.amount) {
				console.log(`\r\n We are too low on quantity to fill your request please try another amount \r\n`);
				purchaseRequest();
			} else {
			// Purchase can be processed, inform the user of the amount and update the database
				let newQuantity = res[0].stock_quantity - purchaseOrder.amount;
				let saleRevenue = res[0].price * purchaseOrder.amount;
				let totalRevenue = res[0].product_sales + saleRevenue;
				console.log(`\r\n Your purchase of ${res[0].product_name} is $${(saleRevenue).toFixed(2)}\r\n`); 
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: newQuantity, 
							product_sales: totalRevenue
						},
						{
							id: purchaseOrder.id
						}
					],
					function (err, res) {
						if (err) throw err;
						console.log(`\r\n Thankyou for placing your order!\r\n`);
						// recall the function to display the table if the user wants to place another order. End the connection otherwise
						inquirer.prompt([
							{
								type: 'confirm',
								name: 'newOrder',
								message: 'Do you want to place another order?',
								default: true
							},
						]).then(response => {
							if (response.newOrder) {
								displayProduct(); 
							} else {
								console.log(`\r\n Thankyou for shopping at Bamazon, and have a nice day!\r\n`)
								connection.end(); 
							}
						});
					}
				);
			} 
		}
	);
}