const mongoose=require('mongoose');

//this is the schema which will store direct messages
const directMessages=new mongoose.Schema({
    type:{
        type:String,
        enum:['text','photo','video'],
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
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        
       
    },

    time:{
        type:Date,
        default:Date.now
    }    
});
module.exports=mongoose.model('directMessages',directMessages);