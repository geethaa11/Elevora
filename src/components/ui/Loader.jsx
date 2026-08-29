import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Loader({ size = 'md', className }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader2 
      className={cn("animate-spin text-primary", sizes[size], className)} 
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
