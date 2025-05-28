import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext';

interface ProblemStatementProps {
  collapsed?: boolean;
}

const ProblemStatement = ({ collapsed = false }: ProblemStatementProps) => {
  const { currentProblem, timeRemaining } = useCompetition();
  
  if (!currentProblem) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-background-tertiary rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-background-tertiary rounded w-full"></div>
          <div className="h-4 bg-background-tertiary rounded w-5/6"></div>
          <div className="h-4 bg-background-tertiary rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Determine difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success-700/20 text-success-500';
      case 'Medium':
        return 'bg-warning-700/20 text-warning-500';
      case 'Hard':
        return 'bg-error-700/20 text-error-500';
      default:
        return 'bg-primary-700/20 text-primary-500';
    }
  };
  
  if (collapsed) {
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-xl">{currentProblem.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentProblem.difficulty)} inline-block mt-1`}>
              {currentProblem.difficulty}
            </span>
          </div>
          <div className="flex items-center text-warning-500 bg-warning-500/10 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="p-4 border-b border-background-tertiary flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-xl">{currentProblem.title}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentProblem.difficulty)} inline-block mt-1`}>
            {currentProblem.difficulty}
          </span>
        </div>
        <div className="flex items-center text-warning-500 bg-warning-500/10 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-line">{currentProblem.description}</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Examples</h3>
          
          {currentProblem.examples.map((example, index) => (
            <div key={index} className="mb-4 bg-background-tertiary/50 p-4 rounded-md">
              <div className="mb-2">
                <span className="font-semibold text-secondary-400">Input:</span>
                <pre className="mt-1 bg-background-primary p-2 rounded text-sm overflow-x-auto">{example.input}</pre>
              </div>
              
              <div className="mb-2">
                <span className="font-semibold text-accent-400">Output:</span>
                <pre className="mt-1 bg-background-primary p-2 rounded text-sm overflow-x-auto">{example.output}</pre>
              </div>
              
              {example.explanation && (
                <div>
                  <span className="font-semibold text-primary-400">Explanation:</span>
                  <p className="mt-1 text-sm text-gray-300">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Your solution should have good time complexity. Consider the constraints of the problem.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-warning-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Remember to handle edge cases and invalid inputs appropriately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;