import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowRight, CheckCircle, Clock, Brain, Laptop, Users } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';

const HomePage = () => {
  const [joinRoomId, setJoinRoomId] = useState('');
  
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      window.location.href = `/competition/lobby/${joinRoomId.trim()}`;
    }
  };
  
  return (
    <div>
      <HeroSection />
      
      {/* Join Competition Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Join an Existing Competition
            </h2>
            
            <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="input flex-grow text-lg"
                required
              />
              <button 
                type="submit"
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                Join Competition
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How AlgoRace Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mb-6">
                <Laptop className="h-7 w-7 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create or Join</h3>
              <p className="text-gray-400">
                Create a new competition with custom parameters or join an existing one with a Room ID.
              </p>
              <div className="mt-6 w-full max-w-xs h-1 bg-background-tertiary rounded-full relative">
                <div className="absolute inset-y-0 left-0 bg-primary-600 w-1/3 rounded-full"></div>
                <div className="absolute -top-3 left-1/3 transform -translate-x-1/2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-secondary-600/20 rounded-full flex items-center justify-center mb-6">
                <Code className="h-7 w-7 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Solve & Submit</h3>
              <p className="text-gray-400">
                Tackle algorithmic challenges with our in-browser code editor and submit solutions.
              </p>
              <div className="mt-6 w-full max-w-xs h-1 bg-background-tertiary rounded-full relative">
                <div className="absolute inset-y-0 left-0 bg-secondary-600 w-2/3 rounded-full"></div>
                <div className="absolute -top-3 left-2/3 transform -translate-x-1/2 w-6 h-6 bg-secondary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-accent-600/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Feedback</h3>
              <p className="text-gray-400">
                Receive instant AI-powered feedback on your code's quality, efficiency, and correctness.
              </p>
              <div className="mt-6 w-full max-w-xs h-1 bg-background-tertiary rounded-full relative">
                <div className="absolute inset-y-0 left-0 bg-accent-600 w-full rounded-full"></div>
                <div className="absolute -top-3 right-0 transform -translate-x-1/2 w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary-600/20 p-3 rounded-full flex items-center justify-center">
                  <Clock className="text-primary-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Timed Competitions</h3>
                  <p className="text-gray-400">
                    Participate in real-time coding competitions with customizable time limits to test your problem-solving speed.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span className="text-sm text-gray-300">Customizable time limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span className="text-sm text-gray-300">Real-time countdown timer</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-secondary-600/20 p-3 rounded-full flex items-center justify-center">
                  <Code className="text-secondary-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Code Editor</h3>
                  <p className="text-gray-400">
                    Write, test, and submit your code with our powerful in-browser code editor with syntax highlighting.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm text-gray-300">Syntax highlighting for multiple languages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm text-gray-300">Code auto-formatting and suggestions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-accent-600/20 p-3 rounded-full flex items-center justify-center">
                  <Brain className="text-accent-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Evaluation</h3>
                  <p className="text-gray-400">
                    Get comprehensive feedback on your code's quality, efficiency, and correctness from our advanced AI judge.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent-500" />
                      <span className="text-sm text-gray-300">Detailed code analysis and feedback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent-500" />
                      <span className="text-sm text-gray-300">Suggestions for optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary-600/20 p-3 rounded-full flex items-center justify-center">
                  <Users className="text-primary-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
                  <p className="text-gray-400">
                    Track your performance against other participants with our leaderboard system.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span className="text-sm text-gray-300">Rankings and scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span className="text-sm text-gray-300">Performance metrics and statistics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/competition/create" className="btn btn-primary py-3 px-6 inline-flex items-center gap-2">
              Create Your First Competition
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;