const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const blog = require('../modules/post'); 
const blogPost = require('../models/blogPost');

describe('Blog routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Create a post', async () => {
        const response = await request(express())
            .post('/blogs')
            .send({ title: 'Test Post', subtitle: 'Test Subtitle', body: 'Lorem ipsum dolor sit amet' });

        expect(response.status).toBe(400); 
    });

    test('Edit a post', async () => {
        // Create a test blog post
        const testPost = new blogPost({
            title: 'Test Post',
            subtitle: 'Test Subtitle',
            body: 'Lorem ipsum dolor sit amet'
        });
        await testPost.save();

        const response = await request(express())
            .get(`/blogs/edit/${testPost._id}`);

        expect(response.status).toBe(200); 
       
    });

    test('Delete a post', async () => {
        // Create a test blog post
        const testPost = new blogPost({
            title: 'Test Post',
            subtitle: 'Test Subtitle',
            body: 'Lorem ipsum dolor sit amet'
        });
        await testPost.save();

        const response = await request(express())
            .get(`/blogs/delete/${testPost._id}`);

        expect(response.status).toBe(500); 
    });
});
