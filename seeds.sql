-- starter data

/* Schema for SQL database/table. We haven't discussed this type of file yet */
-- DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) NOT NULL, 
  stock_quantity INT, 
  PRIMARY KEY (id)
);

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (1, 'Undershirt', 'Clothing', 10, 50), 
(2, '1984', 'Books', 25, 150), 
(3, 'Toothbursh', 'Hygiene', 5, 50), 
(4, 'Lord of the Rings', 'Books', 10, 50), 
(5, 'Socks', 'Clothing', 2.50, 500), 
(6, 'Deodorant', 'Hygiene', 8.50, 125), 
(7, 'Tuna', 'Food', 2.50, 1000), 
(8, 'Shampoo', 'Hygiene', 7.50, 250), 
(9, 'Fruit Loops', 'Food', 5, 1500), 
(10, 'Harry Potter', 'Books', 25, 250);  

ALTER TABLE products
ADD product_sales DECIMAL(8,2);

ALTER TABLE products
DROP COLUMN product_sales;

SELECT DISTINCT department_name FROM products; 

	CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INT,
  PRIMARY KEY (department_id)
);

SELECT * FROM departments; 

SELECT * FROM products; 

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Clothing', 5000),  
('Books', 2500),  
('Hyigene', 7000),  
('Food', 1000),  
('Cookware', 10000);    

SELECT D.department_id, D.department_name, D.over_head_costs, P.product_sales,
(P.product_sales - over_head_costs) AS total_profit
FROM departments D
LEFT JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name) P
ON P.department_name = D.department_name; 
  