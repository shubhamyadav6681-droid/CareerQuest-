import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleMentorChat, handleReverseEngineer, handleGenerateQuiz } from './server/geminiApi';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API Endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, profile, roadmapContext, granularContext } = req.body;
    const result = await handleMentorChat(messages, profile, roadmapContext, granularContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.post('/api/reverse-engineer', async (req, res) => {
  try {
    const { targetCompany, targetRole, jobDescription, profile } = req.body;
    const result = await handleReverseEngineer(targetCompany, targetRole, jobDescription, profile);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { topicTitle, userLevel } = req.body;
    const result = await handleGenerateQuiz(topicTitle, userLevel || 'Beginner');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`CareerQuest AI server running on port ${port}`);
});
