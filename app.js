    //jshint esversion:6
    require('dotenv').config();
    const express = require("express");
    const bodyPArser = require("body-parser");
    const ejs = require("ejs");
    const mongoose = require("mongoose");
    const encrypt = require("mongoose-encryption");

    const app = express();
    console.log(process.env.API_KEY)

    app.use(express.static("public"));
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({
         extended: true 
        }));

    mongoose.connect("mongodb+srv://lawrencevincent453:cVbLsJTI54vacfQ7@cluster0.0ldculs.mongodb.net/userDB?retryWrites=true&w=majority")
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", async function(req, res){
    res.render("home");
});

app.get("/login", async function(req, res){
    res.render("login");
});

app.get("/register", async function(req, res){
    res.render("register");
});

app.post("/register", async function(req, res){
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        await newUser.save();
        res.render("secrets");
    } catch(error) { 
        console.error(error);
        res.status(500).send("Error registering user");
    }
});

    app.post("/login", async function(req, res) {
        const { username, password } = req.body;
    
        try {
            const foundUser = await User.findOne({ email: username });
            if (foundUser) {
                const isPasswordCorrect = (foundUser.password === password);
                if (isPasswordCorrect) {
                    res.render("secrets");
                } 
            } 
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).send("Error logging in");
        }
    });
    
    


    app.listen(3000, function(){
        console.log("sever is running at port 3000.");
    })