var mongoose=require("mongoose");

var cardSchema=new mongoose.Schema({
	c_number:{type:String,index:{unique:true}},
	c_pin:Number,
	acc_num:String
});


module.exports=mongoose.model("Card",cardSchema);