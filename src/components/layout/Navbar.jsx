import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', isHash: true, id: 'home' },
    { label: 'Hackathons', path: '/hackathons', isHash: false },
    { label: 'Team Builder', path: '/team-builder', isHash: false },
    { label: 'Mentors', path: '/mentors', isHash: false },
  ];

  const handleNavClick = (e, link) => {
    if (isHome && link.isHash && link.id) {
      e.preventDefault();
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled || !isHome
          ? "border-b border-neutral-800 bg-[#0D0D0F]/90 backdrop-blur-md py-3 shadow-xl" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#FDE08B] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="font-display text-xl font-black tracking-widest text-neutral-50 group-hover:text-primary transition-colors">
              ELEVORA
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary font-semibold" : "text-neutral-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <Link to="/home">
                <Button variant="ghost" className="text-neutral-200 hover:text-white">
                  Dashboard
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => logout()} className="border-neutral-700">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-neutral-300 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm" className="rounded-full px-5 font-semibold bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black border-none shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:opacity-95">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#0D0D0F]/95 backdrop-blur-xl px-4 pt-3 pb-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className="text-base font-medium text-neutral-200 hover:text-primary py-2 border-b border-neutral-800/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {currentUser ? (
              <>
                <Link to="/home" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-center">
                    Login
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full text-center bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
