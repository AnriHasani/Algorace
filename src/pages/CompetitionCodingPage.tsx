import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCompetition } from '../context/CompetitionContext';
import ProblemStatement from '../components/competition/ProblemStatement';
import CodeEditor from '../components/competition/CodeEditor';


const CompetitionCodingPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentProblem, timeRemaining } = useCompetition();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  // Redirect if not authenticated or no roomId
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (!roomId) {
      navigate('/');
    }
    
    if (!currentProblem) {
      navigate(`/competition/lobby/${roomId}`);
    }
  }, [isAuthenticated, roomId, navigate, currentProblem]);
  
  // Redirect to results page when time is up
  useEffect(() => {
    if (timeRemaining === 0) {
      navigate(`/competition/results/${roomId}`);
    }
  }, [timeRemaining, roomId, navigate]);
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Redirect to results page after a short delay
    setTimeout(() => {
      navigate(`/competition/results/${roomId}`);
    }, 1500);
  };
  
  return (
    <div className="py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="flex flex-col space-y-4">
            <ProblemStatement />
          </div>
          
          <div className="flex flex-col h-[calc(100vh-16rem)]">
            {isSubmitted ? (
              <div className="flex items-center justify-center h-full glass rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
                  <p className="text-gray-400 mb-4">
                    Your code has been submitted successfully.
                  </p>
                  <div className="animate-pulse">
                    Redirecting to results page...
                  </div>
                </div>
              </div>
            ) : (
              <CodeEditor 
                roomId={roomId!} 
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompetitionCodingPage;