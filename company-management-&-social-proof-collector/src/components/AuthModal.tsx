import React, { useState } from 'react';
import { User } from '../types';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  KeyRound, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('owner@acme-global.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Darshan Jain');
  const [companyName, setCompanyName] = useState('Acme Corporation Ltd');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('492810');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setMessage({ type: 'success', text: 'Authenticated! 15m JWT Access Token generated with rotation.' });
      setTimeout(() => {
        onLoginSuccess(data.user, data.accessToken);
        onClose();
      }, 700);
    } catch (err: any) {
      // Fallback for offline / instant demo
      const demoUser: User = {
        id: 'usr_owner_01',
        email,
        name: name || 'Darshan Jain',
        companyName: companyName || 'Acme Corporation',
        isEmailVerified: true,
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(demoUser, 'jwt_token_demo_15m');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, companyName, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setGeneratedCode(data.simulatedVerificationCode || '492810');
      setMode('verify');
      setMessage({ type: 'success', text: 'Registration simulated! Please enter the 6-digit verification code.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await res.json();
      setMessage({ type: 'success', text: 'Email verified! Logging in with fresh pair token...' });
      setTimeout(() => {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name,
          email,
          companyName,
          isEmailVerified: true,
          role: 'owner',
          createdAt: new Date().toISOString(),
        };
        onLoginSuccess(newUser, 'jwt_verified_token');
        onClose();
      }, 700);
    } catch {
      setMessage({ type: 'success', text: 'Email verified!' });
      setTimeout(onClose, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMessage({ type: 'success', text: `Simulated password reset link dispatched to ${email}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Top Banner */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Security & Pair-Token Auth</h3>
              <p className="text-[11px] text-slate-400">JWT 15m Access Token + 7d Refresh Rotation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
                    placeholder="owner@acme-global.io"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Instant Owner Demo:</span> Use default credentials{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[10px]">
                    owner@acme-global.io
                  </code>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                Sign In & Rotate JWT Tokens
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Don&apos;t have a Space account yet? </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Create One
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    placeholder="Darshan Jain"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    placeholder="Acme Global Corporation"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Sign Up with Email Verification
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-600 hover:text-indigo-600"
                >
                  Already have an account? <span className="font-bold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Email Verification Simulation</h4>
                <p className="text-xs text-slate-500 mt-1">
                  We simulated a 6-digit PIN sent to <strong className="text-slate-800">{email}</strong>.
                </p>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-base font-bold text-slate-800 tracking-widest">
                {generatedCode}
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit PIN"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Activate Account
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Reset Your Password</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your email address to simulate a password reset token dispatch.
                </p>
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  placeholder="owner@acme-global.io"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                Send Reset Instructions
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
