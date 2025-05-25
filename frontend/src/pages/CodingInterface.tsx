import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import CodeEditor from '../components/CodeEditor.tsx';
import ProblemStatement from '../components/ProblemStatement.tsx';
import Timer from '../components/Timer.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CodingInterface: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, problem, setIsLoading } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if no username or problem
  useEffect(() => {
    if (!username || !problem) {
      navigate('/');
    }
  }, [username, problem, navigate]);
  
  const handleSubmit = async (code: string) => {
    setIsSubmitting(true);
    setIsLoading(true);
    
    // Simulate API call to submit code
    try {
      // Wait for 2 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to results page
      navigate(`/results/${roomId}`);
    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  
  const handleTimeEnd = () => {
    // Time's up, automatically submit whatever code is there
    navigate(`/results/${roomId}`);
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
  
  // Initial code template
  const initialCode = `function maxProduct(nums) {
  // Your solution here
  
  return 0;
}

// Example usage
console.log(maxProduct([2, 3, -2, 4])); // Expected output: 6
`;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/lobby/${roomId}`)}
              className="flex items-center text-gray-600 hover:text-primary-600 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coding Challenge</h1>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Timer initialTime={30 * 60} onTimeEnd={handleTimeEnd} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProblemStatement
              title={sampleProblem.title}
              description={sampleProblem.description}
              examples={sampleProblem.examples}
              constraints={sampleProblem.constraints}
            />
          </div>
          
          <div className="h-[600px]">
            <CodeEditor
              initialCode={initialCode}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingInterface;