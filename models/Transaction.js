var mongoose=require("mongoose");

var transactionSchema=new mongoose.Schema({
	type:String,
	amt:Number,
	date:{type: Date, default: Date.now()},
	acc_num:String
},
{usePushEach:true});


module.exports=mongoose.model("Transaction",transactionSchema);