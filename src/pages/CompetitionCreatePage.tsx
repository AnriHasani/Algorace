import {FormEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Brain, Users, Code, Check } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { useAuth } from '../context/AuthContext';
import {
  competitionSubjectAtom,
  competitionConstraintAtom, programmingLanguageAtom,
} from '../components/jotai/competitionAtoms';
import { useAtom } from 'jotai';

const CompetitionCreatePage = () => {
  const [constraints, setConstraints] = useAtom(competitionConstraintAtom);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const { loading, createCompetition } = useCompetition();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useAtom(competitionSubjectAtom);
  const [competitionLanguage, setCompetitionLanguage] = useAtom(programmingLanguageAtom);

  const handleCreateCompetition = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!subject.trim()) {
      alert('Subject is required.');
      return;
    }

    if (!competitionLanguage?.trim()) {
      alert('Programming language is required.');
      return;
    }

    const timeLimit = hours * 3600 + minutes * 60;
    if (timeLimit <= 0) {
      alert('Please set a valid time limit');
      return;
    }

    try {
      const roomId = await createCompetition(subject, timeLimit, constraints, competitionLanguage);
      navigate(`/competition/lobby/${roomId}`);
    } catch (error) {
      console.error('Failed to create competition:', error);
      alert(`Failed to create competition: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  return (
      <div className="min-h-[calc(100vh-16rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 rounded-xl"
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Code className="h-8 w-8 text-primary-500" />
                <h1 className="text-3xl font-bold">Create Competition</h1>
              </div>

              <form onSubmit={handleCreateCompetition} className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <textarea
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter problem description (e.g., input format, output format, examples)"
                      required
                      className="w-full px-4 py-2 text-white bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                    Programming Language <span className="text-red-500">*</span>
                  </label>
                  <input
                      id="language"
                      type="text"
                      value={competitionLanguage ?? ""}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setCompetitionLanguage(e.target.value)
                      }}
                      placeholder="e.g. Python, JavaScript"
                      required
                      className="w-full px-4 py-2 text-white bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="constraints" className="block text-sm font-medium text-gray-300 mb-2">
                    Constraints
                  </label>
                  <input
                      id="constraints"
                      type="text"
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="Enter constraints (e.g., input size, time complexity)"
                      className="w-full px-4 py-2 text-white bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Limit
                  </label>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label htmlFor="hours" className="block text-xs text-gray-400 mb-1">
                        Hours
                      </label>
                      <select
                          id="hours"
                          value={hours}
                          onChange={(e) => setHours(parseInt(e.target.value))}
                          className="input w-full"
                      >
                        {Array.from({ length: 13 }, (_, i) => i).map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-1/2">
                      <label htmlFor="minutes" className="block text-xs text-gray-400 mb-1">
                        Minutes
                      </label>
                      <select
                          id="minutes"
                          value={minutes}
                          onChange={(e) => setMinutes(parseInt(e.target.value))}
                          className="input w-full"
                      >
                        {[0, 15, 30, 45].map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {hours === 0 && minutes === 0 && (
                      <p className="text-error-500 text-sm mt-1">
                        Time limit must be greater than 0
                      </p>
                  )}
                </div>

                <div className="bg-background-tertiary p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Check className="h-5 w-5 text-primary-500 mr-2" />
                    Competition Settings Summary
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-gray-400" />
                      <span>Subject: <span className="text-white">{subject || 'Not set'}</span></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                      Time Limit: <span className="text-white">
                        {hours > 0 && `${hours} hour${hours !== 1 ? 's' : ''}`}
                        {hours > 0 && minutes > 0 && ' and '}
                        {minutes > 0 && `${minutes} minute${minutes !== 1 ? 's' : ''}`}
                        {hours === 0 && minutes === 0 && 'Not set'}
                      </span>
                    </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>
                      Participants can join using the room ID that will be generated
                    </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                      type="submit"
                      disabled={loading || (hours === 0 && minutes === 0)}
                      className="btn btn-primary w-full py-3"
                  >
                    {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="ml-2">Creating competition...</span>
                        </div>
                    ) : (
                        <span>Create Competition</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

export default CompetitionCreatePage;