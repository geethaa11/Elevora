import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async () => {
    await completeOnboarding({ skills: ['React', 'Firebase'] });
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold font-display">Welcome to Elevora</h1>
        <p className="text-neutral-200">Let's set up your profile.</p>
        <Button variant="ai" className="w-full" onClick={handleComplete}>
          Complete Mock Onboarding
        </Button>
      </Card>
    </div>
  );
}
