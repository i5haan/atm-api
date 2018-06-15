var operatorModel=require("../models/Operator");

class Operator
{
	constructor(id,pin)
	{
		this.id=id;
		this.pin=pin;
	}

	insertDB()
	{
		operatorModel.create({
			id:this.id,
			pin:this.pin
		})
	}

	validate(cb)
	{
		var auth=null;
		operatorModel.findOne({
			id:this.id,
			pin:this.pin
		},function(err,operator)
		{
			if(err)
			{

			}
			else
			{
				if(operator)
				{
					auth=true;
				}
				else
				{
					auth=false;
				}
				cb(auth);
			}
		});
	}
}

module.exports=Operator;