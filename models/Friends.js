const mongoose=require('mongoose');
//this is the schema which will store the messages
const Friends=new mongoose.Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        
       
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        // unique:true,
    },
    time:{
        type:Date,
        default:Date.now
    }    
});
module.exports=mongoose.model('Friends',Friends,'friends')