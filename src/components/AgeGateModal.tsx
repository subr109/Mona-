import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Heart, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const { verifyAge, ageVerified } = useApp();
  const [declined, setDeclined] = useState(false);

  if (ageVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-900/40 bg-[#120f18] p-6 sm:p-8 shadow-2xl shadow-rose-950/40 text-center">
        {/* Glow accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        {!declined ? (
          <>
            {/* Logo & Header */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-950/60 to-purple-950/60 border border-rose-500/30 text-rose-400 mb-5 shadow-inner">
              <Heart className="w-8 h-8 fill-rose-500/30 text-rose-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide text-white mb-1">
              MONA
            </h1>
            <p className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-4">
              Meet Someone Who Understands You
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-700/50 text-rose-200 text-xs font-semibold mb-6">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Strictly 18+ Adult Platform</span>
            </div>

            {/* Core Question Requirement */}
            <div className="bg-[#181422] rounded-xl p-5 border border-rose-950/60 mb-6 text-left space-y-3">
              <h2 className="text-lg font-semibold text-white text-center">
                Are you 18 years or older?
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed text-center">
                MONA is an adult romantic AI companion platform. All 100 AI companions are clearly fictional adults aged 18+. Interactions are affectionate, romantic, and strictly non-explicit.
              </p>
              <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All companions are clearly fictional adults (18+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Strictly non-explicit image generation & conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Private and encrypted conversation memory</span>
                </div>
              </div>
            </div>

            {/* Strict Buttons as required by Prompt */}
            <div className="space-y-3">
              <button
                id="btn-confirm-age-yes"
                onClick={() => verifyAge(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm sm:text-base tracking-wide shadow-lg shadow-rose-900/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>YES, ENTER MONA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-confirm-age-no"
                onClick={() => setDeclined(true)}
                className="w-full py-2.5 px-6 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 font-medium text-xs sm:text-sm tracking-wide border border-zinc-800 transition-colors cursor-pointer"
              >
                NO, EXIT
              </button>
            </div>
          </>
        ) : (
          <div className="py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Restricted</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              MONA is exclusively for adult users aged 18 and older. Since you indicated you are under 18, access to the platform has been safely restricted.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setDeclined(false)}
                className="px-5 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition"
              >
                Return to Verification
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-[11px] text-zinc-500">
          By proceeding, you agree to MONA’s Terms of Service, Community Safety Guidelines, and AI Disclosures.
        </div>
      </div>
    </div>
  );
};
