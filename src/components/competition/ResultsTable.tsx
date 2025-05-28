import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Award, ChevronUp, ChevronDown, UserCheck } from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext';

interface ResultsTableProps {
  roomId: string;
}

const ResultsTable = ({ roomId }: ResultsTableProps) => {
  const { getResults, rankings, loading } = useCompetition();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to highest score first
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Start polling for results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        await getResults(roomId);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    // Initial fetch
    fetchResults();

    // Set up polling
    const interval = setInterval(fetchResults, 5000);
    setPollingInterval(interval);

    // Clean up on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [roomId, getResults]);

  // Sort rankings based on score
  const sortedRankings = [...rankings].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.score - a.score;
    } else {
      return a.score - b.score;
    }
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // Determine medal for top 3
  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  if (loading && rankings.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-4 border-b border-background-tertiary flex justify-between items-center">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-primary-500 mr-2" />
          <h2 className="font-semibold text-xl">Competition Results</h2>
        </div>
        
        <button 
          onClick={toggleSortOrder}
          className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          Score
          {sortOrder === 'desc' ? (
            <ChevronDown className="h-4 w-4 ml-1" />
          ) : (
            <ChevronUp className="h-4 w-4 ml-1" />
          )}
        </button>
      </div>
      
      {sortedRankings.length === 0 ? (
        <div className="p-6 text-center">
          <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No submissions yet. Be the first to submit!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {sortedRankings.map((ranking, index) => (
                <motion.tr 
                  key={ranking.username}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`border-t border-background-tertiary ${index < 3 ? 'bg-background-tertiary/30' : ''}`}
                >
                  <td className="p-4 font-medium">
                    <div className="flex items-center">
                      <span className="w-6 text-center">{index + 1}</span>
                      <span className="ml-2 text-lg">{getMedal(index)}</span>
                    </div>
                  </td>
                  <td className="p-4">{ranking.username}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-medium">
                        {ranking.score}
                      </div>
                      <div className="ml-2 w-24 bg-background-tertiary rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          style={{ width: `${ranking.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300 max-w-xs truncate">{ranking.feedback}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;