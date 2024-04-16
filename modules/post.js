const express = require("express");
const blog = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User")
const blogPost = require("../models/blogPost")
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticat")
const jwt = require("jsonwebtoken");
require('dotenv').config();


blog.get("/blogs", (req, res) => {
    res.render("blogPost.ejs")
})

//craete a post
blog.post("/blogs",  async(req, res) => {
    try {
        const {title, subtitle, body} = req.body;
        const createdAt = new Date();

        const post = new blogPost({
            title,
            subtitle,
            body,
            createdAt
        });
        await post.save();
        const token = jwt.sign({userId: post.id}, process.env.JWT_SECRET);
        res.set('Authorization', `Bearer ${token}`).redirect("/post");
    } catch (err) {
        console.error('Error creating psot:', err);
        res.status(400).json({err: 'An error occurred'})
    }
})

//edit post
blog.get("/blogs/edit/:id", async(req, res) => {
    try {
        const id = req.params.id
        const post = await blogPost.findById(id);
        const { title, subtitle, body } = post; 
        const token = jwt.sign({userId: post.id}, process.env.JWT_SECRET);
        const updatedAt = new Date;
        // if(!post || post.userId !== token){
        //     return res.status(404).json({error: 'you are not authorized'} )
        // }
        
        res.set('Authorization', `Bearer ${token}`).render("editPost.ejs", {
            title: title,
            subtitle: subtitle,
            body: body,
            updatedAt,
            id: id
        })
    }catch( err) {
      console.log(err, "error cannot edit")

    }
   

})

blog.post("/blogs/update/:id", async(req, res) => {
    try {
        const id = req.params.id

    await blogPost.findByIdAndUpdate(id, {
        title: req.body.title,
        subtitle: req.body.subtitle,
        body: req.body.body
    });
    res.status(200).redirect("/post")
    }
    catch(err) {
        console.log("error updating post", err);
       res.status(404).json({error: "An error occurred while updating"})
    }
})

//delete post
blog.get("/blogs/delete/:id", async(req, res) => {
    try {
        const id = req.params.id
        
        const token = jwt.sign({userId: id}, process.env.JWT_SECRET);
        // if(!post || post.userId !== token){
        //     return res.status(404).json({error: 'you are not authorized'} )
        // }
        await blogPost.findByIdAndDelete(id)
        res.set('Authorization', `Bearer ${token}`).redirect("/post")
        console.log("game deleted successful" + id);

    }catch(error) {
        console.log("error deleteing post", err);
        res.status(500).json({error: "An error occurred while deleting post"})
    }
})

module.exports = blog;