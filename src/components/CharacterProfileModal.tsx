import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircleHeart,
  CalendarHeart,
  Camera,
  X,
  ShieldCheck,
  Globe2,
  Sparkles,
  MapPin,
  Volume2,
  Flag,
  User,
  Music,
  Smile,
  Shield,
  Brain,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { RelationshipStage } from '../types';

const STAGES: { stage: RelationshipStage; label: string; desc: string }[] = [
  { stage: 'Stranger', label: 'Stranger', desc: 'First meeting, polite greetings' },
  { stage: 'Acquaintance', label: 'Acquaintance', desc: 'Exchanging everyday thoughts' },
  { stage: 'Friend', label: 'Friend', desc: 'Mutual comfort, casual laughs' },
  { stage: 'Close Friend', label: 'Close Friend', desc: 'Emotional support, inside jokes' },
  { stage: 'Deep Relationship', label: 'Deep Connection', desc: 'Unshakable trust, shared secrets' },
  { stage: 'Romantic Relationship', label: 'Romantic Partner', desc: 'Earned romantic intimacy' }
];

export const CharacterProfileModal: React.FC = () => {
  const {
    selectedCompanionId,
    getCompanion,
    profileModalOpen,
    setProfileModalOpen,
    setActiveView,
    setPhotoModalOpen,
    isFavorite,
    toggleFavorite,
    setReportModalOpen,
    setReportingTarget,
    getRelationshipProgress,
    memories
  } = useApp();

  if (!profileModalOpen || !selectedCompanionId) return null;

  const character = getCompanion(selectedCompanionId);
  if (!character) return null;

  const favorited = isFavorite(character.id);
  const progress = getRelationshipProgress(character.id);

  const speakQuote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(character.quote);
      utterance.rate = 0.95;
      utterance.pitch = character.gender === 'female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-rose-900/40 bg-[#14101f] shadow-2xl overflow-hidden my-auto text-left">
        {/* Close button */}
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner with Character Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
          <img
            src={character.profileImageUrl}
            alt={character.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14101f] via-[#14101f]/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-white border border-white/15">
              <span>{character.flag}</span>
              <span>{character.city}, {character.country}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 backdrop-blur-md text-xs text-rose-300 border border-rose-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Adult 18+ (Fictional)</span>
            </div>
          </div>

          {/* Character Identity on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                  {character.name}, {character.age}
                </h1>
                <button
                  onClick={speakQuote}
                  className="p-1.5 rounded-full bg-rose-950/80 text-rose-300 hover:text-white border border-rose-800/60 transition cursor-pointer"
                  title="Listen to quote"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-rose-300 font-medium mt-0.5">
                {character.personality}
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(character.id)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition cursor-pointer ${
                favorited
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg'
                  : 'bg-black/60 text-zinc-300 border-white/20 hover:text-white'
              }`}
              title={favorited ? 'Favorited' : 'Add to Favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[55vh] overflow-y-auto">
          {/* Quote & Current Mood Banner */}
          <div className="p-4 rounded-xl bg-[#1b1528] border border-rose-950/70 relative">
            <p className="text-sm font-serif italic text-rose-200 text-center">
              “{character.quote}”
            </p>
            <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-rose-400" />
                <span>Current Fictional Mood:</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 font-semibold border border-rose-800/50">
                {character.mood}
              </span>
            </div>
          </div>

          {/* REALISTIC RELATIONSHIP JOURNEY DASHBOARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1b1429] to-[#151022] border border-rose-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-200">
                  Relationship Journey
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/50">
                Current: {progress.stage}
              </span>
            </div>

            {/* 6-Stage Natural Progression Bar */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-6 gap-1">
                {STAGES.map((s, idx) => {
                  const currentStageIdx = STAGES.findIndex((st) => st.stage === progress.stage);
                  const isCurrent = s.stage === progress.stage;
                  const isPassed = currentStageIdx >= 0 && idx <= currentStageIdx;
                  return (
                    <div
                      key={s.stage}
                      className="flex flex-col items-center group relative"
                      title={`${s.label}: ${s.desc}`}
                    >
                      <div
                        className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                          isCurrent
                            ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                            : isPassed
                            ? 'bg-rose-800/80'
                            : 'bg-zinc-800'
                        }`}
                      />
                      <span
                        className={`text-[9px] mt-1 text-center font-medium truncate w-full ${
                          isCurrent
                            ? 'text-rose-300 font-bold'
                            : isPassed
                            ? 'text-zinc-400'
                            : 'text-zinc-600'
                        }`}
                      >
                        {s.label.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-400 italic text-center pt-1">
                {STAGES.find((s) => s.stage === progress.stage)?.desc || 'Growing naturally over time'}
              </p>
            </div>

            {/* Metrics Breakdown: Trust, Familiarity, Warmth, Interactions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wide">Trust</div>
                <div className="text-sm font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{progress.trust ?? 10}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress.trust ?? 10}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wide">Familiarity</div>
                <div className="text-sm font-bold text-blue-300 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{progress.familiarity ?? 0}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress.familiarity ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wide">Affection</div>
                <div className="text-sm font-bold text-rose-300 flex items-center gap-1 mt-0.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{progress.affection ?? 0}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress.affection ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wide">Meaningful</div>
                <div className="text-sm font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{progress.meaningfulInteractions ?? 0}</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Deep moments</div>
              </div>
            </div>

            {/* Character's Internal Perception */}
            {progress.perceptionSummary && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/30 text-xs">
                <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wide block mb-1">
                  How {character.name} perceives you:
                </span>
                <p className="text-zinc-300 italic">
                  "{progress.perceptionSummary}"
                </p>
              </div>
            )}

            {/* Boundary Principle Banner */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>
                Relationship progression develops through trust and natural conversations. Romance unfolds only if naturally developed.
              </span>
            </div>
          </div>

          {/* SHARED MEMORIES & EMOTIONAL CONTEXT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Shared Memories & Preferences ({memories.filter((m) => m.companionId === character.id).length})</span>
              </h3>
            </div>

            {memories.filter((m) => m.companionId === character.id).length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center">
                No memories recorded yet. Chat naturally to share your hobbies, stories, and thoughts.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {memories
                  .filter((m) => m.companionId === character.id)
                  .map((mem) => (
                    <div
                      key={mem.id}
                      className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="text-zinc-200">{mem.memoryText}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <span className="capitalize px-1.5 py-0.5 rounded bg-zinc-800 text-rose-300 font-mono">
                            {mem.category}
                          </span>
                          {mem.detectedEmotion && (
                            <span className="text-zinc-400 italic">
                              emotion: {mem.detectedEmotion}
                            </span>
                          )}
                          <span>{mem.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Biography & Backstory */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Biography & Story
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {character.biography}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              {character.backstory}
            </p>
          </div>

          {/* Interests & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Languages</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {character.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-rose-400" />
                <span>Passions & Interests</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {character.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-200 text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Communication & Relationship Styles */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
            <div>
              <span className="text-zinc-400">Communication Style: </span>
              <span className="text-zinc-200">{character.communicationStyle}</span>
            </div>
            <div>
              <span className="text-zinc-400">Relationship Style: </span>
              <span className="text-zinc-200">{character.relationshipStyle}</span>
            </div>
            <div>
              <span className="text-zinc-400">Visual Aesthetic: </span>
              <span className="text-zinc-300 italic">{character.visualIdentity.fashionStyle}</span>
            </div>
          </div>

          {/* Report link */}
          <div className="pt-2 text-right">
            <button
              onClick={() => {
                setReportingTarget({ type: 'companion', id: character.id });
                setReportModalOpen(true);
              }}
              className="text-[11px] text-zinc-500 hover:text-rose-400 transition cursor-pointer inline-flex items-center gap-1"
            >
              <Flag className="w-3 h-3" />
              <span>Report Companion</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#0e0a15] grid grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={() => {
              setProfileModalOpen(false);
              setActiveView('chat');
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs tracking-wide shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageCircleHeart className="w-4 h-4 fill-white/30" />
            <span>Start Chat</span>
          </button>

          <button
            onClick={() => {
              setProfileModalOpen(false);
              setActiveView('virtual_dates');
            }}
            className="py-2.5 px-3 rounded-xl bg-pink-950/60 hover:bg-pink-900/70 border border-pink-800/60 text-pink-200 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CalendarHeart className="w-4 h-4 text-pink-400" />
            <span>Virtual Date</span>
          </button>

          <button
            onClick={() => {
              setProfileModalOpen(false);
              setActiveView('photos');
              setPhotoModalOpen(true);
            }}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-rose-400" />
            <span>Photo Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
