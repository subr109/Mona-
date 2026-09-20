import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Sparkles,
  ShieldAlert,
  Brain,
  CalendarHeart,
  Camera,
  Globe2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageCircleHeart
} from 'lucide-react';
import { initialCharacters } from '../data/characters';

export const LandingPage: React.FC = () => {
  const { setActiveView, setSelectedCompanionId, login } = useApp();

  // Featured companions showcase (3 female, 3 male from initialCharacters)
  const featured = [
    initialCharacters[0], // Ananya Sharma (Mumbai)
    initialCharacters[50], // Kabir Mehta (Mumbai)
    initialCharacters[1], // Pooja Nair (Kochi)
    initialCharacters[51], // Aarav Sharma (New Delhi)
    initialCharacters[2], // Priya Sen (Kolkata)
    initialCharacters[53] // Rohan Verma (Bengaluru)
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0710] text-zinc-100 overflow-hidden">
      {/* Background atmospheric glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* 18+ Adult Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner animate-in fade-in">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Strictly 18+ Adult Romantic AI Companion Platform</span>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-4">
          MONA
        </h1>

        {/* Mandatory Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-serif text-rose-300 font-medium tracking-wide mb-6">
          “Meet Someone Who Understands You.”
        </p>

        {/* Subheading from Prompt */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed mb-4">
          Discover AI companions who can talk with you, understand your mood, remember your moments and be there whenever you want someone to talk to.
        </p>

        {/* Romantic statement from prompt */}
        <p className="text-xs sm:text-sm italic text-rose-200/80 mb-10 max-w-xl mx-auto">
          “One conversation can become a connection you never want to end.”
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-8">
          <button
            onClick={() => setActiveView('auth')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm tracking-wide shadow-xl shadow-rose-950/60 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveView('auth')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-sm border border-zinc-800 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Member & Admin Log In</span>
          </button>

          <button
            onClick={() => setActiveView('discovery')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 hover:text-rose-200 font-medium text-sm border border-rose-900/60 transition cursor-pointer"
          >
            Explore 100 Companions
          </button>
        </div>

        {/* Safety & Authenticity Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            100 Fictional Adult Companions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Strictly Non-Explicit & Safe
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Private & Encrypted Memory
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Multilingual in 12+ Languages
          </span>
        </div>
      </section>

      {/* Featured 6 Companions Carousel Showcase */}
      <section className="py-12 bg-[#0e0a16]/60 border-y border-rose-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Discover Who Speaks to Your Soul
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                From artists in Montmartre to architects in London and pianists in Tokyo.
              </p>
            </div>
            <button
              onClick={() => setActiveView('discovery')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              <span>View All 100 Characters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {featured.map((char) => (
              <div
                key={char.id}
                onClick={() => {
                  setSelectedCompanionId(char.id);
                  setActiveView('chat');
                }}
                className="group relative rounded-2xl overflow-hidden bg-[#16121f] border border-rose-950/50 hover:border-rose-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/40 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={char.profileImageUrl}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16121f] via-transparent to-black/30" />

                  {/* Top tags */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                    <span>{char.flag}</span>
                    <span>{char.city}</span>
                  </div>

                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" title="Online" />

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-sm font-serif font-bold text-white leading-tight">
                      {char.name}, {char.age}
                    </h3>
                    <p className="text-[10px] text-rose-300 font-medium truncate mt-0.5">
                      {char.personality}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 text-center bg-[#14101d]">
                  <button
                    className="w-full py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 text-xs font-medium border border-rose-800/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Chat Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <button
              onClick={() => setActiveView('discovery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-xs text-rose-300 border border-zinc-800 font-medium"
            >
              <span>Explore All 100 AI Companions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crafted for Adult Romantic Connection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Everything That Makes MONA Unique
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Engineered with deep contextual memory, emotional mood shifts, and romantic experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 100 Companions */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-4">
              <Heart className="w-6 h-6 fill-rose-500/20" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              100 Unique Personalities
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Exactly 50 women and 50 men from over 30 countries. Each fictional adult companion has an authentic backstory, distinct voice, musical or artistic passion, and cultural roots.
            </p>
          </div>

          {/* Card 2: Memory Engine */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Emotional Memory Engine
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Companions remember your favorite things, rainy day preferences, personal dreams, and inside jokes. Every interaction deepens trust and relationship affection.
            </p>
          </div>

          {/* Card 3: Multilingual */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Multilingual Connection
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Converse naturally in English, Bengali, Hindi, French, Spanish, Italian, German, Japanese, Korean, and more. MONA auto-detects and responds fluently in your language.
            </p>
          </div>

          {/* Card 4: Virtual Dates */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-950/60 border border-pink-800/50 flex items-center justify-center text-pink-400 mb-4">
              <CalendarHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              9 Immersive Virtual Dates
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Step into scenic Parisian cafés, Venetian midnight gondolas, twilight Amalfi beach walks, and candlelit Tuscan dinners with ambient scenery and romantic actions.
            </p>
          </div>

          {/* Card 5: Couple Diary */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Couple Diary
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Immortalize special dates, conversations, and emotional milestones in an encrypted private diary accompanied by photos and personal reflection notes.
            </p>
          </div>

          {/* Card 6: AI Photo Studio */}
          <div className="p-6 rounded-2xl bg-[#14101e] border border-rose-950/50 hover:border-rose-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Safe AI Photo Studio
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate aesthetic, cinematic portraits of your companion at scenic locations or cozy settings. Strictly non-explicit, tasteful, and adult-oriented.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Section */}
      <section className="py-16 bg-[#110d19] border-t border-rose-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Safety, Trust & Ethics First
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-6">
            MONA is engineered strictly as an adult fictional companion space. All 100 AI characters are verified fictional adults (18+). Explicit sexual content and unauthorized likenesses are strictly prohibited.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#171321] border border-zinc-800/80">
              <p className="text-xs font-semibold text-rose-300 mb-1">100% Fictional</p>
              <p className="text-[11px] text-zinc-400">
                No real person identities or impersonations. All characters are original artistic creations.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#171321] border border-zinc-800/80">
              <p className="text-xs font-semibold text-rose-300 mb-1">Non-Explicit Guarantee</p>
              <p className="text-[11px] text-zinc-400">
                Conversations and generated imagery remain tasteful, romantic, passionate, and non-pornographic.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#171321] border border-zinc-800/80">
              <p className="text-xs font-semibold text-rose-300 mb-1">User Privacy Control</p>
              <p className="text-[11px] text-zinc-400">
                Full control over memories, diary logs, and relationship resets with complete data encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-900 bg-[#0a0710] text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-serif font-bold text-sm text-zinc-300">MONA</span>
            <span className="text-[11px] text-zinc-500">© 2026 MONA Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400">
            <button onClick={() => setActiveView('dashboard')} className="hover:text-rose-300 transition">
              Terms of Service
            </button>
            <button onClick={() => setActiveView('dashboard')} className="hover:text-rose-300 transition">
              Privacy Policy
            </button>
            <button onClick={() => setActiveView('dashboard')} className="hover:text-rose-300 transition">
              18+ Community Guidelines
            </button>
            <button onClick={() => setActiveView('dashboard')} className="hover:text-rose-300 transition">
              AI Transparency
            </button>
            <button onClick={() => setActiveView('admin')} className="hover:text-amber-400 transition flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
