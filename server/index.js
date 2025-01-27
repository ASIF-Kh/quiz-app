require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/generate-quiz', async (req, res) => {
    try {
        const { topic } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

        const prompt = `Generate a quiz with 5 multiple-choice questions about ${topic}. 
      Format the response as JSON with this structure: 
      {
        "quiz": [
          {
            "question": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "option1"
          }
        ]
      }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response and parse JSON
        const jsonString = text.replace(/```json|```/g, '');
        const quizData = JSON.parse(jsonString);

        res.json(quizData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});