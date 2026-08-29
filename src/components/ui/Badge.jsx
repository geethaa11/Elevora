import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className, ...props }) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'bg-neutral-800 text-neutral-50',
    ai: 'bg-semantic-ai/20 text-semantic-ai border border-semantic-ai/30',
    featured: 'bg-primary/20 text-primary border border-primary/30',
    recommended: 'bg-semantic-info/20 text-semantic-info border border-semantic-info/30',
    popular: 'bg-semantic-success/20 text-semantic-success border border-semantic-success/30',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
