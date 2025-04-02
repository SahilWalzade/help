require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY; // Fetch from GitHub Secrets

app.post('/generate', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                }),
            }
        );

        const data = await response.json();
        res.json({ reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch response" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
