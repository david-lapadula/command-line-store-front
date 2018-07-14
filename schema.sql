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

SELECT D.department_id, D.department_name, D.over_head_costs, P.product_sales,
(P.product_sales - over_head_costs) AS total_profit
FROM departments D
LEFT JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name) P
ON P.department_name = D.department_name; 