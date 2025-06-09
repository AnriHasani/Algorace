import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, FileCode } from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext';
import { useAuth } from '../../context/AuthContext';

interface CodeEditorProps {
  roomId: string;
  onSubmit?: () => void;
}

const CodeEditor = ({ roomId, onSubmit }: CodeEditorProps) => {
  const [code, setCode] = useState<string>('// Write your solution here\n\n');
  const [language, setLanguage] = useState<string>('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitCode, loading } = useCompetition();
  const { user } = useAuth();

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'cpp', name: 'C++' },
    { id: 'other', name: 'Other'}
  ];

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);

    // Update starter code based on language
    const starterCodes: Record<string, string> = {
      javascript: '// Write your solution here\n\nfunction solution(input) {\n  // Your code\n  \n  return result;\n}\n',
      typescript: '// Write your solution here\n\nfunction solution(input: any): any {\n  // Your code\n  \n  return result;\n}\n',
      python: '# Write your solution here\n\ndef solution(input):\n    # Your code\n    \n    return result\n',
      java: '// Write your solution here\n\npublic class Solution {\n    public static Object solution(Object input) {\n        // Your code\n        \n        return result;\n    }\n}\n',
      csharp: '// Write your solution here\n\npublic class Solution {\n    public static object Solve(object input) {\n        // Your code\n        \n        return result;\n    }\n}\n',
      cpp: '// Write your solution here\n\n#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nauto solution(auto input) {\n    // Your code\n    \n    return result;\n}\n',
      other: '// Up to you :)'
    };

    setCode(starterCodes[e.target.value] || starterCodes.javascript);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to submit code');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const { score, feedback } = await submitCode(roomId, user.username, code, language);
      alert(`Score: ${score}\nFeedback: ${feedback}`);
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Failed to submit code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="flex flex-col h-full">
        <div className="bg-background-tertiary p-3 rounded-t-lg flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-gray-400" />
            <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-background-secondary text-white border border-background-tertiary rounded px-2 py-1 text-sm"
            >
              {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
                className="btn bg-secondary-600 hover:bg-secondary-700 text-white text-sm py-1 px-3 flex items-center gap-1"
                onClick={() => {
                  localStorage.setItem(`code-${roomId}`, code);
                  alert('Code saved!');
                }}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>

            <button
                className="btn btn-primary text-sm py-1 px-3 flex items-center gap-1"
                onClick={handleSubmit}
                disabled={isSubmitting || loading}
            >
              <Play className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>

        <div className="flex-grow border border-background-tertiary rounded-b-lg overflow-hidden">
          <Editor
              height="100%"
              language={language}
              value={code}
              theme={'vs-dark'}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                automaticLayout: true,
              }}
          />
        </div>
      </div>
  );
};

export default CodeEditor;