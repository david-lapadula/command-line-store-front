// Bring in the packages required for the app
let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');

// Connect to the database
let connection = require('./connection');

// Object used for the query 
let purchaseOrder = {};

// Connecton opens on page load and starts the first function
connection.connect(function (err) {
	if (err) throw err;
	displayProduct();
});

// Displays the items from the products table
function displayProduct() {
	console.log(`\r\nWelcome to Bamazon! Here are your items to choose from!\r\n`);
	connection.query('SELECT * FROM products', function (err, res) {
		// Table to display the current inventory of what is in the database
		table = new Table({
			head: ['Product ID', 'Product Name', 'Price', 'Department', 'Stock']
			, colWidths: [25, 25, 25, 25, 25]
		}); 
		for (let item in res) {
			table.push(
				[res[item].id, res[item].product_name, `$${res[item].price.toFixed(2)}`, res[item].department_name, res[item].stock_quantity]
			);
		}
		console.log(`\r\n${table.toString()}\r\n`);
		// Call the next function after the table is displayed
		purchaseRequest();
	});

}; 

// Function asks the user for their purchase request and then pushes the results into the 'purchases' object. 
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
						console.log(' Is an invalid query, please try again')
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
						console.log(' Is an invalid query, please try again')
						return false;
					}
				}
			}
		])
		.then(function (answer) {
			//update the purchase order object based on the user input and then process the request
			purchaseOrder.id = answer.productID;
			purchaseOrder.amount = answer.unitsPurchased;
			processRequest();
		});

};

// Function processes the request based on the object set by the results the user inputted from the first function
function processRequest() {
	connection.query(
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
				console.log(`\r\n--------------------------Details-----------------------`);
				console.log(`\r\n Purchase Item: ${res[0].product_name}`);
				console.log(`\r\n Amount Purchased: ${purchaseOrder.amount}`);
				console.log(`\r\n Purchase Price:  $${(saleRevenue).toFixed(2)}\r\n`);
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
					], function (err, res) {
						if (err) throw err; 
						newRequest();    
					});
			}
			
		}
	);

}
  
// New request function for when the operations are done. Recalls the display function if the customer so chooses
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
			displayProduct();
		} else {
			console.log(`\r\n Thankyou for shopping at Bamazon, and have a nice day!`)
			connection.end();
		}
	});
}