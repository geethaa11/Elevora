import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toggle this or rely on Firebase config validity to use mock auth
  const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || auth.app.options.apiKey === 'demo-api-key';

  useEffect(() => {
    if (USE_MOCK) {
      // Use LocalStorage mock auth
      const mockUser = localStorage.getItem('elevora_mock_user');
      if (mockUser) {
        setCurrentUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [USE_MOCK]);

  const signup = async (email, password) => {
    if (USE_MOCK) {
      const newUser = { uid: Date.now().toString(), email, displayName: email.split('@')[0], completedOnboarding: false };
      localStorage.setItem('elevora_mock_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      return newUser;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    if (USE_MOCK) {
      // Accept any login for demo
      const user = { uid: 'mock-123', email, displayName: email.split('@')[0], completedOnboarding: true };
      localStorage.setItem('elevora_mock_user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (USE_MOCK) {
      const user = { uid: 'mock-google', email: 'demo@google.com', displayName: 'Demo User', completedOnboarding: true };
      localStorage.setItem('elevora_mock_user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (USE_MOCK) {
      localStorage.removeItem('elevora_mock_user');
      setCurrentUser(null);
      return;
    }
    return signOut(auth);
  };

  const completeOnboarding = (userData) => {
    if (USE_MOCK) {
      const updatedUser = { ...currentUser, ...userData, completedOnboarding: true };
      localStorage.setItem('elevora_mock_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    }
    // For real firebase, this would update Firestore profile
    // Just mock it here since we are client SDK only right now
    const updatedUser = { ...currentUser, ...userData, completedOnboarding: true };
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    completeOnboarding,
    isMock: USE_MOCK
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
