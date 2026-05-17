import React, { useEffect } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle } from 'lucide-react';

const MyCoursesPage = () => {
  const { user } = useAuthStore();
  const { myCourses, isLoading, fetchMyCourses } = useCourseStore();

  useEffect(() => {
    if (user) {
      fetchMyCourses(user.uid);
    }
  }, [user, fetchMyCourses]);

  return (
    <div className="space-y-6 fade-in h-full flex flex-col pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Learning</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Courses you are currently enrolled in.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex-1 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : myCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="w-20 h-20 mb-4 rounded-full bg-indigo-50 dark:bg-gray-700 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-indigo-400" />
            </div>
            <p className="text-lg font-medium">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map(course => (
              <div key={course.id} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <BookOpen className="w-10 h-10 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{course.title}</h3>
                  
                  <div className="mt-auto pt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0% Complete</span>
                      <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
