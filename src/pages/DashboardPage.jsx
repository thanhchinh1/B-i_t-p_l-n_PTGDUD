import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Jan', students: 400, courses: 24 },
  { name: 'Feb', students: 300, courses: 13 },
  { name: 'Mar', students: 200, courses: 98 },
  { name: 'Apr', students: 278, courses: 39 },
  { name: 'May', students: 189, courses: 48 },
  { name: 'Jun', students: 239, courses: 38 },
  { name: 'Jul', students: 349, courses: 43 },
];

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center">
        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
      <span className="text-emerald-500 font-medium">{trend}%</span>
      <span className="text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="space-y-6 fade-in h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="12,345" icon={Users} trend="12.5" />
        <StatCard title="Active Courses" value="84" icon={BookOpen} trend="5.2" />
        <StatCard title="Total Enrollments" value="45,678" icon={GraduationCap} trend="14.8" />
        <StatCard title="Revenue" value="$124,500" icon={TrendingUp} trend="8.4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Growth Statistics</h2>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">U{i}</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New student enrolled</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">React for Beginners course</p>
                </div>
                <div className="text-xs text-gray-400">
                  {i * 2}h ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
