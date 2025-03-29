import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-messsathi-orange to-messsathi-blue bg-clip-text text-transparent">
                MessSathi
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-messsathi-orange">
              Home
            </Link>
            <Link to="/search" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-messsathi-orange">
              Find Mess
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-messsathi-orange">
              About
            </Link>
            {user ? (
              <Link to={userData?.role === 'owner' ? '/mess-owner-dashboard' : '/tenant-dashboard'}>
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-messsathi-orange hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-messsathi-orange"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-messsathi-orange hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-messsathi-orange hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Mess
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-messsathi-orange hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <Link 
                to={userData?.role === 'owner' ? '/mess-owner-dashboard' : '/tenant-dashboard'} 
                className="block px-3 py-2 rounded-md text-base font-medium bg-messsathi-orange text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-2 pt-2">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium border border-gray-300 text-gray-700 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-messsathi-orange text-white text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
