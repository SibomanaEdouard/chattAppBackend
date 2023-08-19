const Users=require("../models/users");
const directMessages=require("../models/directMessages");

//this is the logic to send the message from one person to another
const sendMessages=async(req,res)=>{

    const {sender,receiver,content}=req.body;
    try{
        //let me check if  sender is found in the system
const findSender=await Users.findById(sender);
if(findSender){
    const findReceiver=Users.findById(receiver);
    if(findReceiver){
//the logic to store  the message in the database
const storeMessage=new directMessages({
   content,
   sender,
   receiver 
})
 const isMessageStored=await storeMessage.save();
if(isMessageStored){
res.status(200).json({message:"The message sent sucessfully"});
}else{
res.status(400).json({error:"Failed to send message please check connection and try again"});
}
    }else{
  res.status(404).json({error:"The receiver is not found  in the system"});
    }
}else{
    res.status(404).json({error:"The sender is not found "})
}

    }catch(error){
console.log(error);
    }
}

module.exports=sendMessages;