import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

export function SkeletonCard({ className }) {
  return (
    <Card className={cn("p-6 flex flex-col gap-4", className)}>
      <div className="h-12 w-12 rounded-lg bg-neutral-800 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-5 w-1/2 rounded bg-neutral-800 animate-pulse"></div>
        <div className="h-4 w-3/4 rounded bg-neutral-800 animate-pulse"></div>
      </div>
      <div className="mt-4 h-8 w-24 rounded bg-neutral-800 animate-pulse"></div>
    </Card>
  );
}
