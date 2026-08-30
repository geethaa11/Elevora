import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi, getUserProfile, submitOnboarding } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined means loading
  
  // We can still expose a mock flag if some components depend on it, 
  // but now we're using real backend
  const USE_MOCK = false;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      getUserProfile(userId).then(user => {
        setCurrentUser({
          uid: user.id,
          email: user.email,
          displayName: user.name,
          role: user.role,
          completedOnboarding: !!user.profile,
          ...user.profile
        });
      }).catch(err => {
        console.error("Session expired or invalid", err);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setCurrentUser(null);
      });
    } else {
      setCurrentUser(null);
    }
  }, []);

  const signup = async (name, email, password, role = 'student') => {
    const data = await signupApi(name, email, password, role);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id);
    
    const user = {
      uid: data.user_id,
      email,
      displayName: name,
      role: data.role,
      completedOnboarding: false
    };
    setCurrentUser(user);
    return user;
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id);
    
    const userProfile = await getUserProfile(data.user_id);
    
    const user = {
      uid: userProfile.id,
      email: userProfile.email,
      displayName: userProfile.name,
      role: userProfile.role,
      completedOnboarding: !!userProfile.profile,
      ...userProfile.profile
    };
    setCurrentUser(user);
    return user;
  };

  const loginWithGoogle = async () => {
    // For the "Mock Signup (Demo)" button, generate a mock credential
    // and try to sign up or log in
    const randomId = Date.now();
    const name = `Demo User ${randomId}`;
    const email = `demo_${randomId}@elevora.com`;
    const password = "DemoPassword123!";
    return signup(name, email, password, 'student');
  };

  const loginWithGithub = async () => {
    const randomId = Date.now();
    const name = `GitHub User ${randomId}`;
    const email = `github_${randomId}@elevora.com`;
    const password = "DemoPassword123!";
    return signup(name, email, password, 'student');
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setCurrentUser(null);
  };

  const completeOnboarding = async (userData) => {
    if (currentUser?.uid) {
      const result = await submitOnboarding(currentUser.uid, userData);
      if (result.success) {
        const updatedUser = { 
          ...currentUser, 
          ...result.profile, 
          completedOnboarding: true 
        };
        setCurrentUser(updatedUser);
        return updatedUser;
      }
    }
    return currentUser;
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
