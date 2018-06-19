var express=require("express");
var router=express.Router({mergeParams:true});
var sem=require("semaphore")(1);
var middleware=require("../middleware");


var Card=require("../src/Card");
var Account=require("../src/Account");
var Transaction=require("../src/Transaction");
var Atm=require("../src/Atm");
var CardSchema=require("../models/Card");
var accountScehma=require("../models/Account");
var transactionSchema=require("../models/Transaction");
var atmSchema=require("../models/Atm");


router.post("/validate",function(req,res,next)
{
	var tCard=new Card(req.body.c_number,req.body.c_pin);
	tCard.validate(function(auth,card)
		{
			console.log(auth);
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
						message:"Invalid Credentials"
					};
					res.send(JSON.stringify(ret));
				}
			}
		});
});


router.post("/account",function(req,res)
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
							message:"Invalid Credentials"
						};
						res.send(JSON.stringify(ret));
					}
				}
			});
	});



router.post("/withdraw",function(req,res)
{
	sem.take(function()
	{
		var amt=Number(req.body.amt);
		console.log(amt);
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
					sem.leave();
					res.send(JSON.stringify(ret));
				}
				else
				{
					if(auth==true)
					{
						console.log("reached auth");
						accountScehma.findOne({acc_num:card.acc_num},function(err,account)
								{
									if(err)
									{
										console.log("Error!!");
										var ret={
											status:"F",
											message:"Databse access error"
										};
										sem.leave();
										res.send(JSON.stringify(ret));
									}
									else
									{
										console.log(amt);
										if(!middleware.amtValidator(req.body.amt))
										{
											var ret={
														status:"F",
														message:"Invalid Amount"
													};
													sem.leave();
													res.send(JSON.stringify(ret));
										}
										else if(amt>=account.balance)
										{
											var ret={
												status:"F",
												message:"Insuffcient Balance!!"
											};
											sem.leave();
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
													sem.leave();
													res.send(JSON.stringify(ret));
												}
												else
												{
													if(amt>atm.balance)
													{
														console.log("Error");
														var ret={
															status:"F",
															message:"ATM unable To dispense Cash!!"
														};
														sem.leave();
														res.send(JSON.stringify(ret));
													}
													else
													{
														newTransaction.insertDB(function(t)
														{
															console.log("Pushed!!!")
															account.transaction.push(t._id);
															account.balance=account.balance-amt;
															atm.balance=atm.balance+-amt;
															atm.save();
															account.save();
															var ret={
																status:"S",
																balance:account.balance
															}
															sem.leave();
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
							message:"Invalid Credentials!"
						};
						sem.leave();
						res.send(JSON.stringify(ret));
					}
				}
			});
		});
	
});



router.post("/deposit",function(req,res)
{
	sem.take(function()
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
					sem.leave();
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
										sem.leave();
										res.send(JSON.stringify(ret));
									}
									else
									{
										if(!middleware.amtValidator(req.body.amt))
										{
											var ret={
														status:"F",
														message:"Invalid Amount"
													};
													sem.leave();
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
													sem.leave();
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
														sem.leave();
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
							message:"Invalid Credentials"
						};
						sem.leave();
						res.send(JSON.stringify(ret));
					}
				}
			});
		});
});

router.post("/changepin",function(req,res)
	{
		var newPin=req.body.npin;
		// console.log(newPin);
		var tCard=new Card(req.body.c_number,req.body.c_pin);
		tCard.validate(function(auth,card)
			{
				console.log(card);
				if(!middleware.pinValidator(newPin))
				{
					var ret={
						status:"F",
						message:"Invalid Pin"
					};
					res.send(JSON.stringify(ret));
				}
				else if(auth==null)
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
							message:"Invalid Credentials"
						};
						res.send(JSON.stringify(ret));
					}
				}
			});
	});


router.post("/statement",function(req,res)
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
						transactionSchema.find({acc_num:card.acc_num},{_id:0}).sort({date:-1}).exec(function(err,transaction)
							{
								console.log(transaction);
								var ret={
									status:"S",
									transaction:transaction.slice(0,5)
								};
								// console.log(typeof(transaction[0].date));
								res.send(JSON.stringify(ret));
							});
					}
					else
					{
						var ret={
							status:"F",
							message:"Invalid Credentials"
						};
						res.send(JSON.stringify(ret));
					}
				}
			});
	});


module.exports=router;