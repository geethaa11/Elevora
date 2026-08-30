import React, { createContext, useContext, useState, useEffect } from 'react';
import { submitOnboarding } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  // DEMO MODE:
  // Authentication is handled locally so the deployed demo
  // does not depend on the backend login endpoint.
  const USE_MOCK = true;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const savedUser = localStorage.getItem('user');

    if (token && userId && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Invalid saved demo session');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  // DEMO LOGIN — no backend request
  const login = async (email, password) => {
    const user = {
      uid: 1,
      user_id: 1,
      email: email,
      displayName: 'Demo Student',
      name: 'Demo Student',
      role: 'student',
      completedOnboarding: true
    };

    localStorage.setItem('token', 'elevora-demo-session');
    localStorage.setItem('user_id', '1');
    localStorage.setItem('user', JSON.stringify(user));

    setCurrentUser(user);

    return user;
  };

  // DEMO SIGNUP — no backend request
  const signup = async (name, email, password, role = 'student') => {
    const user = {
      uid: 1,
      user_id: 1,
      email: email,
      displayName: name,
      name: name,
      role: role,
      completedOnboarding: true
    };

    localStorage.setItem('token', 'elevora-demo-session');
    localStorage.setItem('user_id', '1');
    localStorage.setItem('user', JSON.stringify(user));

    setCurrentUser(user);

    return user;
  };

  // Demo Google login
  const loginWithGoogle = async () => {
    const user = {
      uid: 1,
      user_id: 1,
      email: 'demo@elevora.com',
      displayName: 'Demo Student',
      name: 'Demo Student',
      role: 'student',
      completedOnboarding: true
    };

    localStorage.setItem('token', 'elevora-demo-session');
    localStorage.setItem('user_id', '1');
    localStorage.setItem('user', JSON.stringify(user));

    setCurrentUser(user);

    return user;
  };

  // Demo GitHub login
  const loginWithGithub = async () => {
    return loginWithGoogle();
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');

    setCurrentUser(null);
  };

  const completeOnboarding = async (userData) => {
    if (!currentUser?.uid) {
      return currentUser;
    }

    // Keep onboarding locally available for demo mode.
    const updatedUser = {
      ...currentUser,
      ...userData,
      completedOnboarding: true
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    return updatedUser;
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    completeOnboarding,
    isMock: USE_MOCK
  };

  return (
    <AuthContext.Provider value={value}>
      {currentUser !== undefined && children}
    </AuthContext.Provider>
  );
}
