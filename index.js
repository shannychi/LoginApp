const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");
const session = require("express-session");
const authRoutes = require("./modules/auth")
require('dotenv').config();
const Blog = require("./modules/post")
const userPost = require("./modules/userPost")


const mogoDb = process.env.MONGODB_URL

mongoose.connect(mogoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.urlencoded({ extended: false }));

app.set("views engine", "ejs");


app.get("/", (req, res) => {
    
    res.render("home.ejs");
})

app.use("/", authRoutes);
 app.use("/", Blog);

// app.get("/dash", (req, res) => {
//     res.render("dashboard.ejs")
// })

app.use("/", userPost);

app.listen(8000, () => {
    console.log("app runing on port 800")
})