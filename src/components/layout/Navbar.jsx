import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-700 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        
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
