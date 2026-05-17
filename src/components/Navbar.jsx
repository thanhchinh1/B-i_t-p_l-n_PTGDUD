import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 transition-colors duration-200 sticky top-0 z-20">
      <div className="flex items-center flex-1">
        <div className="relative w-64 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full text-sm placeholder-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user?.displayName || 'User'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Student'}</span>
          </div>
          
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md ring-2 ring-white dark:ring-gray-800">
            <User className="w-5 h-5" />
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
