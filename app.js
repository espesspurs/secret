//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));


const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret ,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save()
    .then((err)=>{
        if(err){
                res.render("secrets");
        }else{
            console.log(err);
        }
    });
});


app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")  
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then((foundUser,err)=>{
        if(foundUser){
            if(foundUser.password=== password){
                res.render("secrets");
            }
        }else{
            console.log(err);
        }
    })
    
});










app.listen(3000,()=>{
    console.log("Server is running on port 3000.")
})







