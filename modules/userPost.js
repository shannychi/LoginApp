const express = require("express");
const userPost = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User")
const blogPost = require("../models/blogPost")
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticat")
const jwt = require("jsonwebtoken");
require('dotenv').config();


userPost.get("/post",  async (req, res) => {
    try {
        const post = await blogPost.find().populate('title');
        res.render("post.ejs", {post});
        res.status(200);
    }
    catch(error) {
        console. error('Error fetchomg:', error);
        res.status(500).send('An error occured while fetching post')
    }
})

userPost.get("/post/search", async (req, res) => {
 try {
    const blogTitle = req.query.title;
    const matchPost = await blogPost.find({title: {$regex: blogTitle, $options: 'i'}});
    res.render("search.ejs", {matchPost});
    res.status(200)
 }
 catch (err) {
    console.log('error search for post:', err);
    res.send(500).json({error: 'an error occoured while searching'})
 }

})

module.exports = userPost;