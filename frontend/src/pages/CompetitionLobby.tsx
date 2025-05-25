import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import ProblemStatement from '../components/ProblemStatement.tsx';
import Timer from '../components/Timer.tsx';
import { Users, Clock, ArrowRight } from 'lucide-react';

const CompetitionLobby: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, problem, setTimeLeft } = useApp();
  const [participants, setParticipants] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  
  // Redirect if no username or problem
  useEffect(() => {
    if (!username || !problem) {
      navigate('/');
    }
  }, [username, problem, navigate]);
  
  // Mock getting participants
  useEffect(() => {
    // Simulate API call to get participants
    const mockParticipants = [
      username,
      'CodeMaster42',
      'DevNinja',
      'AlgorithmGuru'
    ];
    
    setParticipants(mockParticipants);
  }, [username]);
  
  const handleStart = () => {
    setIsStarting(true);
    
    // Countdown before starting
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(`/coding/${roomId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Sample problem for display
  const sampleProblem = {
    title: 'Maximum Product Subarray',
    description: problem || 'Loading problem...',
    examples: [
      {
        input: '[2, 3, -2, 4]',
        output: '6',
        explanation: 'The subarray [2, 3] has the largest product: 2 × 3 = 6.'
      },
      {
        input: '[-2, 0, -1]',
        output: '0',
        explanation: 'The result cannot be negative, so the maximum product is 0.'
      }
    ],
    constraints: [
      'The array length will be between 1 and 10^4',
      'Each element will be between -10^3 and 10^3',
      'The result will fit in a 32-bit integer'
    ]
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Competition Lobby</h1>
            <p className="text-gray-600">Get ready for the competition to begin!</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-700 mr-2" />
              <span className="text-gray-700">{participants.length} Participants</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-700 mr-2" />
              <span className="text-gray-700">30:00 Time Limit</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProblemStatement
              title={sampleProblem.title}
              description={sampleProblem.description}
              examples={sampleProblem.examples}
              constraints={sampleProblem.constraints}
            />
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                Participants
              </h2>
              
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md flex items-center ${
                      participant === username ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-medium">
                      {participant.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-3 font-medium">
                      {participant}
                      {participant === username && (
                        <span className="ml-2 badge-primary">You</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card p-6 text-center">
              {isStarting ? (
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-4xl font-bold text-primary-600">
                    {countdown}
                  </div>
                  <p className="text-gray-700">Competition starting...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    The competition will start once you're ready. You'll have 30 minutes to solve the problem.
                  </p>
                  <button
                    onClick={handleStart}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <span>Start Coding</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionLobby;