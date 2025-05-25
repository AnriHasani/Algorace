import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeEnd?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeEnd }) => {
  const { timeLeft, setTimeLeft } = useApp();
  const [isWarning, setIsWarning] = useState(false);
  
  useEffect(() => {
    setTimeLeft(initialTime);
    
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeEnd && onTimeEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [initialTime, onTimeEnd, setTimeLeft]);
  
  useEffect(() => {
    // Set warning when less than 20% of time remains
    setIsWarning(timeLeft < initialTime * 0.2);
  }, [timeLeft, initialTime]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`flex items-center ${isWarning ? 'animate-pulse-slow' : ''}`}>
      <Clock className={`mr-2 h-5 w-5 ${isWarning ? 'text-error-600' : 'text-gray-700'}`} />
      <div className="text-lg font-medium">
        <span className={isWarning ? 'text-error-600' : 'text-gray-900'}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};

export default Timer;