const mongoose=require("mongoose");

const EmplSchema=new mongoose.Schema(
    {
        firstName:{type:String,required:true,trim:true},
        lastName:{type:String,required:true,trim:true},
        department:{type:String,required:true,trim:true},
        startDate:{type:Date,required:true},
        jobTitle:{type:String,required:true,trim:true},
        salary:{type:Number,required:true,min:15}
    },
    {timestamps:true}
);
module.exports=mongoose.model("Empl", EmplSchema);