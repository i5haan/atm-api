var accountModel=require("../models/Account");

class Account
{
	constructor(acc_num, name, type,balance)
	{
		this.acc_num=acc_num;
		this.name=name;
		this.type=type;
		this.balance=balance;
	}

	view()
	{
		console.log(this.acc_num);
		console.log(this.name);
		console.log(this.type);
		console.log(this.balance);
	}

	insertDB()
	{
		accountModel.create({
			acc_num:this.acc_num,
			name:this.name,
			type:this.type,
			balance:this.balance
		});
	}
}

module.exports=Account