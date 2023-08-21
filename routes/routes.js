const express=require('express');
const bcrypt=require("bcrypt");
const Routed=express.Router();
const Users=require('../models/users');
const Messages=require("../models/messages");
const Friends=require("../models/Friends");
const multer=require('multer');
const getData=require("../Controllers/dataController");
const updateInfo=require("../Controllers/updateInfo");
const sendMessages=require("../Controllers/directMessagecontrollers");
const ReceivedMessages=require("../Controllers/getDirectMessages").ReceiverMessages;
const SentMessages=require("../Controllers/getDirectMessages").SentMessages;

// //this is to insert the user in database
Routed.post('/', async (req, res) => {
  const saltRound = 10;
  const { firstname, lastname, email, phone, password } = req.body;
  try {
    const checkingAvail = await Users.findOne({ email });
    const checkingPhone = await Users.findOne({ phone });
    if (!checkingAvail || !checkingPhone) {
      console.log("The user " + lastname + " was created!");
      const salt = await bcrypt.genSalt(saltRound);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUsers = new Users({
        firstname,
        lastname,
        email,
        phone,
        password: hashedPassword,
      });
      await newUsers.save();
      res.status(201).json({ message: "The data was saved successfully" });
    } else {
      const error =
        "The email or phone number you entered is already found in the system. Please change phone or email and try again!";
      res.status(400).json({ error });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "The email or phone number you entered is already found in the system. Please change phone or email and try again!" });
  }
});

//To validate the user
Routed.post('/login',async(req,res)=>{
const {email,password}=req.body;

try{
const findUser= await Users.findOne({email});
if(findUser){
const storedPassword=findUser.password;

//compare the stored password and entered password;
  const comparePasswords=await bcrypt.compare(password,storedPassword);
  if(comparePasswords){
    console.log(findUser._id)
    const result={
      id:findUser._id,
      lastname:findUser.lastname,
      imageUrl:findUser.imageUrl
    }
    res.status(200).json(result);
  } 
  else{
    res.status(400).json({error:"Invalid email or password ! Please check and try again!"})
 
  }

}
else{
  res.status(404).json({error:"Invalid email or password ! Please check and try again!"});

}
//this is to catch errors from the backend
}catch(error){ 
  console.log(error);
  res.status(400).json({error:" Sorry something went wrong. Please try again later "});

}

})


//to update password
Routed.put('/', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Check if the user exists in the database
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid email");
    }

    // Compare the passwords
    if (password !== confirmPassword) {
      return res.status(400).json("The passwords do not match");
    }

    // Update the password in the database
    const newPassword =await bcrypt.hash(password,10);
    const result = await Users.updateOne(
      { email: email },
      { $set: { password: newPassword } }
    );
    
      if(result){
      return res.send({message:"Password updated successfully"});
    } else {
      return res.status(400).json("Failed to update password");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong, please try again later!");
  }
});

//this is to save the message in the database
Routed.post('/posts',async(req,res)=>{

try{

  const {content,sender,type}=req.body;
  const confirmUser=await Users.findById(sender);
  if(!confirmUser){
    res.status(404).json({error:"You are not found in our system"});
  } 
const Newmessage=await new Messages({
  content,
  sender,
  type
})

//this is to save message to database
if(!Newmessage.content){
 return res.status(400).json({error:"Please Insert the message before send."})
  
}else{
const saveUser=await Newmessage.save();
if(saveUser){

  res.status(200).json(saveUser.content)
 }else{
 
 
   res.status(400).json({error:"Failed to send the message. Please try again later"})
 }
}

}catch(error){
  console.log(error);
  res.status(400).json({error:"Sorry something went wrong! Please Try again later"});
  
}
})

// Define the route to retrieve posts from the backend to the frontend
Routed.get('/posts', async (req, res) => {

  try {
    const allPosts = await Messages.find();
    if (allPosts.length <= 0) {
      res.status(404).json("No posts found on this place!");
    } else {
      const senderId = allPosts.map(posts => posts.sender);
      const usernames = await Promise.all(senderId.map(async (userId) => {
        const user = await Users.findById(userId).select('lastname');
        return user ? user.lastname : "unknown";
      }));

      const userImages = await Promise.all(senderId.map(async (userId) => {
        const userI = await Users.findById(userId).select('imageUrl');
        return userI ? userI.imageUrl : "";
      }));

      // Combine the name from users with the messages and userImages
      const MessageWithOwner = allPosts.map((post, index) => {
        const sender = usernames[index];
        const userImage = userImages[index];
        const content = post.content;

        // Get hours and minutes from the time
        const hours = post.time ? post.time.getHours() : 0;
        const minutes = post.time ? post.time.getMinutes() : 0;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return {
          sender: sender,
          userImage: userImage, 
          content: content,
          time: formattedTime,
        };
      });

      res.status(200).json({ MessageWithOwner });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Sorry, something went wrong! Please try again later." });
  }
});


//this is for recommandations
Routed.get('/recommends',async(req,res)=>{
try{
  const users= await Users.find();
  if(users){

  res.status(200).json(users);
  }
  else{
    res.status(404).json({error:"No person is found on this page"});
  
  }
}catch(error){
  console.log("Sorry something went wrong!");
  res.status(400).json({error:"Sorry something went wrong"});
}
})

//this is for selecting friends freinds;
Routed.post('/addFriend',async(req,res)=>{
  try{
const {sender,receiver}=req.body;

//let me check if the sender is in database;
const senderCheck=await Users.findById({_id:sender});
if(senderCheck!=null){
const receiverCheck=await Users.findById({_id:receiver});
if(receiverCheck!=null){

  //let me check if you are not already friends
  const findFriend=await Friends.findOne({sender,receiver});
  if(findFriend){
    res.status(201).json(`you are friend with ${receiverCheck.lastname}`);
  }
  else{
    const newFriend= await new Friends({
      sender,
      receiver
    });
  await newFriend.save();
  res.status(200).json(`${receiverCheck.lastname} was added successfully to your friends`);

  }
}else{
  res.status(404).json("This person is not found on the system")
}
}else{
  res.status(404).json({"error":"The user is not exist in the system!"});
}
  }catch(error){
    console.log(error);
    res.status(400).json({"error":"something went wrong plaese try again later"});
  }

})

//This is function 
Routed.post("/friends", async (req, res) => {
  try {
    const { sender } = req.body;

    const myFriends = await Friends.find({ sender }).select('receiver');
    if (myFriends.length > 0) {
      console.log("You have some friends");

      const receiverIds = myFriends.map(friend => friend.receiver); // Get an array of receiver ids

      const friendInfo = await Users.find({ _id: { $in: receiverIds } }); // Find all users with matching receiver ids

      if (friendInfo.length > 0) {
        res.status(200).json(friendInfo);
      } else {
        console.log("No information found for any friend");
        res.status(404).json({error:"There is no information about this friend"});
      }
    } else {

      console.log("You don't have any friends");
      res.status(404).json({error:'There are no friends in your account'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});


//this is to delete the friend from your list
Routed.delete('/deleteFriend',async(req,res)=>{
  try{
    const {sender,receiver}=req.body;

  
    const deleteFriend=await Friends.findOneAndDelete({sender,receiver});
    if(deleteFriend){
    
      res.status(200).json({message:"The   friend was deleted successfully"});
    }else{
      res.status(400).json({"error":"There was error in deleting the friend!"});
  }
  }catch(error){
    console.log(error);
    res.status(400).json({"error":"There was error in deleting friend please try again latter!"});
  }
})



// //this is to update the image
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

Routed.put('/updateImage', upload.single('image'), async (req, res) => {

  // Routed.put('/updateImage', async (req, res) => {
  const { userId } = req.body;
  console.log(req.body)

  try {
    // Find the user to update the image
    const user = await Users.findById(userId);
    
    if (user != null) {
      const file = req.file;
     
      const imageUrl = file.filename;
      
      // Update the user's image URL
      const updateImage = await Users.findByIdAndUpdate(userId,{imageUrl})
      console.log(updateImage)
      res.status(200).json({imageUrl });
    } else {
      res.status(404).json({ error: 'The user is not found in our system' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went Wrong. Please try again later' });
  }
});


//this is the route to retrive image from the uploads folder
Routed.use('/uploads',express.static('uploads'));

//this is the route to get the data
Routed.post("/datum",getData);
Routed.put("/updateinfo",updateInfo);
//this is the route to send  message 
Routed.post("/sendirectmessage",sendMessages);
//this is the route to get received messages
Routed.post("/receivedmessages",ReceivedMessages);
Routed.post("/sentmessages",SentMessages);
module.exports = Routed;
