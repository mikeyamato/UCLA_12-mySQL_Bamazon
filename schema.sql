CREATE database bamazon;

USE bamazon; 

CREATE TABLE products (
	item_id INT NOT NULL,
	product_name VARCHAR(100) NULL,
	department_name VARCHAR(100) NULL,
	price DECIMAL(10,2) NULL,  -- 4 total numbers, decimal starts two from the last
	stock_quantity INT NULL,
	PRIMARY KEY (item_id)
);

