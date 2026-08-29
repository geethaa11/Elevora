import React from 'react';
import { Card } from '../components/ui/Card';

export function ForgotPassword() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display">Reset Password</h2>
        <p className="text-neutral-200">Placeholder for forgot password flow.</p>
      </Card>
    </div>
  );
}
