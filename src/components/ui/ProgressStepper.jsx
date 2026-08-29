import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export function ProgressStepper({ steps, currentStep, className }) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <React.Fragment key={index}>
            <div className="relative flex flex-col items-center">
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted ? "border-primary bg-primary text-neutral-900" :
                  isCurrent ? "border-primary text-primary bg-surface" :
                  "border-neutral-700 text-neutral-200 bg-surface"
                )}
              >
                {isCompleted ? <Check size={16} /> : (index + 1)}
              </div>
              <span 
                className={cn(
                  "absolute top-10 w-max text-xs font-medium",
                  (isCompleted || isCurrent) ? "text-primary" : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 px-4 mb-5">
                <div 
                  className={cn(
                    "h-0.5 w-full transition-colors",
                    index < currentStep ? "bg-primary" : "bg-neutral-700"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
