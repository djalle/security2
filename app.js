//jshint esversion:6

require('dotenv').config();
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

// This is level FOUR
const bcrypt = require("bcrypt");
const saltRounds = 3;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const MyUser = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    // Level FOUR
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

        const newUser = new MyUser ({
            email: req.body.username,
            password: hash
        });
    
        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets")
            }
        });
    });
});

app.post("/login", (req, res) => {

    const userName = req.body.username;
    const userPassword = md5(req.body.password);

    MyUser.findOne({email: userName}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === userPassword) {
                    res.render("secrets");
                }
            }
        }
    })
});


app.listen(3000, () => {
    console.log("Server 3000 OK");
});