var mongoose=require("mongoose");

var accountSchema=new mongoose.Schema({
	acc_num:{type:String,index:{unique:true}},
	name:String,
	type:String,
	card:[{
	        type:mongoose.Schema.Types.ObjectId,
	       	ref:"Card"
	}],
	transaction:[{
	        type:mongoose.Schema.Types.ObjectId,
	       	ref:"Transaction"
	}],
	balance:Number
},
{usePushEach:true});


module.exports=mongoose.model("Account",accountSchema);