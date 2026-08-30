import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Signup() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleMockSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        setError('Network failure: Unable to connect to the server.');
      } else {
        setError(err.message || 'Failed to sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold font-display">Create Account</h2>
        <p className="text-neutral-200">Join Elevora today</p>
        
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button 
          onClick={handleMockSignup}
          disabled={loading}
          className="w-full bg-primary text-neutral-900 h-10 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Mock Signup (Demo)'}
        </button>
      </Card>
    </div>
  );
}
