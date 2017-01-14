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

//shows available  items with their ItemID, the Name of the item and Price of each item 
connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
    //console logs results
    console.log("ItemID: "+res[i].ItemID,"ProductName: "+res[i].ProductName,"Price: $"+res[i].Price, "#InStock: "+res[i].StockQuantity);
    };
    //runs the function that asks the first question
    firstQuestion();
})

//First question the user will be asked
var firstQuestion = function(){
	//prompts user with a list of IDs to pick from
	inquirer.prompt({
    	type: 'list',
    	name: 'id',
    	message: 'What is the ID of the product you would like to buy?',
    	choices:['25','26','27','28','29','30','31','32','33','34']
    //the answer containing the selected ID is passed into another function 
  	}).then(function(answer) {
  		//the answer it stored into a variable
        chosenID=answer.id;
        //console log chosenID to make sure answer was stored successfully
        console.log('Chosen ID#', chosenID);
        //runs the function that asks the second question
        //passes the chosenID var into the function to be used later
     	secondQuestion(chosenID);
      })
}
//Second Question the user will be asked	
var secondQuestion=function(chosenID) {
	//console log chosenID to make sure it was passed on successfully to this function
		//console.log(chosenID);
	//prompts user to input the amount they would like to purchase
	inquirer.prompt({
    	type:'input',
    	name:'units',
    	message:'How many units of the product would you like to buy?',
    	//validates a number greater than 0 was entered by the user
    	validate: function (value) {
      		if (value>0) {
        	return true;
      		}
      		//if the number enter isn't above 0 the user is asked to pick a valid number
      		return 'Please enter a valid number';
    	}
    //the answer containing the selected amount to be purchased is passed into another function
    }).then(function(answer) {
    	//the answer it stored into a variable  
        chosenAmount=answer.units;
        console.log('Chosen Amount', chosenAmount);
        //passes on both the chosenID and chosenAmount variables to be used in the next function
        checkInStock(chosenID, chosenAmount);
      })
}


var checkInStock= function(chosenID, chosenAmount){
	//console to check variables passed through successfully
	//console.log(chosenID,chosenAmount);
    connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
        if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if (res[i].ItemID==chosenID) {
                    if (res[i].StockQuantity >= chosenAmount) {
                        console.log("We have enough in stock");
                        //pass on chosenID and chosenAmount to confirmOrder Function
                        confirmOrder(chosenID,chosenAmount);
                     }else{
                    console.log("We don't have that amount in Stock");
                    console.log("Pick a new amount")
                    //Pass on only chosenID because the customer needs to pick a new amount
                    secondQuestion(chosenID);
                    }
                }
            }; 
        })
}
var confirmOrder = function(chosenID,chosenAmount){
    connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
        if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if (res[i].ItemID==chosenID) {
                    //created variable to hold value of new instock#
                    var newStock= res[i].StockQuantity - chosenAmount;
                    connection.query("UPDATE Products SET StockQuantity = ? WHERE ItemID = ?",[newStock,chosenID],function(err, res) {});
                    //created variable to hold total price value
                    var totalPrice = chosenAmount*res[i].Price;
                    console.log("You were charged: $"+totalPrice);
                }
            }
        }); 
}


    
    


