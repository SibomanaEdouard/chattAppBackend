
const mongoose=require('mongoose');


//this is the schema which will store the messages
const Messages=new mongoose.Schema({
    type:{
        type:String,
        enum:['text','photo','video'],
        // required:true
    },
    content:{
        type:String,
        required:true
    }, 
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        
       
    },
    time:{
        type:Date,
        default:Date.now
    }     
});
module.exports=mongoose.model('Messages',Messages,'messages')