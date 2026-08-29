import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/Input';

export function TopBar({ onMenuClick, className }) {
  const { currentUser } = useAuth();

  return (
    <header className={cn("flex h-16 items-center justify-between border-b border-neutral-700 bg-surface/50 backdrop-blur-sm px-4 sm:px-6", className)}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-neutral-200 hover:text-neutral-50 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex max-w-md w-full relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search hackathons, mentors..." 
            className="pl-9 h-9 bg-neutral-900 border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-neutral-200 hover:text-neutral-50">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-semantic-danger"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-neutral-700">
          <div className="h-8 w-8 rounded-full bg-ai-gradient flex items-center justify-center font-bold text-sm text-white">
            {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium hidden sm:block">
            {currentUser?.displayName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
