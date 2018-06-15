var atmModel=require("../models/Atm");

class Atm
{
	constructor(balance)
	{
		this.balance=balance;
	}

	insertDB()
	{
		atmModel.create({balance:this.balance});
	}
}

module.exports=Atm;