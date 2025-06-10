import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] })); // Allow specific origins
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../../dist'))); // Serve frontend build

// In-memory storage (use a database in production)
const competitions = new Map();
const submissions = new Map();
const results = new Map();

// API Routes
app.post('/api/create-comp', (req, res) => {
  try {
    const { subject, timeLimit, constraints, language } = req.body;
    console.log('Received create-comp request:', { subject, timeLimit, constraints, language });

    // Validate inputs
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({ error: 'Subject must be a non-empty string' });
    }
    if (!timeLimit || typeof timeLimit !== 'number' || timeLimit <= 0) {
      return res.status(400).json({ error: 'Time limit must be a positive number' });
    }
    if (constraints && typeof constraints !== 'string') {
      return res.status(400).json({ error: 'Constraints must be a string' });
    }

    const roomId = 'room-' + uuidv4().substring(0, 8);

    competitions.set(roomId, {
      subject,
      language,
      constraints: constraints || 'None',
      timeLimit,
      createdAt: Date.now(),
      participants: [],
    });

    results.set(roomId, []);

    console.log('Competition created:', { roomId });
    return res.status(201).json({ roomId });
  } catch (error) {
    console.error('Error creating competition:', error);
    return res.status(500).json({ error: `Failed to create competition: ${error.message || 'Unknown error'}` });
  }
});

app.post('/api/join-comp', (req, res) => {
  try {
    const { roomId, username } = req.body;

    if (!roomId || !username) {
      return res.status(400).json({ error: 'Room ID and username are required' });
    }

    const competition = competitions.get(roomId);

    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    if (!competition.participants.includes(username)) {
      competition.participants.push(username);
    }

    const problem = {
      title: competition.subject,
      description: competition.subject,
      difficulty: 'Custom',
      constraints: competition.constraints || 'None',
    };

    return res.status(200).json({ problemStatement: problem });
  } catch (error) {
    console.error('Error joining competition:', error);
    return res.status(500).json({ error: 'Failed to join competition' });
  }
});

app.post('/api/submit-code', async (req, res) => {
  try {
    const { roomId, username, code, language } = req.body;

    if (!roomId || !username || !code || !language) {
      return res.status(400).json({ error: 'Room ID, username, code, and language are required' });
    }

    const competition = competitions.get(roomId)

    console.log(competition)

    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    const submissionId = 'sub-' + uuidv4().substring(0, 8);

    submissions.set(submissionId, {
      roomId,
      username,
      code,
      language,
      timestamp: Date.now(),
      status: 'pending',
    });

    try {
      // Construct prompt for Google AI Studio's code evaluation
      const prompt = `You are an AI code evaluator.

The following submission must be written in **${competition.language}** only.
If the code is in a different language, you MUST give a score of 0 and explain that the wrong programming language was used.

Problem: ${competition.subject}
Constraints: ${competition.constraints || 'None'}
Time Limit: ${competition.timeLimit || 'N/A'}

Code Submitted (language: ${language}):
${code}

Evaluate this code and respond strictly with JSON in the following format:
{"score": '<0-100>', "feedback": "<one concise sentence>"}`;


      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
      );


      let score;
      let feedback = 'No feedback provided by AI.';
      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      try {
        const jsonStart = aiText.indexOf('{');
        const jsonEnd = aiText.lastIndexOf('}') + 1;

        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = aiText.substring(jsonStart, jsonEnd);
          const parsed = JSON.parse(jsonString);
          score = typeof parsed.score === 'number' ? parsed.score : 0;
          feedback = parsed.feedback || feedback;
        } else {
          feedback = aiText;
          score = 50;
        }
      } catch {
        feedback = aiText;
        score = 50;
      }

      if (score < 0 || score > 100) {
        throw new Error('Invalid score received from AI');
      }

      const submission = submissions.get(submissionId);
      if (submission) {
        submission.status = 'completed';
        submission.score = score;
        submission.feedback = feedback;
      }

      const roomResults = results.get(roomId) || [];
      const existingResultIndex = roomResults.findIndex(r => r.username === username);

      if (existingResultIndex >= 0) {
        if (roomResults[existingResultIndex].score < score) {
          roomResults[existingResultIndex] = { username, score, feedback };
        }
      } else {
        roomResults.push({ username, score, feedback });
      }

      roomResults.sort((a, b) => b.score - a.score);
      results.set(roomId, roomResults);

      return res.status(202).json({ submissionId, score, feedback });
    }
 catch (aiError) {
      console.error('Error evaluating code with AI:', aiError);
      const score = 50;
      const feedback = 'Unable to evaluate code due to AI service error. Please try again.';

      const submission = submissions.get(submissionId);
      if (submission) {
        submission.status = 'completed';
        submission.score = score;
        submission.feedback = feedback;
      }

      const roomResults = results.get(roomId) || [];
      const existingResultIndex = roomResults.findIndex(r => r.username === username);

      if (existingResultIndex >= 0) {
        if (roomResults[existingResultIndex].score < score) {
          roomResults[existingResultIndex] = { username, score, feedback };
        }
      } else {
        roomResults.push({ username, score, feedback });
      }

      roomResults.sort((a, b) => b.score - a.score);
      results.set(roomId, roomResults);

      return res.status(202).json({ submissionId, score, feedback });
    }
  } catch (error) {
    console.error('Error submitting code:', error);
    return res.status(500).json({ error: 'Failed to submit code' });
  }
});

app.get('/api/get-results', (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    const roomResults = results.get(roomId) || [];

    return res.status(200).json({ rankings: roomResults });
  } catch (error) {
    console.error('Error getting results:', error);
    return res.status(500).json({ error: 'Failed to get results' });
  }
});

// SPA routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



