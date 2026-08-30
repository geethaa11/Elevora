import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/layout/Logo';
import { HeroBackground } from '../components/landing/HeroBackground';

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        setError('Network failure: Unable to connect to the server.');
      } else {
        setError(err.message || 'Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google.');
    }
  };

  const handleForgotPassword = () => {
    setToastMessage('Password reset is not yet configured for this demo.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative min-h-[100vh] w-full bg-[#0D0D0F] overflow-hidden flex flex-col md:flex-row font-sans text-neutral-50 selection:bg-primary/30">
      
      {/* 3D Background - Shifted to the left for desktop by making container wider and offsetting */}
      <div className="absolute inset-y-0 left-[-50%] right-[-50%] z-0 pointer-events-none md:left-[-30%] md:right-0 lg:left-[-20%] opacity-50 md:opacity-100">
        <HeroBackground />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 w-full p-6 lg:p-8 flex justify-between items-center z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Logo size="md" />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/">
            <Button 
              variant="ghost" 
              className="rounded-full border border-primary/30 hover:border-primary/80 hover:bg-primary/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] transition-all text-neutral-200 hover:text-primary gap-2 pl-3 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Left Column (Globe Space + Editorial) */}
      <div className="hidden md:flex md:w-[55%] lg:w-[60%] flex-col justify-between p-8 lg:p-12 z-10 pt-32">
        
        {/* Vertical Journey Rail */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-6 ml-4"
        >
          {['DISCOVER', 'VALIDATE', 'CONNECT', 'BUILD', 'ELEVATE'].map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <span className={`text-xs font-mono tracking-widest ${index === 0 ? 'text-primary' : 'text-neutral-600'}`}>
                0{index + 1}
              </span>
              <span className={`text-xs tracking-[0.2em] uppercase font-semibold ${index === 0 ? 'text-neutral-50' : 'text-neutral-600'}`}>
                {step}
              </span>
              {index === 0 && <div className="h-[1px] w-8 bg-primary ml-2" />}
            </div>
          ))}
        </motion.div>

        {/* Editorial Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-md pb-4"
        >
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent mb-6 rounded-full" />
          <h1 className="font-display text-4xl lg:text-5xl leading-tight text-neutral-200">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">AI</span> co-founder <br />
            for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">hackathon</span>.
          </h1>
          <p className="text-neutral-500 text-xs mt-8">© 2024 Elevora. All rights reserved.</p>
        </motion.div>
      </div>

      {/* Right Column (Login Card) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 z-10 w-full min-h-screen md:min-h-0 pt-24 md:pt-0">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <Card className="relative p-8 md:p-10 bg-[#1A1A1D]/80 backdrop-blur-xl border-[#2C2C34] shadow-[0_0_50px_rgba(184,134,11,0.05)] rounded-2xl overflow-hidden group">
            
            {/* Glowing border effects */}
            <div className="absolute inset-0 border border-primary/20 rounded-2xl pointer-events-none group-hover:border-primary/40 transition-colors duration-700" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            
            <div className="mb-8 text-center md:text-left">
              <h2 className="font-display text-3xl font-normal text-neutral-50 mb-2">Welcome back</h2>
              <p className="text-sm text-neutral-400">Enter your journey where you left off.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 ml-1">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-primary transition-colors" size={18} />
                  <Input 
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-[#111111] border-[#2C2C34] focus-visible:ring-primary/50 focus-visible:border-primary shadow-inner h-12"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 ml-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-primary transition-colors" size={18} />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#111111] border-[#2C2C34] focus-visible:ring-primary/50 focus-visible:border-primary shadow-inner h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs text-primary/80 hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                isLoading={loading}
                className="w-full h-12 mt-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold hover:shadow-[0_0_20px_rgba(184,134,11,0.4)] transition-all border-none"
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-[#2C2C34]" />
              <span className="text-xs text-neutral-500 font-medium">or continue with</span>
              <div className="h-[1px] flex-1 bg-[#2C2C34]" />
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="w-full h-11 flex items-center justify-center gap-3 bg-[#111111] border border-[#2C2C34] rounded-md text-sm font-medium text-white hover:border-primary/50 hover:bg-[#1A1A1D] transition-all group/btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              
              <button 
                type="button"
                disabled
                className="w-full h-11 flex items-center justify-center gap-3 bg-[#111111] border border-[#2C2C34] rounded-md text-sm font-medium text-neutral-500 cursor-not-allowed opacity-60"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="mt-8 text-center">
              <span className="text-sm text-neutral-400">
                New here?{' '}
                <Link to="/signup" className="text-primary hover:text-[#D4AF37] font-medium transition-colors">
                  Sign up
                </Link>
              </span>
            </div>

          </Card>
        </motion.div>
      </div>

      {/* Toast Notification for unimplemented features */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-[#1A1A1D] border border-primary/30 text-primary px-4 py-3 rounded shadow-lg z-50 text-sm"
        >
          {toastMessage}
        </motion.div>
      )}

    </div>
  );
}

// Ensure ArrowRight is used but was missing from imports, oops I will add it:
// I'll use a small SVG or import it. Wait, I imported `Mail, Lock, Eye, EyeOff, ArrowLeft` from lucide-react. Let me fix the import to include `ArrowRight`.
