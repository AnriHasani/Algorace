import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface JoinFormProps {
  onJoin: (roomId: string, username: string) => Promise<void>;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUsername, setRoomId } = useApp();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!roomIdInput.trim()) {
      setError('Please enter a valid room ID');
      return;
    }
    
    if (!usernameInput.trim()) {
      setError('Please enter your username');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      setUsername(usernameInput);
      setRoomId(roomIdInput);
      await onJoin(roomIdInput, usernameInput);
      navigate(`/lobby/${roomIdInput}`);
    } catch (err) {
      setError('Failed to join the competition. Please check your room ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card p-6 max-w-md w-full">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-medium text-gray-900">Join Competition</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
            Room ID
          </label>
          <input
            id="roomId"
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className="input"
            placeholder="Enter room ID"
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="input"
            placeholder="Choose a username"
          />
        </div>
        
        {error && (
          <div className="text-error-600 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Joining...' : 'Join Competition'}
        </button>
      </form>
    </div>
  );
};

export default JoinForm;