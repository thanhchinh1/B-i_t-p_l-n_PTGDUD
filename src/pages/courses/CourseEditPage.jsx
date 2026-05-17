import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useCourseStore } from '../../store/useCourseStore';

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.string().min(1, "Duration is required"),
});

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCourses } = useCourseStore(); // to refresh list after edit
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("price", data.price);
          setValue("duration", data.duration);
          if (data.thumbnailUrl) {
            setThumbnailPreview(data.thumbnailUrl);
          }
        } else {
          toast.error("Course not found");
          navigate('/courses');
        }
      } catch (error) {
        toast.error("Failed to fetch course details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id, setValue, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let thumbnailUrl = thumbnailPreview;
      
      if (thumbnailFile) {
        const storageRef = ref(storage, `courses/${Date.now()}_${thumbnailFile.name}`);
        const snapshot = await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(snapshot.ref);
      } else if (!thumbnailPreview && typeof thumbnailPreview !== 'string') {
        thumbnailUrl = null;
      }

      await updateDoc(doc(db, "courses", id), {
        ...data,
        thumbnailUrl
      });
      
      fetchCourses(); // refresh Zustand store
      toast.success("Course updated successfully!");
      navigate('/courses');
    } catch (error) {
      toast.error(error.message || "Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <Link to="/courses" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update the details of your course.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
              <input
                type="text"
                {...register("duration")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Thumbnail</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl relative hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="space-y-1 text-center w-full">
                  {thumbnailPreview ? (
                    <div className="relative inline-block">
                      <img src={thumbnailPreview} alt="Preview" className="max-h-64 object-contain rounded-lg" />
                      <button 
                        type="button" 
                        onClick={() => { setThumbnailPreview(null); setThumbnailFile(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center mt-2">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700/50 mt-6">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditPage;
