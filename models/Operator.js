var mongoose=require("mongoose");

var operatorSchema=new mongoose.Schema({
	id:{type:String, index:{unique:true}},
	pin:String
});

module.exports=mongoose.model("Operator",operatorSchema);