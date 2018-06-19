var express=require("express");
var router=express.Router({mergeParams:true});
var sem=require("semaphore")(1);
var middleware=require("../middleware");

var Card=require("../src/Card");
var Account=require("../src/Account");
var Transaction=require("../src/Transaction");
var Atm=require("../src/Atm");
var Operator=require("../src/Operator");

var CardSchema=require("../models/Card");
var accountScehma=require("../models/Account");
var transactionSchema=require("../models/Transaction");
var atmSchema=require("../models/Atm");
var operatorScehma=require("../models/Operator");


router.post("/validate",function(req,res)
	{
		var tOp=new Operator(req.body.id,req.body.pin);
		tOp.validate(function(auth)
			{
				if(!req.body.id || !req.body.pin)
				{
					var ret={
						status:"F",
						message:"One or more of the Fields is missing"
					}
					res.send(JSON.stringify(ret));
				}
				else if(auth==null)
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
							message:"Invalid Credentials"
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

router.post("/balance",function(req,res)
	{
		var tOp=new Operator(req.body.id,req.body.pin);
		tOp.validate(function(auth)
			{
				if(!req.body.id || !req.body.pin)
				{
					var ret={
						status:"F",
						message:"One or more of the Fields is missing"
					}
					res.send(JSON.stringify(ret));
				}
				else if(auth==null)
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
							message:"Invalid Credentials"
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

router.post("/deposit",function(req,res)
	{
		sem.take(function(){
			var amt=Number(req.body.amt);
			console.log(amt);
			var tOp=new Operator(req.body.id,req.body.pin);
			tOp.validate(function(auth)
				{
					if(!req.body.id || !req.body.pin)
					{
						var ret={
							status:"F",
							message:"One or more of the Fields is missing"
						}
						res.send(JSON.stringify(ret));
					}
					else if(!middleware.amtValidator(req.body.amt))
					{
						var ret={
							status:"F",
							message:"Invalid Amount"
						};
						sem.leave();
						res.send(JSON.stringify(ret));
					}
					else if(auth==null)
					{
						var ret={
							status:"F",
							message:"Database Error! Please try after Some time"
						}
						sem.leave();
						res.send(JSON.stringify(ret));
					}
					else
					{
						if(auth==false)
						{
							var ret={
								status:"F",
								message:"Invalid Credentials"
							}
							sem.leave();
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
									sem.leave();
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
									sem.leave();
									res.send(JSON.stringify(ret));
								}

							});

						}
					}
					
				});
		});
	});

module.exports=router;