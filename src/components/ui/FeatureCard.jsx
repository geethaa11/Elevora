import React from 'react';
import { Card } from './Card';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  ctaText = "Learn more", 
  className 
}) {
  return (
    <Card className={cn('p-6 flex flex-col', className)}>
      {Icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-primary">
          <Icon size={24} />
        </div>
      )}
      <h3 className="mb-2 text-xl font-bold font-display tracking-wide">{title}</h3>
      <p className="mb-6 flex-1 text-sm text-neutral-200">{description}</p>
      
      {href && (
        <Link 
          to={href} 
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {ctaText}
          <ChevronRight size={16} className="ml-1" />
        </Link>
      )}
    </Card>
  );
}
