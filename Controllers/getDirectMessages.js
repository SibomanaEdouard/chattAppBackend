const directMessages=require("../models/directMessages");

//this is the logic to get the received messages
const ReceiverMessages=async(req,res)=>{
    const {receiver,sender}=req.body;
try{
const isMessages=await directMessages.find({receiver,sender});
if(isMessages.length>0){

// res.status(200).json(isMessages);
    
const messagesWithTime = isMessages.map(message => {
    return {
      ...message.toObject(),
    time:formatTime(message.time) // Format time here
    };
  });

  res.status(200).json(messagesWithTime);

}else{
    res.status(404).json({error:"There is no conversation with this person! Please start conversation"});
}
}catch(error){
console.log(error);
res.status(500).json({error:"something went wrong"});
    }
} 

  
//this is the logic to get sent messages
const SentMessages=async(req,res)=>{
    const {sender,receiver}=req.body;
try{
const isMessages=await directMessages.find({sender,receiver});
if(isMessages.length>0){
const messagesWithTime = isMessages.map(message => {
    return {
      ...message.toObject(),
      time:formatTime(message.time) // Format time here
    };
  });

  res.status(200).json(messagesWithTime);
}else{
    res.status(404).json({error:"There is no conversation with this person! Please start conversation"});
}
}catch(error){
    console.log(error);
    res.status(500).json({error:"something went wrong"});
    }
} 

// Helper function to format time (hours and minutes)
const formatTime = (time) => {
    const formattedTime = new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    return formattedTime;
  };

module.exports={
    ReceiverMessages,
    SentMessages
}
