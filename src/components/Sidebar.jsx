import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, BookCopy } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'My Learning', path: '/my-courses', icon: BookCopy },
];

const adminItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full hidden md:flex flex-col transition-colors duration-200 shadow-sm z-10">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          EduPlatform
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              {item.name}
            </NavLink>
          );
        })}

        {isAdmin && (
          <>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4">
              Admin Menu
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                  {item.name}
                </NavLink>
              );
            })}
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Need help?</p>
          <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1 mb-3">Check our docs for support.</p>
          <button className="w-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium py-2 rounded-lg shadow-sm hover:shadow transition-all">
            Documentation
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
