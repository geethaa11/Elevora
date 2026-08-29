import React from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export function Signup() {
  const { loginWithGoogle } = useAuth();
  
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold font-display">Create Account</h2>
        <p className="text-neutral-200">Join Elevora today</p>
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-primary text-neutral-900 h-10 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Mock Signup (Demo)
        </button>
      </Card>
    </div>
  );
}
