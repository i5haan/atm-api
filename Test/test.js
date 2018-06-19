var request=require("request");
for(var i=0;i<10000;i++)
{
	if(i%10==0)
	{
		request.post("http://localhost:3000/user/withdraw",{form:{c_number:"5674937490203746",c_pin:"0000",amt:"1000000000000000000000000000000000000"}},function(e,r,b)
		{
			if(e || r.statusCode!=200)
			{
				console.log("Error");
			}
			else
			{
				console.log(b);
			}
		});
	}
	
}