import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Sparkles,
  MessageCircleHeart,
  CalendarHeart,
  BookOpen,
  Brain,
  Camera,
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    logout,
    favorites,
    credits,
    login,
    setPhotoModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'discovery', label: 'Companions', icon: Heart, badge: '100' },
    { id: 'favorites', label: 'Favorites', icon: Sparkles, badge: favorites.length > 0 ? String(favorites.length) : null },
    { id: 'chat', label: 'Chat', icon: MessageCircleHeart },
    { id: 'virtual_dates', label: 'Dates', icon: CalendarHeart },
    { id: 'diary', label: 'Diary', icon: BookOpen },
    { id: 'memories', label: 'Memories', icon: Brain },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'dashboard', label: 'Dashboard', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-950/40 bg-[#0e0b14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveView(currentUser ? 'discovery' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-700 flex items-center justify-center text-white shadow-md shadow-rose-950/60 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-wider text-white group-hover:text-rose-200 transition-colors">
                MONA
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-rose-950 text-rose-300 border border-rose-800/60">
                18+
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-zinc-400 tracking-wider">
              Meet Someone Who Understands You
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-rose-950/70 text-rose-200 border border-rose-800/50 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/80 text-rose-200 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-950/80 text-amber-200 border-amber-600'
                  : 'bg-amber-950/30 text-amber-300 border-amber-800/60 hover:bg-amber-950/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* User / Credits / Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Photo credits badge */}
              <button
                onClick={() => {
                  setActiveView('photos');
                  setPhotoModalOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-950/80 to-purple-950/80 border border-rose-800/40 text-rose-300 hover:text-rose-100 text-xs font-medium shadow-inner transition cursor-pointer"
                title="Your Photo Generation Credits"
              >
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>{credits} Credits</span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-medium max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-[#16121f] p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                      <p className="font-semibold text-white">{currentUser.displayName}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                        <span>{currentUser.role === 'admin' ? 'Platform Administrator' : '18+ Member'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('dashboard')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/70 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-rose-400" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => setActiveView('photos')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/70 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-rose-400" />
                      <span>Photo Studio ({credits} credits)</span>
                    </button>

                    {/* Admin Dashboard link for authorized administrators */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setActiveView('admin')}
                        className="w-full text-left px-3 py-2 rounded-lg bg-amber-950/30 hover:bg-amber-950/60 text-amber-300 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="pt-1 border-t border-zinc-800/80">
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('auth')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => setActiveView('auth')}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md shadow-rose-950/50 transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800/80 bg-[#120e1a] p-4 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-800/60'
                      : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-rose-400" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/80 text-rose-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Enter Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
