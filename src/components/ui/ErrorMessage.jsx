import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ErrorMessage({ message, className }) {
  if (!message) return null;
  
  return (
    <div className={cn("flex items-center gap-2 text-sm text-semantic-danger mt-1", className)}>
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}
