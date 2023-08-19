const mongoose=require('mongoose');
const usersSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:false,
    },
    work:{
        type:String,
        required:false,
        default:"unemployed"
    },
    school:{
        type:String,
        required:false,
        default:"Not student"
    },
    home:{
        type:String,
        required:false,
        default:"Burera"
    },
    hobby:{
        type:String,
        required:false,
        default:"playing piano"
    },
    link:{
        type:String,
        required:false,
        default:"I don't use intagram"
    },


})
module.exports=mongoose.model('User',usersSchema,'users');