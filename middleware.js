var pinValidator=function(pin)
{
	//NaN check
	if(isNaN(Number(pin)))
	{
		return false;
	}
	if(pin[0]=="-" || pin[0]=="+")
	{
		return false;
	}
	//length Check
	if(pin.length!=4)
	{
		return false;
	}

	if(pin==undefined || pin==null)
	{
		return false;
	}

	return true;
}

var amtValidator=function(amt)
{
	if(isNaN(Number(amt)))
	{
		return false;
	}

	if(Number(amt)<=0)
	{
		return false;
	}

	return true;
}

module.exports={
	pinValidator:pinValidator,
	amtValidator:amtValidator
}