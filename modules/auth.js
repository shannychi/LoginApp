const express = require("express");
const auth = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();



//REgister a new user

auth.get("/register", (req, res) => {
    res.render("Register.ejs")
    })
    
    auth.post("/register", async (req, res) => {
    const hashedPassword =  await bcrypt.hash(req.body.password, 10)
       try{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            updateAt: req.body.updateAt,
            createdAt: req.body.createdAt,
            password: hashedPassword
        });
        await user.save();
        res.status(200).redirect("/login")
       } catch(err) {
        res.status(400).send(err.message)
       }
    })

    //Login

    auth.get("/login", (req, res) => {
        res.render("login.ejs");
    })

    auth.post("/login",  async (req, res) => {
        
        try{
            const {email, password} = req.body;
            console.log('Email:', email);
            console.log( password);
            const user = await User.findOne({email: { $regex: new RegExp("^" + email.toLowerCase(), "i") }});
            console.log( user)
            if(!user) {
                throw new Error ('user not found');
            }
            const isUser = await bcrypt.compare(password, user.password);
            console.log(isUser)
            if(!isUser) {
                throw new Error('incorrect password');
            }
           const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
           res.set('Authorization', `Bearer ${token}`).redirect("/post");
        } catch(error) {
            res.status(401).send(error.message);
        }
    })


    auth.get("/log-out", (req, res, next) => {
        res.clearCookie(process.env.JWT_SECRET).redirect("/")
      });

module.exports =  auth;
  