-- Set up the database and tables for the app

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(8, 2) NOT NULL, 
  stock_quantity INT NOT NULL, 
  product_sales DECIMAL(10, 2) NOT NULL, 
  PRIMARY KEY (id)  
);

	CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INT NOT NULL,
  PRIMARY KEY (department_id)
);  