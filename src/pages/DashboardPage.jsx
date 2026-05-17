import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, GraduationCap, TrendingUp, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

const data = [
  { name: 'Jan', students: 10, courses: 2 },
  { name: 'Feb', students: 15, courses: 3 },
  { name: 'Mar', students: 20, courses: 4 },
  { name: 'Apr', students: 25, courses: 5 },
  { name: 'May', students: 30, courses: 8 },
  { name: 'Jun', students: 45, courses: 10 },
  { name: 'Jul', students: 50, courses: 12 },
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const timeAgo = (date) => {
  if (!date) return 'Just now';
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m ago";
  return Math.floor(seconds) + "s ago";
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    revenue: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const totalStudents = usersSnap.size;

        const coursesSnap = await getDocs(collection(db, "courses"));
        const activeCourses = coursesSnap.size;
        const coursesMap = {};
        coursesSnap.forEach(doc => {
          coursesMap[doc.id] = doc.data();
        });

        const enrollmentsRef = collection(db, "enrollments");
        const enrollmentsQuery = query(enrollmentsRef, orderBy("enrolledAt", "desc"));
        const enrollmentsSnap = await getDocs(enrollmentsQuery);
        const totalEnrollments = enrollmentsSnap.size;

        let revenue = 0;
        const recentActivity = [];

        enrollmentsSnap.forEach(doc => {
          const data = doc.data();
          const course = coursesMap[data.courseId];
          if (course) {
            revenue += Number(course.price || 0);
          }
          
          if (recentActivity.length < 5) {
            recentActivity.push({
              id: doc.id,
              courseName: course?.title || 'Unknown Course',
              enrolledAt: data.enrolledAt?.toDate() || new Date(),
              userId: data.userId
            });
          }
        });

        setStats({
          totalStudents,
          activeCourses,
          totalEnrollments,
          revenue,
          recentActivity
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in h-full pb-10">
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
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} trend="12.5" />
        <StatCard title="Active Courses" value={stats.activeCourses} icon={BookOpen} trend="5.2" />
        <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon={GraduationCap} trend="14.8" />
        <StatCard title="Revenue" value={formatCurrency(stats.revenue)} icon={TrendingUp} trend="8.4" />
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
            {stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">U{i+1}</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New student enrolled</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.courseName}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {timeAgo(activity.enrolledAt)}
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
