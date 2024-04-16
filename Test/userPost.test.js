const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userPost = require('../modules/userPost'); // Import your userPost router
const blogPost = require('../models/blogPost'); // Import your blogPost model

describe('User Post routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Get all posts', async () => {
        const response = await request(express())
            .get('/post');

        expect(response.status).toBe(200);
       
    });

    test('Search posts by title', async () => {
        // Create a test blog post
        const testPost = new blogPost({
            title: 'Test Post',
            content: 'Lorem ipsum dolor sit amet'
        });
        await testPost.save();

        const response = await request(express())
            .get('/post/search')
            .query({ title: 'Test' });

        expect(response.status).toBe(200); 
    });
});
