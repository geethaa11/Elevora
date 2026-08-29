import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function TagInput({ value = [], onChange, placeholder = "Add tag...", className }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div 
      className={cn(
        'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-neutral-700 bg-surface px-3 py-2 text-sm',
        'focus-within:ring-1 focus-within:ring-primary focus-within:border-primary',
        className
      )}
    >
      {value.map((tag, i) => (
        <span 
          key={i} 
          className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-50"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-neutral-200 hover:text-white focus:outline-none"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent text-neutral-50 outline-none placeholder:text-neutral-200/50 min-w-[80px]"
      />
    </div>
  );
}
