//Installs Inquirer
var inquirer = require('inquirer');
//Installs MySQL
var mysql = require('mysql');
//connects to my Bamazon MySQL Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})

//Successful connection is shown through console log
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);

})

var directions= function(){
	inquirer.prompt({
  type: 'list',
  name: 'menu',
  message: 'What would you like to do?',
  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products']
}).then(function(answers){
		if (answers.menu ==='View Products for Sale') {
			
connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
    //	Products.push(res[i].ItemID,res[i].ProductName,res[i].Price, res[i].StockQuantity);
    console.log("ItemID: "+res[i].ItemID,"ProductName: "+res[i].ProductName,"Price: $"+res[i].Price, "#InStock: "+res[i].StockQuantity);
    };
   
})






		} else if (answers.menu ==='View Low Inventory') {
console.log('low');
		} else if (answers.menu ==='Add to Inventory') {
			console.log('more');
		}else if (answers.menu ==='Add New Products') {
			console.log('new');
		}
	})
}
directions();

