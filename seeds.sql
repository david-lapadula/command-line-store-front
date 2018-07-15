-- Everything needed to get started with the app

INSERT INTO departments (department_name, over_head_costs)
VALUES ('clothing', 5000),  
('books', 2500),  
('electronics', 7000),  
('food', 1000),  
('tools', 10000);    


INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (1, 'jeans', 'clothing', 20, 50), 
(2, '1984', 'books', 25, 150), 
(3, 'computer', 'electronics', 150, 50), 
(4, 'cereal', 'food', 5, 500), 
(5, 'hammer', 'tools', 10, 200), 
(6, 'shirt', 'clothing', 8.50, 125), 
(7, 'hamlet', 'books', 2.50, 1000), 
(8, 'television', 'electronics', 750, 100), 
(9, 'tuna', 'food', 5, 1500), 
(10, 'screwdriver', 'tools', 25, 250);  
  