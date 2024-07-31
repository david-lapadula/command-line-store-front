# Store Front SQL

## Table of contents
1. [Description](#description)
2. [Technology](#technology)
2. [Installation](#installation)
3. [Usage](#usage)

## Description


Command line application that simulates an inventory management system, allowing users to add, remove, and track items with ease. It features customer purchase functionality, manager capabilities for adding inventory and products, and supervisor access for viewing sales and department management.


## Technology

* [CLI Table](https://www.npmjs.com/package/cli-table) 
* [Inquirier](https://www.npmjs.com/package/inquirer)
* [MySQL server](https://dev.mysql.com/doc/refman/8.0/en/) 
* [MySQL workbench](https://dev.mysql.com/doc/workbench/en/) 
* [Node.js](https://nodejs.org/en/download/)

## Installation

1. Ensure you have Node, MySQL server, and MySQL workbench installed; links in the [Technology](#technology) section.
2. Open the `connection.js` file and add the connection values for your local MySQL server.
3. Clone the repository to your local machine. 

```bash
git clone https://github.com/DavidLapadula/StoreFrontSQL.git
cd storefrontsQL
```
4. Open a terminal in the root directory and run: 
```
npm install
```
5. Use the `schema.sql` and `seeds.sql` to populated the database. They can be modified if you wish.
6. Open a terminal in the root directory and run the file associated to the role you would like to perform. The options are: 
```
node bamazonCustomer.js
node bamazonManager.js
node bamazonSupervisor.js
```

## Usage

#### `Customer`: user can use item IDs to make purchases, prompts them to retry if the ID is incorrect, informs them if the order exceeds stock, and, if valid, processes the order, updates the database, and displays the order information.
***

![Customer 1](images/customer1.PNG)
![Customer 2](images/customer2.PNG)
  

#### `Manager`: user can perform various duties to check stock and change inventory, including viewing products for sale, viewing low inventory, adding to inventory, and adding new products.
***

###### View products for sale
***

![Manager view products](images/manager2.PNG)

###### View low inventory
***

![Manager view low qty](images/manager3.PNG)

###### Add to Inventory
***

![Manager add to inventory](images/manager4.PNG)

###### Add a new product
***

![Manager add product](images/manager5.PNG)


#### `Supervisor`: user can perform all the duties of a supervisor, including viewing product sales by department, creating new departments, and viewing the highest-grossing department.
***

![supervisor duties](images/supervisor1.PNG)

###### View sales by department
***

![supervisor view sales](images/supervisor2.PNG)

###### Create new department 
***

![supervisor create dept](images/supervisor3.PNG)

###### View Highest grossing department
***

![supervisor high grossing](images/supervisor4.PNG) 


