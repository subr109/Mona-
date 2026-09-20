import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  Camera,
  Heart,
  Globe2,
  Sparkles,
  CreditCard,
  RotateCcw,
  Check,
  CheckCircle2,
  Lock,
  LogOut,
  Bell,
  HelpCircle
} from 'lucide-react';
import { availableLanguages } from '../data/characters';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    updateUserPreferences,
    logout,
    credits,
    addCredits,
    conversations,
    clearConversation,
    companions
  } = useApp();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Alex Rivers');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');
  const [partnerPreference, setPartnerPreference] = useState(currentUser?.partnerGenderPreference || 'all');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({
      displayName,
      preferredLanguage,
      partnerGenderPreference: partnerPreference
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-rose-400" />
          <span>User Profile & Settings</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
          Account & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage your personal details, subscription plan, credits, and AI relationship settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-rose-950">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">{displayName}</h2>
            <p className="text-xs text-zinc-400">{currentUser?.email}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>18+ Verified Adult</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/50 font-medium">
                {currentUser?.role === 'admin' ? 'Administrator' : 'VIP Romantic Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Credits & Refill */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center sm:text-right space-y-1">
          <span className="text-[11px] text-zinc-400 block">Available Photo Credits:</span>
          <p className="text-2xl font-bold text-rose-300 font-mono">{credits} 📸</p>
          <button
            onClick={() => addCredits(50)}
            className="px-3 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-medium border border-rose-800/60 transition cursor-pointer"
          >
            Refill +50 Credits
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>Membership Tiers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Plan 1 */}
          <div className="p-5 rounded-2xl bg-[#14101d] border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400">Standard</span>
              <h4 className="text-lg font-serif font-bold text-white mt-1">Free Romantic</h4>
              <p className="text-2xl font-bold text-white mt-2">$0 <span className="text-xs text-zinc-400 font-normal">/ forever</span></p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 100 AI Companions</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Text Chat</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 50 Photo Credits</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Plan 2: VIP */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/60 to-[#14101e] border-2 border-rose-600/80 flex flex-col justify-between space-y-4 shadow-xl shadow-rose-950/40 relative">
            <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Romantic
            </span>
            <div>
              <span className="text-xs font-semibold text-rose-300">Popular</span>
              <h4 className="text-lg font-serif font-bold text-white mt-1">VIP Passion</h4>
              <p className="text-2xl font-bold text-white mt-2">$14.99 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-200">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-400" /> Everything in Free</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-400" /> 300 Photo Credits/mo</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-400" /> High-Resolution Images</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-400" /> Unlimited Text Conversations</li>
              </ul>
            </div>
            <button
              onClick={() => {
                addCredits(250);
                alert('Upgraded to VIP Passion! 250 bonus credits added.');
              }}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              Upgrade to VIP
            </button>
          </div>

          {/* Plan 3: Infinite */}
          <div className="p-5 rounded-2xl bg-[#14101d] border border-purple-900/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-purple-400">Prestige</span>
              <h4 className="text-lg font-serif font-bold text-white mt-1">Infinite Amour</h4>
              <p className="text-2xl font-bold text-white mt-2">$29.99 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Unlimited Photos</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Priority Gemini Latency</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Custom Character Creation</li>
              </ul>
            </div>
            <button
              onClick={() => {
                addCredits(999);
                alert('Upgraded to Infinite Amour! Unlimited credits enabled.');
              }}
              className="w-full py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-medium border border-purple-800 transition cursor-pointer"
            >
              Choose Infinite
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 shadow-xl space-y-4 text-xs">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-300 mb-2">
          Personal Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Your Name / Pet Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Preferred Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500"
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
          <label className="block text-zinc-300 font-medium mb-1">Companion Discovery Preference</label>
          <select
            value={partnerPreference}
            onChange={(e) => setPartnerPreference(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500"
          >
            <option value="all">Everyone (All 100 Companions)</option>
            <option value="female">Women Only (50 Companions)</option>
            <option value="male">Men Only (50 Companions)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400 text-[11px]">Changes are saved instantly to your session.</span>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium shadow transition cursor-pointer"
          >
            {savedSuccess ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </form>

      {/* Safety & Reset Actions */}
      <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 shadow-xl space-y-4 text-xs">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-300">
          Account & Privacy Controls
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div>
            <p className="font-semibold text-white">Reset All Conversation Histories</p>
            <p className="text-[11px] text-zinc-400">Permanently clears your messages with all 100 companions.</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all chat histories?')) {
                companions.forEach((c) => clearConversation(c.id));
                alert('Conversations cleared.');
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-rose-950/70 text-zinc-300 hover:text-rose-200 border border-zinc-700 transition cursor-pointer shrink-0"
          >
            Clear All Chats
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-zinc-500 text-[11px]">
            MONA is strictly 18+. All AI companions are fictional adults.
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 transition cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
