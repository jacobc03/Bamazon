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
//created a function to take input from prompts and update mysql when ran
var newItem =function(){
	connection.query("INSERT INTO Products SET ?", {
    		ProductName: itemName,
    		DepartmentName: DepartName,
    		Price: Price,
    		StockQuantity:InStock
			}, function(err, res) {});
	}
var updateInv= function(){
	connection.query("UPDATE Products SET StockQuantity = ? WHERE ItemID = ?",[InStock,chosenID],function(err, res) {});
	console.log("Inventory has been updated");
}

var directions= function(){
	inquirer.prompt({
  		type: 'list',
  		name: 'menu',
  		message: 'What would you like to do?',
  		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products']
	}).then(function(answers){
		if (answers.menu ==='View Products for Sale') {	
			//lists out all products
			connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
    			if (err) throw err;
    			for (var i = 0; i < res.length; i++) {  	
    				console.log("ItemID: "+res[i].ItemID,"ProductName: "+res[i].ProductName,"Price: $"+res[i].Price, "#InStock: "+res[i].StockQuantity);
    			};  
			})
		//runs directions again
		directions();
		} else if (answers.menu ==='View Low Inventory') {
			//list out all products with an invetory count lower than 5
			connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(err, res) {
    			if (err) throw err;
    			for (var i = 0; i < res.length; i++) { 
    				if (res[i].StockQuantity< 5) { 	
    				console.log("ItemID: "+res[i].ItemID,"ProductName: "+res[i].ProductName,"Price: $"+res[i].Price, "#InStock: "+res[i].StockQuantity);
    				}
    			};  
			})
		//runs directions again
		directions();
		} else if (answers.menu ==='Add to Inventory') {
			inquirer.prompt({
		    	type: 'list',
		    	name: 'id',
		    	message: 'Select the ItemID you would like to add invetory to?',
		    	choices:['25','26','27','28','29','30','31','32','33','34']
		    //the answer containing the selected ID is passed into another function 
		  	}).then(function(answer) {
		  		//the answer it stored into a variable
		        chosenID=answer.id;
		        //console.log('Chosen ID#', chosenID);
		        inquirer.prompt({
							type:'input',
							name:'newStock',
							message:'What is the new InStock#?',
							validate: function (value) {
      							if (value>0) {
        							return true;
      							}
      							//if the number enter isn't above 0 the user is asked to pick a valid number
      							return 'Please enter a valid number';
    						}
								    //the answer containing the name of the department is passed into another function
						}).then(function(answer) {
							//the answer it stored into a variable  
							InStock=answer.newStock;
							//console.log('#InStock:', InStock);		
					       	//Runs function to update Inventory
					       	updateInv();
							//runs directions again
							directions();
						})
		     	
		    })
		}else if (answers.menu ==='Add New Products') {
			//Prompt Mananger to enter in Product Name
			inquirer.prompt({
		    	type:'input',
		    	name:'itemName',
		    	message:'What is the name of the Product?',
    		//the answer containing the name of the product is passed into another function
    		}).then(function(answer) {
    			//the answer it stored into a variable  
        		itemName=answer.itemName;
       			// console.log('ProductName', itemName);
       			//Prompt Manager to enter in Department name
		        inquirer.prompt({
			    	type:'input',
			    	name:'department',
			    	message:'What is the name of the Department the Product is in?',	    	
		    	//the answer containing the name of the department is passed into another function
		    	}).then(function(answer) {
			    	//the answer it stored into a variable  
			        DepartName=answer.department;
			       // console.log('DepartName', DepartName);
					inquirer.prompt({
						type:'input',
						name:'price',
						message:'What is the Price of the new item?',
						//Validate input is a number greater than 0
						validate: function (value) {
      						if (value>0) {
        						return true;
      						}
      						//if the number enter isn't above 0 the user is asked to pick a valid number
      						return 'Please enter a valid number';
    					}
					//the answer containing the name of the department is passed into another function
					}).then(function(answer) {
						//the answer it stored into a variable  
						Price=answer.price;
						//console.log('Price: $', Price);
						inquirer.prompt({
							type:'input',
							name:'stock',
							message:'How many of the new item are in stock?',
							validate: function (value) {
      							if (value>0) {
        							return true;
      							}
      							//if the number enter isn't above 0 the user is asked to pick a valid number
      							return 'Please enter a valid number';
    						}
								    //the answer containing the name of the department is passed into another function
						}).then(function(answer) {
							//the answer it stored into a variable  
							InStock=answer.stock;
							// console.log('#InStock:', InStock);
							//Runs function that update mysql
							newItem();
							//runs directions again
							directions();
						})
					})
		    	})
     		})
		}
	})
}

directions();


