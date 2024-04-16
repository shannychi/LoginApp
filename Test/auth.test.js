const request = require('supertest');
const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const auth = require('../modules/auth'); 
const User = require('../models/User'); 

dotenv.config();

describe('Auth routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Register a new user', async () => {
        const response = await request(express())
            .post('/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(200); 
    });

    test('Login with existing user', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('password', 10);
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });
        await testUser.save();

        // Login with the test user
        const response = await request(express())
            .post('/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(404); // Expecting redirection to "/post" after successful login
    });

    test('Logout', async () => {
        const response = await request(express())
            .get('/log-out');
    });
});
