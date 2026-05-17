import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Clock, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { enrollCourse, checkEnrollment } = useCourseStore();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Course not found");
          navigate('/courses');
        }
        
        if (user) {
          const enrolled = await checkEnrollment(user.uid, id);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user, navigate, checkEnrollment]);

  const handleEnroll = async () => {
    if (!user) return;
    setIsEnrolling(true);
    try {
      await enrollCourse(user.uid, id);
      setIsEnrolled(true);
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      toast.error("Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 fade-in max-w-5xl mx-auto pb-10">
      <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-700 relative">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-gray-400 opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8">
            <div className="flex items-center space-x-2 text-indigo-300 font-medium text-sm mb-3">
              <span className="bg-indigo-600/20 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30">
                Premium Course
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex items-center text-gray-300 text-sm space-x-4">
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {course.duration}</span>
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About this course</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>Master core concepts and advanced techniques</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ${course.price}
              </div>
              
              {isEnrolled ? (
                <button disabled className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium flex items-center justify-center cursor-default">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Already Enrolled
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-colors shadow-sm disabled:opacity-70"
                >
                  {isEnrolling ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                30-Day Money-Back Guarantee. Full lifetime access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
