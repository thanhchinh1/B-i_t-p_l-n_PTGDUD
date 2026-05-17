import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state listener
  init: () => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch additional user data from Firestore if needed
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          set({
            user: { ...currentUser, ...userData },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: currentUser, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // State is handled by onAuthStateChanged
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        role: 'user', // Default role
        createdAt: new Date().toISOString()
      });
      // State is handled by onAuthStateChanged
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      // State is handled by onAuthStateChanged
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));
