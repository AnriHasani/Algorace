import { createContext, useState, useContext, ReactNode } from 'react';

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  constraints?: string;
}

interface Submission {
  id: string;
  username: string;
  code: string;
  language: string;
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
  createCompetition: (subject: string, timeLimit: number, constraints?: string) => Promise<string>;
  joinCompetition: (roomId: string, username: string) => Promise<Problem>;
  submitCode: (roomId: string, username: string, code: string, language: string) => Promise<{ submissionId: string; score?: number; feedback?: string }>;
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
  const createCompetition = async (subject: string, timeLimitValue: number, constraints?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/create-comp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, timeLimit: timeLimitValue, constraints }),
      });

      if (!response.ok) {
        throw new Error('Failed to create competition');
      }

      const { roomId } = await response.json();
      setRoomId(roomId);
      setTimeLimit(timeLimitValue);
      setTimeRemaining(timeLimitValue);

      return roomId;
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

      const response = await fetch('http://localhost:3001/api/join-comp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: roomIdValue, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to join competition');
      }

      const { problemStatement } = await response.json();
      setRoomId(roomIdValue);
      setCurrentProblem(problemStatement);

      return problemStatement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join competition');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (roomIdValue: string, username: string, code: string, language: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: roomIdValue, username, code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit code');
      }

      const { submissionId, score, feedback } = await response.json();

      const newSubmission: Submission = {
        id: submissionId,
        username,
        code,
        language,
        timestamp: Date.now(),
        status: score !== undefined ? 'success' : 'pending',
        score,
        feedback,
      };

      setSubmissions(prev => [...prev, newSubmission]);

      if (score !== undefined && feedback) {
        setRankings(prev => {
          const existingRankingIndex = prev.findIndex(r => r.username === username);

          if (existingRankingIndex >= 0) {
            if (prev[existingRankingIndex].score < score) {
              const updated = [...prev];
              updated[existingRankingIndex] = { username, score, feedback };
              return updated.sort((a, b) => b.score - a.score);
            }
            return prev;
          } else {
            return [...prev, { username, score, feedback }].sort((a, b) => b.score - a.score);
          }
        });
      }

      return { submissionId, score, feedback };
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

      const response = await fetch(`http://localhost:3001/api/get-results?roomId=${roomIdValue}`);
      if (!response.ok) {
        throw new Error('Failed to get results');
      }

      const { rankings } = await response.json();
      setRankings(rankings);
      return rankings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

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
    resetTimer,
  };

  return <CompetitionContext.Provider value={value}>{children}</CompetitionContext.Provider>;
};