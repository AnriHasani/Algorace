import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, ArrowRight, Copy } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { useAuth } from '../context/AuthContext';

const CompetitionLobbyPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const { joinCompetition, loading, currentProblem, startTimer } = useCompetition();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is authenticated, pre-fill username
    if (isAuthenticated && user) {
      setUsername(user.username);
    }
  }, [isAuthenticated, user]);
  
  const handleJoinCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomId) {
      alert('Invalid room ID');
      navigate('/');
      return;
    }
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    try {
      await joinCompetition(roomId, username);
      setHasJoined(true);
    } catch (error) {
      console.error('Error joining competition:', error);
      alert('Failed to join competition. Please try again.');
    }
  };
  
  const handleStartCompetition = () => {
    if (!roomId) return;
    
    // Start the timer
    startTimer();
    
    // Navigate to coding page
    navigate(`/competition/coding/${roomId}`);
  };
  
  const copyRoomId = () => {
    if (!roomId) return;
    
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-[calc(100vh-16rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-8 rounded-xl"
          >
            <h1 className="text-3xl font-bold text-center mb-6">
              Competition Lobby
            </h1>
            
            <div className="mb-6 bg-background-tertiary/50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Room ID:</span>
                <span className="font-mono font-medium">{roomId}</span>
              </div>
              <button
                onClick={copyRoomId}
                className="btn bg-background-tertiary hover:bg-background-tertiary/80 text-white text-sm py-1 px-2 flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-success-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            {!hasJoined ? (
              <form onSubmit={handleJoinCompetition} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="ml-2">Joining...</span>
                      </div>
                    ) : (
                      <span>Join Competition</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center bg-primary-600/20 p-3 rounded-full mb-3">
                    <Users className="h-6 w-6 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Ready to Start
                  </h2>
                  <p className="text-gray-400 mt-1">
                    You've successfully joined the competition as <span className="text-primary-400 font-medium">{username}</span>
                  </p>
                </div>
                
                {currentProblem && (
                  <div className="bg-background-tertiary/50 p-4 rounded-lg space-y-3">
                    <h3 className="font-medium">Problem Preview</h3>
                    <p className="text-gray-400 text-sm">
                      <span className="text-white">{currentProblem.title}</span> - {currentProblem.difficulty} difficulty
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Solve this algorithmic challenge within the time limit</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    onClick={handleStartCompetition}
                    className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <span>Start Coding</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add this import that was missing above
import { Check } from 'lucide-react';

export default CompetitionLobbyPage;