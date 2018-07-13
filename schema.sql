DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT NOT NULL, 
  stock_quantity INT, 
  PRIMARY KEY (id)
);