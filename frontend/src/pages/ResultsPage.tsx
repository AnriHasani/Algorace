import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import Leaderboard from '../components/Leaderboard.tsx';
import { CheckCircle, Home } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, setRankings, rankings } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Simulate getting results
  useEffect(() => {
    const fetchResults = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock rankings data
      const mockRankings = [
        {
          username: username || 'You',
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
          feedback: "Good solution! Your algorithm has O(n) time complexity. Consider using more descriptive variable names."
        },
        {
          username: 'CodeMaster42',
          score: Math.floor(Math.random() * 30) + 70,
          feedback: "Excellent work! Your solution handles edge cases well. Consider optimizing memory usage."
        },
        {
          username: 'DevNinja',
          score: Math.floor(Math.random() * 30) + 70,
          feedback: "Solid implementation. Your code is clean and well-structured. Think about optimizing the inner loop."
        },
        {
          username: 'AlgorithmGuru',
          score: Math.floor(Math.random() * 30) + 70,
          feedback: "Nice solution! Your approach is efficient. Consider adding more comments to explain your thought process."
        }
      ];
      
      // Sort by score
      mockRankings.sort((a, b) => b.score - a.score);
      
      setRankings(mockRankings);
      setIsLoading(false);
    };
    
    fetchResults();
  }, [username, setRankings]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-success-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-success-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Competition Complete!</h1>
          <p className="text-xl text-gray-600">
            Your code has been evaluated by our AI judge. Here are the results.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="card p-12 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-primary-400 rounded-full mb-4"></div>
                <div className="h-4 w-64 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <p className="text-gray-500 mt-4">Calculating results...</p>
            </div>
          ) : (
            <>
              <Leaderboard showFeedback={true} />
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary flex items-center"
                >
                  <Home className="h-5 w-5 mr-2" />
                  <span>Back to Home</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;