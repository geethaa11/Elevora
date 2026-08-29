import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  className 
}) {
  return (
    <Card className={cn('p-6', className)}>
      <p className="text-sm font-medium text-neutral-200">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold font-display">{value}</h3>
        {trend && (
          <span className={cn(
            "flex items-center text-xs font-medium",
            trendDirection === 'up' ? "text-semantic-success" : 
            trendDirection === 'down' ? "text-semantic-danger" : 
            "text-neutral-200"
          )}>
            {trendDirection === 'up' && <ArrowUpRight size={14} className="mr-0.5" />}
            {trendDirection === 'down' && <ArrowDownRight size={14} className="mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
