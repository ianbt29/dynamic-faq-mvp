import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Handle the /api/ask endpoint
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  const pageContext = "Here’s a sample context about the webpage.";

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `You are a helpful FAQ assistant. Only use the page context: ${pageContext}` },
      { role: "user", content: question }
    ]
  });

  res.json({ answer: completion.choices[0].message.content });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));

