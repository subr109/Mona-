import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Lock, Mail, User, Globe2, ShieldAlert, Sparkles, ShieldCheck, X } from 'lucide-react';
import { availableLanguages } from '../data/characters';

export const AuthModal: React.FC = () => {
  const { login, register, activeView, setActiveView } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [partnerPreference, setPartnerPreference] = useState<'female' | 'male' | 'all'>('all');
  const [agree18, setAgree18] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!agree18) {
      setError('You must confirm you are at least 18 years old to use MONA.');
      return;
    }
    setError('');
    const res = register({
      displayName,
      email,
      password,
      preferredLanguage,
      partnerGenderPreference: partnerPreference
    });
    if (!res.success) {
      setError(res.error || 'Registration could not be completed.');
    }
  };

  if (activeView !== 'auth') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-900/40 bg-[#14101e] p-6 sm:p-7 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={() => setActiveView('landing')}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-950/50">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              {tab === 'login' ? 'Welcome Back to MONA' : 'Create Your MONA Account'}
            </h2>
            <p className="text-[11px] text-rose-300">
              Meet Someone Who Understands You
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-zinc-900/90 p-1 mb-5 border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition text-center cursor-pointer ${
              tab === 'login'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition text-center cursor-pointer ${
              tab === 'register'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account (18+)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Admin Access Info */}
        <div className="mb-5 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-medium">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Platform Administrator Portal
            </span>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setEmail('sroy22000@gmail.com');
                setPassword('admin@123');
                setError('');
              }}
              className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Fill Admin ID
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">
            Admin ID: <span className="text-amber-200 font-mono select-all">sroy22000@gmail.com</span>
          </p>
        </div>

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs tracking-wide shadow-md shadow-rose-950/50 transition cursor-pointer"
            >
              Log In to MONA
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Your Name / Nickname</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should companions call you?"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Preferred Language</label>
                <div className="relative">
                  <Globe2 className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500 text-xs"
                  >
                    {availableLanguages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Looking For</label>
                <select
                  value={partnerPreference}
                  onChange={(e) => setPartnerPreference(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500 text-xs"
                >
                  <option value="all">Everyone (All 100)</option>
                  <option value="female">Women (50 AI Companions)</option>
                  <option value="male">Men (50 AI Companions)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-start gap-2">
              <input
                id="check-18-auth"
                type="checkbox"
                checked={agree18}
                onChange={(e) => setAgree18(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="check-18-auth" className="text-[11px] text-zinc-400 cursor-pointer leading-tight">
                I certify that I am at least 18 years old, and accept the MONA adult terms & non-explicit safety policies.
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs tracking-wide shadow-md shadow-rose-950/50 transition cursor-pointer"
            >
              Complete Registration (50 Free Credits)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
