import { create } from 'zustand';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export const useCourseStore = create((set, get) => ({
  courses: [],
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
        const storageRef = ref(storage, `courses/${Date.now()}_${thumbnailFile.name}`);
        const snapshot = await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(snapshot.ref);
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
  }
}));
