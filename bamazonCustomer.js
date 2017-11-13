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
	readTable();
})

function readTable(){
	connection.query('SELECT * FROM products', 
		function(err, rows) {
			if (err) throw err;
			console.table(rows);
			questions();
		}
	);
}



function questions(){
	console.log('Purchase:');
	console.log('-----------------------------------------------');
	inquirer.prompt([
		{
			name: 'id',
			type: 'input',
			message: "what is the ID of the product you'd like to purchase?"
		},
		{
			name: 'units',
			type: 'input',
			message: "how many units would you like to purchase?"
		}
	])
	.then(function(answers){
		let purchase = 'SELECT * FROM products WHERE ?';
		connection.query(purchase, { item_id: answers.id }, function(err, res) {
			// console.log(res);
			if (res[0].stock_quantity < answers.units) {	
				console.log('Sorry, there\'s not enough units.');
				connection.end();
			} else {
				console.log('-----------------------------------------------');
				console.log('\nYou\'re in luck we have enough units!');
				console.log('### Please pay $' + res[0].price * answers.units + ' ###');
				console.log('-----------------------------------------------\n');
				let update = 'UPDATE products SET ? WHERE ?';
				connection.query(update, [{ stock_quantity: res[0].stock_quantity - answers.units }, { item_id: answers.id }], function(err, res) {
				console.log('Updating stock...\n')
				setTimeout(readUpdatedTable, 2500);
				})
			}
		});
	});
}

function readUpdatedTable(){
	connection.query('SELECT * FROM products', 
		function(err, rows) {
			if (err) throw err;
			console.table(rows);
			connection.end();
		}
	);
}


