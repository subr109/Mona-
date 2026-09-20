import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { virtualDateScenarios } from '../data/virtualDates';
import {
  CalendarHeart,
  Heart,
  Sparkles,
  Coffee,
  Utensils,
  Waves,
  Film,
  Compass,
  Music,
  ChefHat,
  Palette,
  MapPin,
  Send,
  Volume2,
  BookOpen,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { VirtualDateScenario } from '../types';

export const VirtualDatesView: React.FC = () => {
  const {
    selectedCompanionId,
    setSelectedCompanionId,
    companions,
    getCompanion,
    addDiaryEntry,
    currentUser
  } = useApp();

  const companion = getCompanion(selectedCompanionId || 'char_f_1');
  const [activeScenario, setActiveScenario] = useState<VirtualDateScenario | null>(null);
  const [dateChat, setDateChat] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([]);
  const [inputAction, setInputAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Icon mapping
  const getIcon = (name: string) => {
    switch (name) {
      case 'Coffee': return Coffee;
      case 'Utensils': return Utensils;
      case 'Waves': return Waves;
      case 'Film': return Film;
      case 'Compass': return Compass;
      case 'Music': return Music;
      case 'ChefHat': return ChefHat;
      case 'Palette': return Palette;
      default: return MapPin;
    }
  };

  const startDate = (scenario: VirtualDateScenario) => {
    setActiveScenario(scenario);
    setDateChat([
      {
        sender: 'ai',
        text: `Welcome to ${scenario.title}, ${currentUser?.displayName || 'darling'}. ${scenario.ambientPrompt} What would you like to do first? ❤️`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleDateAction = async (actionText: string) => {
    if (!actionText.trim() || !companion || !activeScenario || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat = [...dateChat, { sender: 'user' as const, text: actionText, time: userTime }];
    setDateChat(newChat);
    setInputAction('');
    setLoading(true);

    try {
      const res = await fetch('/api/virtual-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: companion,
          scenario: activeScenario,
          userAction: actionText,
          userName: currentUser?.displayName || 'Beloved',
          dateHistory: newChat
        })
      });

      const data = await res.json();
      const aiReply =
        data.reply ||
        `As you ${actionText.toLowerCase()}, my eyes meet yours. Being here with you is perfection. ❤️`;

      setDateChat((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Speak response with native Bengali/Hindi voice detection
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(aiReply);
        utterance.rate = 0.95;
        const hasBengali = /[\u0980-\u09FF]/.test(aiReply);
        const hasHindi = /[\u0900-\u097F]/.test(aiReply);
        if (hasBengali) {
          utterance.lang = 'bn-BD';
        } else if (hasHindi) {
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'en-US';
        }

        try {
          const voices = window.speechSynthesis.getVoices();
          if (hasBengali) {
            const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
            if (bnVoice) utterance.voice = bnVoice;
          } else if (hasHindi) {
            const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
            if (hiVoice) utterance.voice = hiVoice;
          }
        } catch (e) {
          // Fallback
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('Date action handled notice:', err);
      setDateChat((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Being here with you is all that matters to me, ${currentUser?.displayName || 'my love'}. ❤️`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = () => {
    if (!activeScenario || !companion) return;
    addDiaryEntry({
      companionId: companion.id,
      companionName: companion.name,
      companionAvatar: companion.thumbnailUrl,
      title: `${activeScenario.title} with ${companion.name}`,
      summary: `We spent an enchanting evening at ${activeScenario.location}. We shared intimate moments, held hands, and enjoyed the romantic atmosphere together.`,
      imageUrl: activeScenario.bgImageUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Date Header */}
      {!activeScenario ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-800/40 text-pink-300 text-xs font-semibold mb-2">
                <CalendarHeart className="w-3.5 h-3.5 text-pink-400" />
                <span>9 Curated Romantic Settings</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
                Virtual Date Experiences
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Choose a scenic backdrop to share an unforgettable romantic evening with your companion.
              </p>
            </div>

            {/* Companion selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-zinc-900/90 p-2 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-medium">Date Partner:</span>
              <select
                value={selectedCompanionId || 'char_f_1'}
                onChange={(e) => setSelectedCompanionId(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-rose-500 font-medium text-xs"
              >
                {companions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 9 Scenarios Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {virtualDateScenarios.map((scenario) => {
              const Icon = getIcon(scenario.iconName);
              return (
                <div
                  key={scenario.id}
                  onClick={() => startDate(scenario)}
                  className="group relative rounded-2xl overflow-hidden bg-[#151120] border border-pink-950/60 hover:border-pink-500/60 transition-all duration-300 shadow-lg hover:shadow-pink-950/40 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={scenario.bgImageUrl}
                      alt={scenario.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151120] via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-white border border-white/10 font-medium">
                      <Icon className="w-3.5 h-3.5 text-pink-400" />
                      <span>{scenario.location}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#130f1d]">
                    <div>
                      <h3 className="text-base font-serif font-bold text-white group-hover:text-pink-300 transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>

                    <button
                      className="w-full py-2 rounded-xl bg-pink-950/80 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 text-pink-200 group-hover:text-white text-xs font-semibold border border-pink-800/60 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarHeart className="w-3.5 h-3.5" />
                      <span>Invite {companion?.name || 'Companion'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Active Virtual Date Interactive Screen */
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-rose-900/50 bg-[#120e1b] shadow-2xl flex flex-col h-[calc(100vh-8rem)] animate-in fade-in">
          {/* Active Date Header */}
          <div className="p-4 border-b border-rose-950/40 bg-[#161122] flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveScenario(null)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Leave Date</span>
            </button>

            <div className="text-center">
              <h2 className="text-sm sm:text-base font-serif font-bold text-white">
                {activeScenario.title}
              </h2>
              <p className="text-[11px] text-pink-300">
                With {companion?.name} • {activeScenario.location}
              </p>
            </div>

            <button
              onClick={handleSaveToDiary}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-medium border border-rose-800/60 flex items-center gap-1.5 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Save to Diary</span>
                </>
              )}
            </button>
          </div>

          {/* Date Scenic Backdrop & Ambient Atmosphere */}
          <div className="relative h-40 sm:h-48 w-full overflow-hidden shrink-0">
            <img
              src={activeScenario.bgImageUrl}
              alt={activeScenario.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120e1b] via-[#120e1b]/40 to-black/40" />

            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-500 shadow-md">
                  <img
                    src={companion?.profileImageUrl}
                    alt={companion?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{companion?.name}</p>
                  <p className="text-[11px] text-zinc-300 max-w-md line-clamp-1 italic">
                    "{activeScenario.ambientPrompt.slice(0, 75)}..."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation stream during date */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#110d18]">
            {dateChat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-800/60 shrink-0 mt-1">
                    <img
                      src={companion?.thumbnailUrl}
                      alt={companion?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-rose-700 text-white rounded-br-xs'
                      : 'bg-[#1b1526] text-zinc-200 border border-rose-950/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block mt-1 text-[10px] opacity-60 text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 p-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-400" />
                <span>{companion?.name} is responding to you...</span>
              </div>
            )}
          </div>

          {/* Suggested Romantic Actions */}
          <div className="p-2.5 bg-[#161122] border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold shrink-0">
              Romantic Actions:
            </span>
            {activeScenario.romanticActions.map((act, i) => (
              <button
                key={i}
                onClick={() => handleDateAction(act)}
                className="px-2.5 py-1 rounded-full bg-pink-950/60 hover:bg-pink-900 border border-pink-800/50 text-[11px] text-pink-200 shrink-0 transition cursor-pointer"
              >
                {act}
              </button>
            ))}
          </div>

          {/* Date Input Box */}
          <div className="p-3 bg-[#130f1c] border-t border-rose-950/40 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputAction}
              onChange={(e) => setInputAction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDateAction(inputAction);
                }
              }}
              placeholder={`Say or do something in Bengali (বাংলা), Hindi (हिंदी), English, or mix with ${companion?.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={() => handleDateAction(inputAction)}
              disabled={!inputAction.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 text-white transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
