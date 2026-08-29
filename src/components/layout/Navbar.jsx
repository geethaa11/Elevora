import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Features', id: 'discover' },
    { label: 'How It Works', id: 'build' },
    { label: 'For Students', id: 'grow' },
    { label: 'Mentors', id: 'mentors' },
    { label: 'About Us', id: 'home' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300",
        scrolled 
          ? "border-b border-neutral-700 bg-background/80 backdrop-blur-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        
        {/* Center Links (Desktop only) */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-medium text-neutral-200 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link to="/home">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="secondary" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
