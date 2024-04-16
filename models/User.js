const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
    "User", 
    new Schema({
        name: String,
        email: String,
        updateAt: Number,
        createdAt: Number,
        password: String
    })
   
)

module.exports = User;