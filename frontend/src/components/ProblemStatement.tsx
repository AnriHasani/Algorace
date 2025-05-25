import React from 'react';
import { FileText } from 'lucide-react';

interface ProblemStatementProps {
  title: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
}

const ProblemStatement: React.FC<ProblemStatementProps> = ({
  title,
  description,
  examples,
  constraints,
}) => {
  return (
    <div className="card">
      <div className="bg-primary-600 text-white p-3 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Problem Description</h3>
          <p className="text-gray-700">{description}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Examples</h3>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-500">Input:</h4>
                  <pre className="mt-1 bg-gray-100 p-2 rounded text-sm">{example.input}</pre>
                </div>
                
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-500">Output:</h4>
                  <pre className="mt-1 bg-gray-100 p-2 rounded text-sm">{example.output}</pre>
                </div>
                
                {example.explanation && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Explanation:</h4>
                    <p className="mt-1 text-sm text-gray-700">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Constraints</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;