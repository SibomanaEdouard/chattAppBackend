const Users=require("../models/users");
const getData=async(req,res)=>{
    const {user}=req.body;
    try{
const data=await Users.findById(user);
if(data){
    res.status(200).json(data);
}else{
    res.status(400).json({error:"Please check connection and try again"});;
}
}catch(error){
console.log(error);
res.status(500).json({error:"Sorry, something went wrong. Please try again latter"});
}
}
module.exports=getData;