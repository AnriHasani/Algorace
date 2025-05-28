import { Code} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-background-tertiary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
                AlgoRace
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              Compete, code, conquer. Showcase your algorithmic skills in real-time competitions.
            </p>
          </div>


          <div className="md:col-span-1">
            <h3 className="text-md font-semibold text-white mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/competition/create" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Create Competition
                </Link>
              </li>

            </ul>
          </div>


          <div className="md:col-span-1">
            <h3 className="text-md font-semibold text-white mb-3">Connect</h3>

            <p className="text-sm text-gray-400">
              Contact us at <a href="mailto:support@algorace.io" className="text-primary-400 hover:text-primary-300">support@algorace.io</a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-background-tertiary text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AlgoRace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;