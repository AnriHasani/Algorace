import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs.tsx';
import JoinForm from '../components/JoinForm.tsx';
import CreateForm from '../components/CreateForm.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Code, Layers, Trophy, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setProblem } = useApp();
  
  // Mock API functions
  const handleJoin = async (roomId: string, username: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Set a mock problem
        setProblem(
          "Given an array of integers, find the pair of adjacent elements that has the largest product and return that product."
        );
        resolve();
      }, 1000);
    });
  };
  
  const handleCreate = async (subject: string, timeLimit: number) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Generate a random room ID
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Set a mock problem based on the subject
        const problem = `Given an array of integers related to ${subject}, find the pair of adjacent elements that has the largest product and return that product.`;
        setProblem(problem);
        
        resolve(roomId);
      }, 1000);
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 md:py-24 container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            <span className="text-primary-600">Code</span>Battle
          </h1>
          <p className="text-xl text-gray-600 animate-slide-up">
            Compete with other developers, solve challenging problems, and get AI-powered feedback to improve your coding skills.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 animate-slide-up">
            <Tabs defaultValue="join" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="join">Join Competition</TabsTrigger>
                <TabsTrigger value="create">Create Competition</TabsTrigger>
              </TabsList>
              
              <TabsContent value="join">
                <JoinForm onJoin={handleJoin} />
              </TabsContent>
              
              <TabsContent value="create">
                <CreateForm onCreate={handleCreate} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="hidden lg:flex flex-col space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard 
                icon={<Code className="h-8 w-8 text-primary-600" />} 
                title="Real-time Coding"
                description="Solve challenging coding problems with a built-in code editor."
              />
              <FeatureCard 
                icon={<Layers className="h-8 w-8 text-secondary-600" />} 
                title="AI Judging"
                description="Get intelligent feedback on your code quality, efficiency, and correctness."
              />
              <FeatureCard 
                icon={<Trophy className="h-8 w-8 text-accent-600" />} 
                title="Live Leaderboard"
                description="See how you rank against other participants in real-time."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-success-600" />} 
                title="Compete Together"
                description="Join competitions with friends or colleagues to improve together."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card card-hover p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default LandingPage;