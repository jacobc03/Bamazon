//Installs Inquirer
var inquirer = require('inquirer');
//Installs MySQL
var mysql = require('mysql');
//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})
var answer1;
var answer2;
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);

})
connection.query('SELECT ItemID, ProductName, Price FROM Products', function(err, res) {
    if (err) throw err;
    console.log(res);
    firstQuestion();
})

var firstQuestion = function(){
	inquirer.prompt({
    	type: 'list',
    	name: 'id',
    	message: 'What is the ID of the product you would like to buy?',
    	choices:['25','26','27','28','29','30','31','32','33','34']
  	}).then(function(answer) {
        answer1=answer;
        console.log('Chosen ID', answer1);
        secondQuestion();
      })
}

var secondQuestion=function() {
	inquirer.prompt({
    	type:'input',
    	name:'units',
    	message:'How many units of the product would you like to buy?',
    	validate: function (value) {
      		if (value>0) {
        	return true;
      		}

      		return 'Please enter a valid number';
    	}
    }).then(function(answer) {  
        answer2=answer;
        console.log('Chosen Amount', answer2);
        	if (1== answer2) {
connection.query("UPDATE INTO Products SET ?", {
    StockQuantity: itemName
}, function(err, res) {});

}
      })
}

if (25== answer2) {
connection.query("UPDATE INTO Products SET ?", {
    StockQuantity: itemName
}, function(err, res) {});

}
/*
var checkInStock= function(){
	connection.query('UPDATE Products SET StockQuantity="1" WHERE ItemID="28', function(err, res) {

	}
}
*/
/*var updateStore= function(){
	connection.query('SELECT * FROM auctions', function(err, res) {
		StockQuantity:newQuantity,
	}

}
*/
