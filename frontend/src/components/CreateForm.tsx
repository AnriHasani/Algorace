import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';

interface CreateFormProps {
  onCreate: (subject: string, timeLimit: number) => Promise<string>;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreate }) => {
  const [subject, setSubject] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setRoomId, setUsername } = useApp();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!subject.trim()) {
      setError('Please enter a competition subject');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // We'll use a fake username for the creator
      const username = `Creator-${Math.floor(Math.random() * 1000)}`;
      setUsername(username);
      
      const roomId = await onCreate(subject, timeLimit);
      setRoomId(roomId);
      navigate(`/lobby/${roomId}`);
    } catch (err) {
      setError('Failed to create the competition. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card p-6 max-w-md w-full">
      <div className="flex items-center mb-4">
        <Plus className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-medium text-gray-900">Create Competition</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
            placeholder="e.g., Array Manipulation, Dynamic Programming"
          />
        </div>
        
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Time Limit (minutes)</span>
            </div>
          </label>
          <select
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="input"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
        
        {error && (
          <div className="text-error-600 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating...' : 'Create Competition'}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;