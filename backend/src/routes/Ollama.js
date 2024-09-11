const express = require('express');
const fetchuser = require('../middleware/middleware');
const router = express.Router();
const { Ollama } = require('ollama');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

router.post('/analyse', fetchuser, async (req, res) => {
    console.log("Request received");
    const { content } = req.body;
    try {
        const ollama = new Ollama({ device: 'cuda' });
        const cachedResult = myCache.get(content);
        if (cachedResult) {
            console.log("req returned")
            return res.json(cachedResult);
        }

        const response = await ollama.chat({
            model: 'RepoGeek',
            messages: [{ role: 'user', content: 'Analyze this code also give mailcious status if it contains malicious code (give proper headings and paragraph spaces and hr lines) also rate the code out of 10 on multiple factors:\n ' + content }],
        });

        console.log(response.message.content);
        myCache.set(content, response.message.content);
        return res.json(response.message.content);
    } catch (error) {
        console.error('Error:', error);
    }
})


module.exports = router