import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Send,
  Volume2,
  Copy,
  RefreshCw,
  Trash2,
  Camera,
  CalendarHeart,
  Globe2,
  Sparkles,
  Smile,
  MoreVertical,
  Flag,
  User,
  Check,
  RotateCcw,
  ShieldCheck,
  Eye,
  X,
  BookOpen,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    selectedCompanionId,
    getCompanion,
    conversations,
    sendMessage,
    deleteMessage,
    clearConversation,
    regenerateLastResponse,
    getRelationshipProgress,
    resetRelationship,
    setActiveView,
    setProfileModalOpen,
    setPhotoModalOpen,
    setReportingTarget,
    setReportModalOpen,
    addDiaryEntry,
    currentUser
  } = useApp();

  const companion = getCompanion(selectedCompanionId || 'char_f_1');
  const messages = companion ? conversations[companion.id] || [] : [];
  const progress = companion ? getRelationshipProgress(companion.id) : null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Auto Detect');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastExtractedMemory, setLastExtractedMemory] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; scenario?: string } | null>(null);
  const [savedDiaryNotice, setSavedDiaryNotice] = useState(false);
  const [lastDetectedLanguage, setLastDetectedLanguage] = useState<{
    primaryLanguage?: string;
    languageName?: string;
    script?: string;
    isRomanized?: boolean;
    isMultilingual?: boolean;
    tone?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Text-to-speech with full multilingual native voice support
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = companion?.gender === 'female' ? 1.05 : 0.95;

      const hasBengali = /[\u0980-\u09FF]/.test(text);
      const hasHindi = /[\u0900-\u097F]/.test(text);
      const hasUrduOrArabic = /[\u0600-\u06FF]/.test(text);
      const hasTamil = /[\u0B80-\u0BFF]/.test(text);
      const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
      const hasJapanese = /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text);
      const hasKorean = /[\uAC00-\uD7AF]/.test(text);
      const hasRussian = /[\u0400-\u04FF]/.test(text);

      let targetLang = 'en-US';
      if (hasBengali) targetLang = 'bn-BD';
      else if (hasHindi) targetLang = 'hi-IN';
      else if (hasUrduOrArabic) targetLang = 'ur-PK';
      else if (hasTamil) targetLang = 'ta-IN';
      else if (hasTelugu) targetLang = 'te-IN';
      else if (hasJapanese) targetLang = 'ja-JP';
      else if (hasKorean) targetLang = 'ko-KR';
      else if (hasRussian) targetLang = 'ru-RU';

      utterance.lang = targetLang;

      try {
        const voices = window.speechSynthesis.getVoices();
        const prefix = targetLang.split('-')[0];
        const matchVoice = voices.find((v) => v.lang.startsWith(prefix));
        if (matchVoice) utterance.voice = matchVoice;
      } catch (e) {
        // Fallback to browser default
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !companion || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);
    setLastExtractedMemory(null);

    try {
      const res = await sendMessage(companion.id, userText, selectedLanguage);
      if (res.extractedMemory) {
        setLastExtractedMemory(res.extractedMemory.memoryText);
      }
      if (res.detectedLanguage) {
        setLastDetectedLanguage(res.detectedLanguage);
      }
    } catch (err) {
      console.warn('Chat interaction handled:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStageAppropriateStarters = (stage: string) => {
    switch (stage) {
      case 'Stranger':
        return [
          'Hello! Nice to meet you 😊',
          'What kind of music or arts do you enjoy?',
          'Tell me about your favorite spots in your city 🌆',
          'আজকের দিনটা কেমন কাটছে তোমার?',
          'Aapko weekend pe kya karna pasand hai?'
        ];
      case 'Acquaintance':
        return [
          'Had an interesting day today! How about you?',
          'Coffee or chai on a quiet evening? ☕',
          'Tell me about what you are passionate about.',
          'আজকে একটু আড্ডা দিতে ইচ্ছা করছিল 😊',
          'Aapke hobbies kya-kya hain?'
        ];
      case 'Friend':
        return [
          'Something funny happened to me today 😂',
          'I really appreciate how easy it is to talk with you.',
          'আজকে খুব tired লাগছে. Just wanted to chat a bit 🌙',
          'What is your all-time favorite memory?'
        ];
      case 'Close Friend':
        return [
          'I wanted to share something on my heart with you.',
          'You always know how to make my day brighter ✨',
          'Thanks for always being in my corner.',
          'তুমি সাথে থাকলে মনটা অনেক হালকা লাগে ❤️'
        ];
      case 'Deep Relationship':
      case 'Romantic Relationship':
      default:
        return [
          'I was just thinking about you ❤️',
          'আজ তোমাকে খুব মনে পড়ছে ❤️',
          'You understand me in ways few people do.',
          'What are you doing right now? Would love to see a photo ✨',
          'Abhi kya kar rahe ho? Missed you today 🌙'
        ];
    }
  };

  if (!companion || !progress) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-zinc-400">
        <Heart className="w-12 h-12 text-rose-500/30 mx-auto mb-3" />
        <p>Please select a companion from the directory.</p>
        <button
          onClick={() => setActiveView('discovery')}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs"
        >
          Browse Companions
        </button>
      </div>
    );
  }

  const currentStarters = getStageAppropriateStarters(progress.stage);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4.2rem)] flex flex-col bg-[#0f0b17] border-x border-rose-950/40">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-rose-950/40 bg-[#130e1d]/90 backdrop-blur-md flex items-center justify-between gap-2 shrink-0">
        {/* Companion Avatar & Info */}
        <div
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view Relationship Journey & Full Profile"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-rose-600/70 shrink-0">
            <img
              src={companion.thumbnailUrl}
              alt={companion.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#130e1d]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-serif font-bold text-white leading-tight group-hover:text-rose-300 transition-colors">
                {companion.name}
              </h2>
              <span className="text-xs">{companion.flag}</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">{companion.city}</span>
            </div>

            {/* Current Mood & Stage Pill with Trust */}
            <div className="flex items-center gap-2 mt-0.5 text-[10px] flex-wrap">
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <Smile className="w-3 h-3" />
                <span>{progress.currentMood}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-950/70 text-rose-300 font-medium border border-rose-900/50 hover:border-rose-700 transition">
                Stage: {progress.stage}
              </span>
              <span className="text-emerald-400 font-medium hidden sm:inline">
                Trust {progress.trust ?? 10}%
              </span>
              <span className="text-blue-400 font-medium hidden md:inline">
                Familiarity {progress.familiarity ?? 0}%
              </span>
              {progress.boundaryStatus === 'tested' && (
                <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-900/50 text-[9px]">
                  Paced Boundary
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Tools: Photos, Dates, Language & Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Date Shortcut */}
          <button
            onClick={() => setActiveView('virtual_dates')}
            className="p-2 rounded-xl bg-pink-950/50 hover:bg-pink-900/70 border border-pink-900/60 text-pink-300 text-xs transition cursor-pointer"
            title="Take companion on a virtual date"
          >
            <CalendarHeart className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <Globe2 className="absolute left-2 w-3.5 h-3.5 text-rose-400 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="pl-7 pr-2 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none focus:border-rose-500"
              title="Select language mode or leave on Auto Match to mirror your exact language/script"
            >
              <option value="Auto Detect">Auto Match (Speaks Your Language & Script)</option>
              <option value="Bengali">বাংলা (Bengali / Banglish)</option>
              <option value="Hindi">हिन्दी (Hindi / Hinglish)</option>
              <option value="English">English</option>
              <option value="Urdu">اردو (Urdu)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="Malayalam">മലയാളം (Malayalam)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="French">Français (French)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="Portuguese">Português (Portuguese)</option>
              <option value="Italian">Italiano (Italian)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Dutch">Nederlands (Dutch)</option>
              <option value="Russian">Русский (Russian)</option>
              <option value="Japanese">日本語 (Japanese / Romaji)</option>
              <option value="Korean">한국어 (Korean / Romaja)</option>
              <option value="Chinese">中文 (Chinese)</option>
              <option value="Arabic">العربية (Arabic)</option>
              <option value="Turkish">Türkçe (Turkish)</option>
            </select>
          </div>

          {/* Settings / Reset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-[#161221] p-1.5 shadow-2xl z-50 text-xs space-y-1"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>View Full Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('photos');
                    setPhotoModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-rose-400" />
                  <span>Generate Photo</span>
                </button>
                <button
                  onClick={() => clearConversation(companion.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Clear Conversation</span>
                </button>
                <button
                  onClick={() => resetRelationship(companion.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Relationship Stage</span>
                </button>
                <div className="pt-1 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setReportingTarget({ type: 'companion_chat', id: companion.id });
                      setReportModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/50 text-rose-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Concern</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memory Notification Banner */}
      {lastExtractedMemory && (
        <div className="px-4 py-2 bg-purple-950/70 border-b border-purple-800/50 flex items-center justify-between text-xs text-purple-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{companion.name} remembered: <em>"{lastExtractedMemory}"</em></span>
          </div>
          <button
            onClick={() => setLastExtractedMemory(null)}
            className="text-purple-400 hover:text-purple-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Romantic Safety Disclaimer */}
        <div className="text-center py-2">
          <span className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400">
            Encrypted conversation with {companion.name} (18+ Fictional Adult AI)
          </span>
        </div>

        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const isLastAi = !isUser && index === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 group ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-rose-800/60 shrink-0 mb-1">
                  <img
                    src={companion.thumbnailUrl}
                    alt={companion.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`relative max-w-[85%] sm:max-w-md rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white rounded-br-xs shadow-md'
                    : 'bg-[#1a1427] text-zinc-200 border border-rose-950/70 rounded-bl-xs shadow'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Character Photo Keepsake Card with Permanent Identity Lock */}
                {msg.imageUrl && (
                  <div className="mt-2.5 mb-1 rounded-xl overflow-hidden border border-rose-900/60 bg-black/40 shadow-lg group/img relative">
                    <img
                      src={msg.imageUrl}
                      alt={msg.imageScenario || `${companion.name}'s photo`}
                      className="w-full max-h-72 object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                      onClick={() => setLightboxImage({ url: msg.imageUrl!, scenario: msg.imageScenario })}
                    />

                    {/* Permanent Identity Lock badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-emerald-500/40 text-[9px] text-emerald-300 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Permanent Identity Locked • 18+ Fictional</span>
                    </div>

                    {/* Quick Enlarge Action Button */}
                    <button
                      onClick={() => setLightboxImage({ url: msg.imageUrl!, scenario: msg.imageScenario })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow"
                      title="Enlarge photo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Scenario / Spoken Action Caption */}
                    {msg.imageScenario && (
                      <div className="p-2 bg-zinc-950/80 border-t border-zinc-800/80 text-[10px] text-zinc-300 flex items-center justify-between gap-2">
                        <span className="truncate italic text-zinc-300">"{msg.imageScenario}"</span>
                        <span className="shrink-0 text-[9px] text-rose-300 font-semibold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/50">
                          Keepsake
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer with Timestamp & Hover Actions */}
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-80 pt-1">
                  <span className={isUser ? 'text-rose-200' : 'text-zinc-500'}>
                    {msg.timestamp}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="p-1 hover:text-white transition"
                      title="Play voice"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="p-1 hover:text-white transition"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {isLastAi && (
                      <button
                        onClick={() => regenerateLastResponse(companion.id)}
                        className="p-1 hover:text-white transition"
                        title="Regenerate reply"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(companion.id, msg.id)}
                      className="p-1 hover:text-rose-400 transition"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-800/60 shrink-0">
              <img
                src={companion.thumbnailUrl}
                alt={companion.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 rounded-2xl rounded-bl-xs bg-[#1a1427] border border-rose-950/70 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-zinc-400 ml-1.5">{companion.name} is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Stage-Appropriate Starters */}
      <div className="px-4 py-2 bg-[#120e1a]/80 border-t border-rose-950/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider shrink-0">
          Topics:
        </span>
        {currentStarters.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => setInput(starter)}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-800/50 text-[11px] text-zinc-300 hover:text-rose-200 shrink-0 transition cursor-pointer"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Multilingual Mode Banner */}
      <div className="px-4 py-1.5 bg-[#0f0b17] flex items-center justify-between text-[10px] text-zinc-400 border-t border-rose-950/30">
        <div className="flex items-center gap-1.5 truncate">
          <Globe2 className="w-3 h-3 text-rose-400 shrink-0" />
          <span className="text-zinc-300 font-medium">Language Matching:</span>
          {lastDetectedLanguage ? (
            <span className="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-200 font-medium">
              Matched: {lastDetectedLanguage.languageName}
              {lastDetectedLanguage.isRomanized ? ' (Romanized)' : ''}
              {lastDetectedLanguage.isMultilingual ? ' + Mixed' : ''}
            </span>
          ) : (
            <>
              <span className="text-rose-300">বাংলা (Bengali / Banglish)</span>
              <span className="text-zinc-600">•</span>
              <span className="text-purple-300">हिन्दी (Hindi / Hinglish)</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-300">English</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-300">Auto-Adapting</span>
            </>
          )}
        </div>
        <span className="hidden md:inline-flex items-center gap-1 text-zinc-500 italic">
          <Sparkles className="w-2.5 h-2.5 text-rose-400" />
          Automatic Tone & Script Matching
        </span>
      </div>

      {/* Input Form with Microphone & Send */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-[#14101e] border-t border-rose-950/40 flex items-end gap-2 shrink-0"
      >
        {/* Ask for Photo / Camera button */}
        <button
          type="button"
          onClick={() => {
            let reqText = `What are you doing right now? Send me a picture ☕❤️`;
            if (selectedLanguage === 'Bengali' || lastDetectedLanguage?.primaryLanguage === 'bn') {
              reqText = `তুমি এখন কী করছো? একটা ছবি পাঠাও না ❤️`;
            } else if (selectedLanguage === 'Hindi' || lastDetectedLanguage?.primaryLanguage === 'hi') {
              reqText = `अभी क्या कर रही हो? अपनी एक फोटो भेजो ❤️`;
            }
            setInput(reqText);
          }}
          className="p-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:bg-zinc-800 transition shrink-0 cursor-pointer"
          title="Ask for a picture / photo update"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Text Input Area */}
        <div className="relative flex-1">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Say something to ${companion.name} in Bengali (বাংলা/Banglish), Hindi (हिंदी/Hinglish), English, or your native language...`}
            className="w-full max-h-32 min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 resize-none transition"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 text-white shadow-md shadow-rose-950/50 transition shrink-0 cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Lightbox / High-Res Image Inspection Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-rose-900/40 bg-[#130f1e] shadow-2xl overflow-hidden text-left flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-rose-950/40 bg-[#171224] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-rose-800/60 shrink-0">
                  <img src={companion.thumbnailUrl} alt={companion.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                    {companion.name}
                    <span className="text-xs">{companion.flag}</span>
                  </h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Permanent Visual Identity Verified
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.scenario || 'Companion Portrait'}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Footer with Details & Actions */}
            <div className="p-4 border-t border-rose-950/40 bg-[#171224] space-y-2.5">
              {lightboxImage.scenario && (
                <p className="text-xs text-zinc-300 italic">
                  "{lightboxImage.scenario}"
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="text-[10px] text-zinc-400">
                  <span className="text-zinc-500">Identity:</span> {(companion.visualIdentity.faceDescription || companion.visualIdentity.faceIdentity || 'Permanent Identity').slice(0, 40)}...
                </div>

                <button
                  onClick={() => {
                    addDiaryEntry({
                      companionId: companion.id,
                      companionName: companion.name,
                      companionAvatar: companion.thumbnailUrl,
                      title: `Chat Keepsake: ${lightboxImage.scenario?.slice(0, 25) || 'Shared Photo'}`,
                      summary: `Shared by ${companion.name} during our conversation.`,
                      imageUrl: lightboxImage.url,
                      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    });
                    setSavedDiaryNotice(true);
                    setTimeout(() => setSavedDiaryNotice(false), 3000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800/60 text-rose-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  {savedDiaryNotice ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved to Diary!</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Save to Diary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
