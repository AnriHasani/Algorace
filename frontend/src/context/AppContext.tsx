import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextType {
  username: string;
  setUsername: (username: string) => void;
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
  problem: string | null;
  setProblem: (problem: string | null) => void;
  timeLeft: number;
  setTimeLeft: (timeLeft: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  codeSubmission: string;
  setCodeSubmission: (codeSubmission: string) => void;
  rankings: Ranking[];
  setRankings: (rankings: Ranking[]) => void;
}

interface Ranking {
  username: string;
  score: number;
  feedback: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSubmission, setCodeSubmission] = useState('');
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const value = {
    username,
    setUsername,
    roomId,
    setRoomId,
    problem,
    setProblem,
    timeLeft,
    setTimeLeft,
    isLoading,
    setIsLoading,
    codeSubmission,
    setCodeSubmission,
    rankings,
    setRankings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}