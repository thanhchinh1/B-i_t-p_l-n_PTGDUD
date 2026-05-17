import { create } from 'zustand';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateUserRole: async (userId, newRole) => {
    set({ isLoading: true, error: null });
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      });
      set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, role: newRole } : u),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, "users", userId));
      set((state) => ({
        users: state.users.filter(u => u.id !== userId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
