import { createContext, useState, useContext, ReactNode } from 'react';


interface Problem {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface Submission {
  id: string;
  username: string;
  code: string;
  timestamp: number;
  status: 'pending' | 'success' | 'error';
  score?: number;
  feedback?: string;
}

interface Ranking {
  username: string;
  score: number;
  feedback?: string;
}

interface CompetitionContextType {
  createCompetition: (subject: string, timeLimit: number) => Promise<string>;
  joinCompetition: (roomId: string, username: string) => Promise<Problem>;
  submitCode: (roomId: string, username: string, code: string) => Promise<string>;
  getResults: (roomId: string) => Promise<Ranking[]>;
  currentProblem: Problem | null;
  roomId: string | null;
  timeLimit: number;
  timeRemaining: number;
  rankings: Ranking[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  startTimer: () => void;
  resetTimer: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};

// Mock problem data
const mockProblems: Problem[] = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',

  },
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'Medium',

  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'Medium',

  }
];

export const CompetitionProvider = ({ children }: { children: ReactNode }) => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState(3600); // Default 1 hour in seconds
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);


  // Mock API endpoints
  const createCompetition = async (subject: string, timeLimitValue: number) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate a random room ID
      const newRoomId = 'room-' + Math.random().toString(36).substr(2, 9);
      setRoomId(newRoomId);

      // Set time limit
      setTimeLimit(timeLimitValue);
      setTimeRemaining(timeLimitValue);

      return newRoomId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create competition');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinCompetition = async (roomIdValue: string, username: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Set room ID
      setRoomId(roomIdValue);

      // For demo, randomly select a problem
      const randomProblem = mockProblems[Math.floor(Math.random() * mockProblems.length)];
      setCurrentProblem(randomProblem);

      return randomProblem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join competition');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (roomIdValue: string, username: string, code: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a random submission ID
      const submissionId = 'sub-' + Math.random().toString(36).substr(2, 9);

      // Create a new submission
      const newSubmission: Submission = {
        id: submissionId,
        username,
        code,
        timestamp: Date.now(),
        status: 'pending'
      };

      setSubmissions(prev => [...prev, newSubmission]);

      // Simulate processing time
      setTimeout(() => {
        // Random score between 50 and 100
        const score = Math.floor(Math.random() * 51) + 50;

        // Update submission status
        setSubmissions(prev =>
          prev.map(sub =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: 'success',
                  score,
                  feedback: getRandomFeedback(score)
                }
              : sub
          )
        );

        // Update rankings
        setRankings(prev => {
          const existingRankingIndex = prev.findIndex(r => r.username === username);

          if (existingRankingIndex >= 0) {
            // Update existing ranking if better score
            if (prev[existingRankingIndex].score < score) {
              const updated = [...prev];
              updated[existingRankingIndex] = {
                username,
                score,
                feedback: getRandomFeedback(score)
              };
              return updated.sort((a, b) => b.score - a.score);
            }
            return prev;
          } else {
            // Add new ranking
            return [...prev, {
              username,
              score,
              feedback: getRandomFeedback(score)
            }].sort((a, b) => b.score - a.score);
          }
        });
      }, 3000);

      return submissionId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getResults = async (roomIdValue: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return current rankings
      return rankings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Start a new interval
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);

    // Cleanup on component unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setTimeRemaining(timeLimit);
  };

  // Helper function to generate random feedback
  const getRandomFeedback = (score: number) => {
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
  };

  const value = {
    createCompetition,
    joinCompetition,
    submitCode,
    getResults,
    currentProblem,
    roomId,
    timeLimit,
    timeRemaining,
    rankings,
    submissions,
    loading,
    error,
    startTimer,
    resetTimer
  };

  return <CompetitionContext.Provider value={value}>{children}</CompetitionContext.Provider>;
};