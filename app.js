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

// var newAccount=new Account("7323847690","Ishan Khanna","Savings",10000000);
// var newCard=new Card("5674937490203746",4476,newAccount.acc_num);
// var newTransaction=new Transaction("withdraw",2000,newAccount.acc_num);
// var newAtm=new Atm(200000000);
// var newOperator=new Operator("i5haan",9803);

// newAccount.insertDB();
// newCard.insertDB();
// newTransaction.insertDB();
// newAtm.insertDB();
// newOperator.insertDB();


//#################################################USER ROUTES START#############################################
app.post("/user/validate",function(req,res,next)
{
	var tCard=new Card(req.body.c_number,req.body.c_pin);
	tCard.validate(function(auth,card)
		{
			console.log(card);
			if(auth==null)
			{
				var ret={
					status:"F",
					message:"Databse access error"
				};
				res.send(JSON.stringify(ret));
			}
			else
			{
				if(auth==true)
				{
					var ret={
						status:"S"
					};
					res.send(JSON.stringify(ret));
				}
				else
				{
					var ret={
						status:"F",
						message:"Not Found"
					};
					res.send(JSON.stringify(ret));
				}
			}
		});
});

app.post("/user/account",function(req,res)
	{
		var tCard=new Card(req.body.c_number,req.body.c_pin,"9876");
		console.log(tCard);
		tCard.validate(function(auth,card)
			{
				console.log(card);
				if(auth==null)
				{
					var ret={
						status:"F",
						message:"Databse access error"
					};
					res.send(JSON.stringify(ret));	
				}
				else
				{
					if(auth==true)
					{
						accountScehma.findOne({acc_num:card.acc_num},{name:1,type:1,_id:0,acc_num:1,balance:1,card:1},function(err,account)
							{
								console.log(account);
								res.send(JSON.stringify(account));
							});
					}
					else
					{
						var ret={
							status:"F",
							message:"Not Found"
						};
						res.send(JSON.stringify(ret));
					}
				}
			});
	});



app.post("/user/withdraw",function(req,res)
{
	var amt=Number(req.body.amt);
	var tCard=new Card(req.body.c_number,req.body.c_pin);
	tCard.validate(function(auth,card)
		{
			console.log(card);
			if(auth==null)
			{
				var ret={
					status:"F",
					message:"Databse access error"
				};
				res.send(JSON.stringify(ret));
			}
			else
			{
				if(auth==true)
				{
					accountScehma.findOne({acc_num:card.acc_num},function(err,account)
							{
								if(err)
								{
									console.log("Error!!");
									var ret={
										status:"F",
										message:"Databse access error"
									};
									res.send(JSON.stringify(ret));
								}
								else
								{
									if(amt==0)
									{
										var ret={
													status:"F",
													message:"Invalid Transaction"
												};
												res.send(JSON.stringify(ret));
									}
									else if(amt>=account.balance)
									{
										var ret={
											status:"F",
											message:"Insuffcient Balance!!"
										};
										res.send(JSON.stringify(ret));
									}
									else
									{
										var newTransaction=new Transaction("W",amt,account.acc_num);
										atmSchema.findOne({},function(err,atm){
											if(err)
											{
												console.log("Error");
												var ret={
													status:"F",
													message:"Databse access error"
												};
												res.send(JSON.stringify(ret));
											}
											else
											{
												if(amt>atm.balance)
												{
													console.log("Error");
													var ret={
														status:"F",
														message:"Unable To dispense Cash!!"
													};
													res.send(JSON.stringify(ret));
												}
												else
												{
													newTransaction.insertDB(function(t)
													{
														console.log("Pushed!!!")
														account.transaction.push(t._id);
														account.balance=account.balance-amt;
														atm.balance=atm.balance-amt;
														atm.save();
														account.save();
														var ret={
															status:"S",
															balance:account.balance
														}
														res.send(JSON.stringify(ret));
													});
												}
												
											}
											
										});
										
										
										

									}
									
								}
								
							});
				}
				else
				{
					var ret={
						status:"F",
						message:"Not Found"
					};
					res.send(JSON.stringify(ret));
				}
			}
		});
});



app.post("/user/deposit",function(req,res)
{
	var amt=Number(req.body.amt);
	var tCard=new Card(req.body.c_number,req.body.c_pin);
	tCard.validate(function(auth,card)
		{
			console.log(card);
			if(auth==null)
			{
				var ret={
					status:"F",
					message:"Databse access error"
				};
				res.send(JSON.stringify(ret));
			}
			else
			{
				if(auth==true)
				{
					accountScehma.findOne({acc_num:card.acc_num},function(err,account)
							{
								if(err)
								{
									console.log("Error!!");
								}
								else
								{
									if(amt==0)
									{
										var ret={
													status:"F",
													message:"Invalid Transaction"
												};
												res.send(JSON.stringify(ret));
									}
									else
									{
										var newTransaction=new Transaction("D",amt,account.acc_num);
										atmSchema.findOne({},function(err,atm){
											if(err)
											{
												console.log("Error");
												var ret={
													status:"F",
													message:"Databse access error"
												};
												res.send(JSON.stringify(ret));
											}
											else
											{
												newTransaction.insertDB(function(t)
												{
													console.log("Pushed!!!")
													account.transaction.push(t._id);
													account.balance=account.balance+amt;
													atm.balance=atm.balance+amt;
													atm.save();
													account.save();
													var ret={
														status:"S",
														balance:account.balance
													}
													res.send(JSON.stringify(ret));
												});
												
											}
											
										});
										
										

									}
									
								}
								
							});
				}
				else
				{
					var ret={
						status:"F",
						message:"Not Found"
					};
					res.send(JSON.stringify(ret));
				}
			}
		});
});

app.post("/user/changepin",function(req,res)
	{
		var newPin=Number(req.body.npin);
		// console.log(newPin);
		var tCard=new Card(req.body.c_number,req.body.c_pin);
		tCard.validate(function(auth,card)
			{
				console.log(card);
				if(auth==null)
				{
					var ret={
						status:"F",
						message:"Databse access error"
					};
					res.send(JSON.stringify(ret));
				}
				else
				{
					if(auth==true)
					{
						CardSchema.findByIdAndUpdate(card._id,{
							c_number:card.c_number,
							c_pin:newPin,
							acc_num:card.acc_num
						},function(err,c)
						{
							if(err)
							{
								console.log(err);
							}
							else
							{
								var ret={
									status:"S"
								};
								res.send(JSON.stringify(ret));
							}
						});
					}
					else
					{
						var ret={
							status:"F",
							message:"Not Found"
						};
						res.send(JSON.stringify(ret));
					}
				}
			});
	});

//#########################################################USER ROUTES END############################################################


//#######################################################OPerator Routes Start########################################################

app.post("/operator/validate",function(req,res)
	{
		var tOp=new Operator(req.body.id,req.body.pin);
		tOp.validate(function(auth)
			{
				if(auth==null)
				{''
					var ret={
						status:"F",
						message:"Database Error! Please try after Some time"
					}
					res.send(JSON.stringify(ret));
				}
				else
				{
					if(auth==false)
					{
						var ret={
							status:"F",
							message:"Not Found!!"
						}
						res.send(JSON.stringify(ret));
					}
					else
					{
						var ret={
							status:"S"
						}
						res.send(JSON.stringify(ret));
					}
				}
				
			});
	});

app.post("/operator/balance",function(req,res)
	{
		var tOp=new Operator(req.body.id,req.body.pin);
		tOp.validate(function(auth)
			{
				if(auth==null)
				{
					var ret={
						status:"F",
						message:"Database Error! Please try after Some time"
					}
					res.send(JSON.stringify(ret));
				}
				else
				{
					if(auth==false)
					{
						var ret={
							status:"F",
							message:"Not Found!!"
						}
						res.send(JSON.stringify(ret));
					}
					else
					{
						atmSchema.findOne({},function(err,atm)
						{
							if(err)
							{
								var ret={
									status:"F",
									message:"Database Error! Please try after Some time"
								}
								res.send(JSON.stringify(ret));
							}
							else
							{
								var ret={
									status:"S",
									balance:atm.balance
								}
								res.send(JSON.stringify(ret));
							}

						});

					}
				}
				
			});
	});

app.post("/operator/deposit",function(req,res)
	{
		var amt=Number(req.body.amt);
		console.log(amt);
		var tOp=new Operator(req.body.id,req.body.pin);
		tOp.validate(function(auth)
			{
				if(auth==null)
				{
					var ret={
						status:"F",
						message:"Database Error! Please try after Some time"
					}
					res.send(JSON.stringify(ret));
				}
				else
				{
					if(auth==false)
					{
						var ret={
							status:"F",
							message:"Not Found!!"
						}
						res.send(JSON.stringify(ret));
					}
					else
					{
						atmSchema.findOne({},function(err,atm)
						{
							if(err)
							{
								var ret={
									status:"F",
									message:"Database Error! Please try after Some time"
								}
								res.send(JSON.stringify(ret));
							}
							else
							{

								atm.balance=atm.balance+amt;
								atm.save();
								var ret={
									status:"S",
									balance:atm.balance
								}
								res.send(JSON.stringify(ret));
							}

						});

					}
				}
				
			});
	});






//#######################################################Operator Routes End #########################################################

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