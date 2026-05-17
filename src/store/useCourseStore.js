import { create } from 'zustand';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing in .env");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Failed to upload image');
  }

  const data = await res.json();
  return data.secure_url;
};

export const useCourseStore = create((set, get) => ({
  courses: [],
  myCourses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ courses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCourse: async (courseData, thumbnailFile) => {
    set({ isLoading: true, error: null });
    try {
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile);
      }

      const docRef = await addDoc(collection(db, "courses"), {
        ...courseData,
        thumbnailUrl,
        createdAt: serverTimestamp(),
      });
      
      const newCourse = { id: docRef.id, ...courseData, thumbnailUrl };
      set((state) => ({ 
        courses: [...state.courses, newCourse],
        isLoading: false 
      }));
      return newCourse;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, "courses", courseId));
      set((state) => ({
        courses: state.courses.filter(c => c.id !== courseId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  enrollCourse: async (userId, courseId) => {
    set({ isLoading: true, error: null });
    try {
      await addDoc(collection(db, "enrollments"), {
        userId,
        courseId,
        enrolledAt: serverTimestamp()
      });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchMyCourses: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(collection(db, "enrollments"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const enrolledCourseIds = querySnapshot.docs.map(doc => doc.data().courseId);
      
      if (enrolledCourseIds.length === 0) {
        set({ myCourses: [], isLoading: false });
        return;
      }

      const coursesPromises = enrolledCourseIds.map(id => getDoc(doc(db, "courses", id)));
      const coursesSnapshots = await Promise.all(coursesPromises);
      
      const myCourses = coursesSnapshots
        .filter(snap => snap.exists())
        .map(snap => ({ id: snap.id, ...snap.data() }));

      set({ myCourses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  checkEnrollment: async (userId, courseId) => {
    try {
      const q = query(
        collection(db, "enrollments"), 
        where("userId", "==", userId),
        where("courseId", "==", courseId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  }
}));
