const express = require('express');
const fetchuser = require('../middleware/middleware');
const router = express.Router();
const NodeCache = require('node-cache');
const myCache = new NodeCache();
require('dotenv').config()

// Import Gemini (Generative AI) client
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API); // Set your API key in environment variable

const model = "gemini-2.5-flash"; // Or another Gemini model

router.post('/analyse', fetchuser, async (req, res) => {
    console.log("Request received");
    const { content } = req.body;
    try {
        const cachedResult = myCache.get(content);
        if (cachedResult) {
            console.log("req returned")
            return res.json(cachedResult);
        }

        // Prepare prompt
        const prompt = `Analyze this code also give malicious status if it contains malicious code (give proper headings and paragraph spaces and hr lines) also rate the code out of 10 on multiple factors:\n${content}`;

        // Call Gemini
        const geminiModel = genAI.getGenerativeModel({ model });
        const result = await geminiModel.generateContent(prompt);

        const geminiResponse = result?.response?.text() || 'No response from Gemini';

        console.log(geminiResponse);
        myCache.set(content, geminiResponse);
        return res.json(geminiResponse);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router
