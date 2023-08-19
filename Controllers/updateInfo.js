const Users=require("../models/users");
const updateInfo=async(req,res)=>{
    const {user,work,school,home,hobby,link,phone}=req.body;
    try{
const updateUser=await Users.findByIdAndUpdate(user,{$set:{work:work,
    school:school,
    home:home,
hobby:hobby,
link:link,
phone:phone
}});
if(updateUser){
    res.status(200).json({message:"Your info was updated successfully"});
}else{
    res.status(400).json({error:"Failed to update your info , check connection and try again!"});
}
    }catch(error){
console.log(error);
res.status(500).json({error:"sorry something went wrong please try again!"});
    }
}
module.exports=updateInfo;