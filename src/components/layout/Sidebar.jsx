import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Logo } from './Logo';
import { 
  Home, 
  Compass, 
  Lightbulb, 
  MessageSquare, 
  Users, 
  Settings 
} from 'lucide-react';

export function Sidebar({ className }) {
  const navItems = [
    { label: 'Overview', icon: Home, href: '/home' },
    { label: 'Hackathons', icon: Compass, href: '/hackathons' },
    { label: 'Idea Validator', icon: Lightbulb, href: '/validator' },
    { label: 'Teaming', icon: Users, href: '/teaming' },
    { label: 'Mentors', icon: MessageSquare, href: '/mentors' },
  ];

  return (
    <aside className={cn("flex flex-col h-screen w-64 border-r border-neutral-700 bg-surface", className)}>
      <div className="flex h-16 items-center px-6 border-b border-neutral-700">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-neutral-200 hover:bg-neutral-800 hover:text-neutral-50"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-700">
        <NavLink
          to="/profile"
          className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive 
              ? "bg-primary/10 text-primary" 
              : "text-neutral-200 hover:bg-neutral-800 hover:text-neutral-50"
          )}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
