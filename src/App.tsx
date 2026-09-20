import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AgeGateModal } from './components/AgeGateModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { DiscoveryPage } from './components/DiscoveryPage';
import { ChatView } from './components/ChatView';
import { VirtualDatesView } from './components/VirtualDatesView';
import { CoupleDiaryView } from './components/CoupleDiaryView';
import { MemoriesView } from './components/MemoriesView';
import { FavoritesView } from './components/FavoritesView';
import { DashboardView } from './components/DashboardView';
import { AdminDashboard } from './components/AdminDashboard';
import { CharacterProfileModal } from './components/CharacterProfileModal';
import { PhotoStudioModal } from './components/PhotoStudioModal';
import { ReportModal } from './components/ReportModal';
import { ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0813] text-zinc-100 selection:bg-rose-600 selection:text-white font-sans antialiased">
      {/* Age Gate (Mandatory 18+) */}
      <AgeGateModal />

      {/* Auth Modal */}
      <AuthModal />

      {/* Profile, Photo, and Report Modals */}
      <CharacterProfileModal />
      <PhotoStudioModal />
      <ReportModal />

      {/* Navigation Bar */}
      <Navbar />

      {/* Active View Container */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'discovery' && <DiscoveryPage />}
        {activeView === 'chat' && <ChatView />}
        {activeView === 'virtual_dates' && <VirtualDatesView />}
        {activeView === 'diary' && <CoupleDiaryView />}
        {activeView === 'memories' && <MemoriesView />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Persistent Global Footer (shown on all views except full-height chat) */}
      {activeView !== 'chat' && (
        <footer className="border-t border-rose-950/40 bg-[#0d0917] py-8 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-serif font-bold tracking-widest text-rose-400">
                MONA
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-[11px] text-zinc-400">Meet Someone Who Understands You.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strictly 18+ Adult Platform</span>
              </span>
              <span className="text-zinc-600">•</span>
              <button
                onClick={() => setActiveView('admin')}
                className="hover:text-rose-400 transition cursor-pointer"
              >
                Admin Control
              </button>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500">Fictional AI Companions Only</span>
            </div>

            <div className="text-[11px] text-zinc-500">
              © {new Date().getFullYear()} MONA AI. All Rights Reserved. Non-explicit policy strictly enforced.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
