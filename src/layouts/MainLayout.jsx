import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 relative">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
