import React from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { loginWithGoogle } = useAuth();
  
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold font-display">Welcome Back</h2>
        <p className="text-neutral-200">Log in to Elevora</p>
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-neutral-100 text-neutral-900 h-10 rounded-md font-medium hover:bg-neutral-200 transition-colors"
        >
          Mock Login (Demo)
        </button>
      </Card>
    </div>
  );
}
