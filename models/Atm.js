var mongoose=require("mongoose")

var atmSchema=new mongoose.Schema(
	{
		balance:{type:Number,min:[0,"Cash Indespensible!"]}
	});

module.exports=mongoose.model("Atm",atmSchema);