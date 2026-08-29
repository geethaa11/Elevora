import React from 'react';
import { Card } from '../components/ui/Card';

export function FeaturePlaceholder({ title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center space-y-4">
      <Card className="max-w-md w-full p-8 border-primary/20 bg-surface/50 backdrop-blur-sm">
        <h1 className="text-3xl font-bold font-display text-ai-gradient mb-4">{title}</h1>
        <p className="text-neutral-200">{description}</p>
        <div className="mt-8 text-sm text-neutral-400">
          This feature is part of a later phase.
        </div>
      </Card>
    </div>
  );
}
