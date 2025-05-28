import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Cpu, Users, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="block">Compete. Code.</span>
                <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
                  Conquer.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Challenge yourself in real-time algorithmic competitions. 
                Solve problems, showcase your skills, and climb the leaderboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/competition/create" 
                  className="btn btn-primary py-3 px-6 text-center"
                >
                  Create Competition
                </Link>
                <Link
                  to="/register"
                  className="btn bg-background-tertiary hover:bg-background-tertiary/80 text-white py-3 px-6 text-center"
                >
                  Sign Up Now
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden glass p-6 border border-background-tertiary">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
                <pre className="font-mono text-sm text-gray-300 overflow-x-auto">
                  <code>{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}`}</code>
                </pre>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white p-3 rounded-lg shadow-lg">
                <Cpu className="h-6 w-6" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-accent-600 text-white p-3 rounded-lg shadow-lg">
                <Code className="h-6 w-6" />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass p-6 rounded-lg"
          >
            <div className="bg-primary-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Trophy className="text-primary-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Competitions</h3>
            <p className="text-gray-400">
              Participate in real-time coding contests with customizable time limits and problem sets.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass p-6 rounded-lg"
          >
            <div className="bg-secondary-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Cpu className="text-secondary-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Code Evaluation</h3>
            <p className="text-gray-400">
              Get instant feedback on your code quality, efficiency and correctness powered by AI.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass p-6 rounded-lg"
          >
            <div className="bg-accent-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="text-accent-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Problem Solving</h3>
            <p className="text-gray-400">
              Explore coding challenges to sharpen your skills and prepare for the next event.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;