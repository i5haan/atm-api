var transactionModel=require("../models/Transaction");

class Transaction
{
	constructor(type,amount,account)
	{
		this.type=type;
		this.amount=amount;
		this.account=account;
	}
	insertDB(cb)
	{
		transactionModel.create({
			type:this.type,
			amt:this.amount,
			acc_num:this.account
		},function(err,transaction)
		{
			if(err)
			{
				console.log("Error:)");
			}
			else
			{
				console.log(transaction);
				
			}
			cb(transaction);
		});
	}
}

module.exports=Transaction;