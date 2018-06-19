var cardModel=require("../models/Card");
var accountModel=require("../models/Account");

class Card
{
	constructor(c_number,c_pin,account)
	{
		this.c_number=c_number;
		this.c_pin=c_pin;
		this.account=account;
	}

	view()
	{
		console.log(this.c_number);
		console.log(this.c_pin);
		console.log(this.account);
	}

	getCardNumber()
	{
		return "Card Number:XXXXXXXXXXXX"+this.c_number[12]+this.c_number[13]+this.c_number[14]+this.c_number[15];
		console.log("Card Pin:",this.c_pin);
	}

	insertDB()
	{
		cardModel.create({
			c_number:this.c_number,
			c_pin:this.c_pin,
			acc_num:this.account
		},function(err,card)
		{
			if(err)
			{
				console.log("error!!");
			}
			else
			{
				accountModel.findOne({acc_num:card.acc_num},function(err,account)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						account.card.push(card._id);
						account.save();
					}
				});
			}
		});
	}

	validate(cb)
	{
		var q={
			c_number:this.c_number,
			c_pin:this.c_pin
		};
		console.log(q);
		var auth=null;
		cardModel.findOne(q,function(err,card)
		{
			console.log(card);
			if(err)
			{
				console.log(err.message);
			}
			else
			{
				if(card)
				{
					auth=true;
				}
				else
				{
					auth=false;
				}	
				cb(auth,card);
			}
			
			
		});

	}
};


module.exports=Card;