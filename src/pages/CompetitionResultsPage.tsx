import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Share2 } from 'lucide-react';
import ResultsTable from '../components/competition/ResultsTable';
import ProblemStatement from '../components/competition/ProblemStatement';
import {useCompetition} from "../context/CompetitionContext.tsx";
import {useEffect} from "react";

const CompetitionResultsPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {stopTimer} = useCompetition();

  useEffect(() => {
    stopTimer();
  }, [stopTimer]);

  // Share functionality
  const handleShare = () => {
    if (!roomId) return;
    
    const shareText = `Join my coding competition on AlgoRace! Room ID: ${roomId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AlgoRace Competition',
        text: shareText,
        url: window.location.origin + '/competition/lobby/' + roomId,
      }).catch((error) => {
        console.error('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  };
  
  const fallbackShare = () => {
    if (!roomId) return;
    
    const shareText = `Join my coding competition on AlgoRace! Room ID: ${roomId}`;
    const shareUrl = window.location.origin + '/competition/lobby/' + roomId;
    
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    alert('Invite link copied to clipboard!');
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Trophy className="h-8 w-8 text-primary-500 mr-2" />
              Competition Results
            </h1>
            <p className="text-gray-400 mt-1">
              Room ID: <span className="font-mono font-medium">{roomId}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="btn bg-background-tertiary hover:bg-background-tertiary/80 text-white flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <Link
              to="/"
              className="btn btn-primary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResultsTable roomId={roomId!} />
            </div>
            
            <div>
              <ProblemStatement collapsed />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompetitionResultsPage;