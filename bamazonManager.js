const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

let connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err){
	if(err) throw err;
	console.log('connected as id ' + connection.threadId + '\n');
	decision();
});

function decision() {
	inquirer.prompt({
		name: 'action',
		type: 'list',
		message: 'Make a selection:',
		choices: [
			'View Products for Sale',
			'View Low Inventory',
			'Add to Inventory',
			'Add New Product',
			'Exit'
		]
	})
	.then(function(answer){
		switch (answer.action){
			case 'View Products for Sale':
				sale();
				break;
			case 'View Low Inventory':
				lowInventory();
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addProduct();
				break;
			case 'Exit':
				connection.end();
		}
	});
}

function sale(){
	connection.query('SELECT * FROM products',
		function(err, res) {
			if(err) throw err;
			console.table('\n');
			console.table(res);
			decision();
		}
	);
}

function lowInventory(){
	connection.query('SELECT * FROM products WHERE stock_quantity < 5',
		function(err, res){
			if(err) throw err;
			console.log('\n');
			console.table(res);
			decision();
		}
	);
}

function addInventory(){
	connection.query('SELECT * FROM products',
		function(err, res) {
			if(err) throw err;
			console.log('\n');
			console.table(res);
	inquirer.prompt([
		{
			name: 'id',
			type: 'input',
			message: 'which item_id do you want to add inventory to?'	
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'how much more inventory do you want to add?'
		}
	])
	.then(function(answers){
			let increase = 'UPDATE products SET ? WHERE ?';
			// let increase = 'SELECT SUM(? + ?) FROM products WHERE ?';
			connection.query(increase, [{ stock_quantity: res[answers.id-1].stock_quantity + parseInt(answers.quantity) }, { item_id: answers.id	}], function(err, res){
				if (err) throw err;
				console.log('\n---- Quantity updated! ----\n');
				decision();
			});
		});
	});
}

function addProduct(){
	inquirer.prompt([
		{
			name: 'product',
			type: 'input',
			message: 'what is the name of the product?'
		},
		{
			name: 'department',
			type: 'input',
			message: 'what department does it below to?'
		},
		{
			name: 'price',
			type: 'input',
			message: 'what is the per unit price of the product?'
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'how many units are there?'
		}
	])
	.then(function(answers){
		let addition = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)';
		connection.query(addition, [
		answers.product,
		answers.department,
		answers.price,
		answers.quantity
		],
		function(err, res){
			if (err) throw err;
			console.log('\n---- New inventory added! ----\n');
			decision();
		});
	});
}

