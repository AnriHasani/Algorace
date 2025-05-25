import React, { useState, useEffect } from 'react';
import { Terminal, Save } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface CodeEditorProps {
  initialCode?: string;
  onSubmit: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode = '', onSubmit }) => {
  const { codeSubmission, setCodeSubmission } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (initialCode && !codeSubmission) {
      setCodeSubmission(initialCode);
    }
  }, [initialCode, codeSubmission, setCodeSubmission]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeSubmission(e.target.value);
  };
  
  const handleSubmit = () => {
    setIsSaving(true);
    
    // Simulate a small delay for UX
    setTimeout(() => {
      onSubmit(codeSubmission);
      setIsSaving(false);
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      const newValue = codeSubmission.substring(0, start) + '  ' + codeSubmission.substring(end);
      
      setCodeSubmission(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  return (
    <div className="card h-full flex flex-col">
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Terminal className="h-5 w-5 mr-2" />
          <span className="font-medium">Code Editor</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving || !codeSubmission.trim()}
          className={`btn px-3 py-1 text-sm flex items-center ${
            isSaving || !codeSubmission.trim() 
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-accent-600 hover:bg-accent-700'
          }`}
        >
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      
      <div className="flex-grow bg-gray-900 p-4">
        <textarea
          value={codeSubmission}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm resize-none outline-none"
          placeholder="// Write your code here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;