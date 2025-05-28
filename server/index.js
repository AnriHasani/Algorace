import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Store competitions data in memory (in production, use a database)
const competitions = new Map();
const submissions = new Map();
const results = new Map();

// Mock problems for demonstration
const problems = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
      }
    ]
  },
  {
    id: 'prob-2',
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'Medium',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ]
  }
];

// API Routes
app.post('/api/create-comp', (req, res) => {
  try {
    const { subject, timeLimit } = req.body;
    
    if (!subject || !timeLimit) {
      return res.status(400).json({ error: 'Subject and timeLimit are required' });
    }
    
    const roomId = 'room-' + uuidv4().substring(0, 8);
    
    competitions.set(roomId, {
      subject,
      timeLimit,
      createdAt: Date.now(),
      participants: []
    });
    
    results.set(roomId, []);
    
    return res.status(201).json({ roomId });
  } catch (error) {
    console.error('Error creating competition:', error);
    return res.status(500).json({ error: 'Failed to create competition' });
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
    
    // Add participant if not already present
    if (!competition.participants.includes(username)) {
      competition.participants.push(username);
    }
    
    // Select a random problem
    const problem = problems[Math.floor(Math.random() * problems.length)];
    
    return res.status(200).json({ problemStatement: problem });
  } catch (error) {
    console.error('Error joining competition:', error);
    return res.status(500).json({ error: 'Failed to join competition' });
  }
});

app.post('/api/submit-code', (req, res) => {
  try {
    const { roomId, username, code } = req.body;
    
    if (!roomId || !username || !code) {
      return res.status(400).json({ error: 'Room ID, username, and code are required' });
    }
    
    const competition = competitions.get(roomId);
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    
    const submissionId = 'sub-' + uuidv4().substring(0, 8);
    
    submissions.set(submissionId, {
      roomId,
      username,
      code,
      timestamp: Date.now(),
      status: 'pending'
    });
    
    // Simulate code judging (in a real app, this would be a separate service)
    setTimeout(() => {
      const score = Math.floor(Math.random() * 51) + 50; // Random score between 50-100
      const feedback = getFeedback(score);
      
      // Update submission status
      const submission = submissions.get(submissionId);
      if (submission) {
        submission.status = 'completed';
        submission.score = score;
        submission.feedback = feedback;
      }
      
      // Update rankings
      const roomResults = results.get(roomId) || [];
      const existingResultIndex = roomResults.findIndex(r => r.username === username);
      
      if (existingResultIndex >= 0) {
        // Update existing result if score is better
        if (roomResults[existingResultIndex].score < score) {
          roomResults[existingResultIndex] = { username, score, feedback };
        }
      } else {
        // Add new result
        roomResults.push({ username, score, feedback });
      }
      
      // Sort by score descending
      roomResults.sort((a, b) => b.score - a.score);
      
      results.set(roomId, roomResults);
    }, 3000);
    
    return res.status(202).json({ submissionId });
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

// Helper function to generate feedback based on score
function getFeedback(score) {
  if (score >= 90) {
    return 'Excellent solution! Very efficient and well-structured.';
  } else if (score >= 80) {
    return 'Good solution with proper time complexity.';
  } else if (score >= 70) {
    return 'Correct solution but could be optimized further.';
  } else if (score >= 60) {
    return 'Solution works but has performance issues.';
  } else {
    return 'Solution passes some test cases but needs improvement.';
  }
}

// Handle SPA routing - serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});