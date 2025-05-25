import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { username, roomId } = useApp();
  const location = useLocation();

  const isCompetitionActive = location.pathname.includes('/lobby') || 
                              location.pathname.includes('/coding') || 
                              location.pathname.includes('/results');

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CodeBattle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {username && isCompetitionActive && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Room:</span>
                  <span className="text-sm font-medium text-gray-700">{roomId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">User:</span>
                  <span className="text-sm font-medium text-gray-700">{username}</span>
                </div>
              </div>
            )}
            
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              {username && isCompetitionActive && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Room:</span>
                    <span className="text-sm font-medium text-gray-700">{roomId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">User:</span>
                    <span className="text-sm font-medium text-gray-700">{username}</span>
                  </div>
                </>
              )}
              
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;