var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/atm-api-test");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var Card=require("./src/Card");
var Account=require("./src/Account");
var Transaction=require("./src/Transaction");
var Atm=require("./src/Atm");
var Operator=require("./src/Operator");

var CardSchema=require("./models/Card");
var accountScehma=require("./models/Account");
var transactionSchema=require("./models/Transaction");
var atmSchema=require("./models/Atm");
var operatorSchema=require("./models/Operator");

var newAccount=new Account("7323847690","Ishan Khanna","Savings",10000000);
var newCard=new Card("1234123412341234","0000",newAccount.acc_num);
// var newTransaction=new Transaction("withdraw",2000,newAccount.acc_num);
var newAtm=new Atm(200000000);
var newOperator=new Operator("i5haan",9803);

// newAccount.insertDB();
newCard.insertDB();
// // newTransaction.insertDB();
// newAtm.insertDB();
// newOperator.insertDB();

var userRoutes=require("./routes/user");
var operatorRoutes=require("./routes/operator");

app.use("/user",userRoutes);
app.use("/operator",operatorRoutes);

app.get("/",function(req,res)
	{
		res.render("index");
	});
app.get("*",function(req,res)
{
	res.statuscode=404;
	res.send("Resource Not Found!");
});

app.post("*",function(req,res)
{
	res.statuscode=404;
	res.send("Resource Not Found!");
});



app.listen(3000,function()
	{
		console.log("ATM Server Started!!");
	});