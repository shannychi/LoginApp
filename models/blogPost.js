const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogPost = mongoose.model(
    "blogPost", 
    new Schema({
        title: String,
        subtitle: String,
        body: String,
        createdAt: Date,
        updatedAt: Date
    })
   
)

module.exports = blogPost;