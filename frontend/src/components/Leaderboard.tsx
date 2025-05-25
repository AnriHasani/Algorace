import React from 'react';
import { TrendingUp, Medal, Award } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface LeaderboardProps {
  showFeedback?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ showFeedback = true }) => {
  const { rankings, username } = useApp();
  
  // Ensure rankings are sorted by score in descending order
  const sortedRankings = [...rankings].sort((a, b) => b.score - a.score);
  
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-accent-600';
    if (score >= 50) return 'text-warning-600';
    return 'text-error-600';
  };
  
  return (
    <div className="card">
      <div className="bg-accent-600 text-white p-3 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2" />
        <h2 className="text-lg font-medium">Leaderboard</h2>
      </div>
      
      <div className="p-4">
        {sortedRankings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">Rank</th>
                  <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">User</th>
                  <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">Score</th>
                  {showFeedback && (
                    <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">Feedback</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedRankings.map((ranking, index) => (
                  <tr key={index} className={ranking.username === username ? 'bg-primary-50' : ''}>
                    <td className="px-4 py-3 flex items-center">
                      {getMedalIcon(index)}
                      <span className="ml-2">{index + 1}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {ranking.username}
                      {ranking.username === username && (
                        <span className="ml-2 badge-primary">You</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-medium ${getScoreColor(ranking.score)}`}>
                      {ranking.score}
                    </td>
                    {showFeedback && (
                      <td className="px-4 py-3 text-gray-700 text-sm">{ranking.feedback}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results available yet. Submissions are being evaluated.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;