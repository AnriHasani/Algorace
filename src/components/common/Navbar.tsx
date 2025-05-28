import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background-secondary border-b border-background-tertiary">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
                AlgoRace
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/competition/create" className="text-gray-300 hover:text-white transition-colors duration-200">
              Create Competition
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">
                  Hi, <span className="text-primary-400">{user?.username}</span>
                </span>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4">
            <Link 
              to="/"
              className="block py-2 text-gray-300 hover:text-white transition-colors duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/competition/create"
              className="block py-2 text-gray-300 hover:text-white transition-colors duration-200"
              onClick={toggleMenu}
            >
              Create Competition
            </Link>
            {isAuthenticated ? (
              <>
                <div className="py-2 text-gray-400">
                  Hi, <span className="text-primary-400">{user?.username}</span>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="flex items-center space-x-1 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block py-2 text-primary-500 hover:text-primary-400 transition-colors duration-200 font-medium"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;