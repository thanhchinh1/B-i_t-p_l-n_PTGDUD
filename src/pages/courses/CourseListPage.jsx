import React, { useEffect, useState } from 'react';
import { useCourseStore } from '../../store/useCourseStore';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const CourseListPage = () => {
  const { courses, isLoading, fetchCourses, deleteCourse } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        toast.success('Course deleted successfully');
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your educational content here.</p>
        </div>
        <Link 
          to="/courses/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..." 
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 min-h-[300px]">
              <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No courses found</p>
              <p className="text-sm mt-1">Try adjusting your search query or create a new course.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                  <Link to={`/courses/${course.id}`} className="block h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BookOpen className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <Link to={`/courses/${course.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{course.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${course.price}</span>
                      <div className="flex space-x-2">
                        <Link to={`/courses/edit/${course.id}`} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(course.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;
