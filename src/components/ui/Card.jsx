import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn(
        'rounded-xl border border-neutral-700 bg-surface text-neutral-50 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
