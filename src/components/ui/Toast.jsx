import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Toast({ 
  title, 
  description, 
  variant = 'info', 
  onClose,
  className 
}) {
  const variants = {
    success: 'bg-surface border-semantic-success/30 text-semantic-success',
    error: 'bg-surface border-semantic-danger/30 text-semantic-danger',
    info: 'bg-surface border-semantic-info/30 text-semantic-info',
  };

  const icons = {
    success: <CheckCircle size={20} className="text-semantic-success" />,
    error: <AlertCircle size={20} className="text-semantic-danger" />,
    info: <Info size={20} className="text-semantic-info" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border shadow-lg p-4",
        variants[variant],
        className
      )}
    >
      <div className="mr-3 mt-0.5">{icons[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold text-neutral-50">{title}</h4>}
        {description && <p className="mt-1 text-sm text-neutral-200">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 flex shrink-0 items-start text-neutral-200 hover:text-neutral-50"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}
