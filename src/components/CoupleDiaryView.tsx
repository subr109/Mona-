import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  X,
  Image as ImageIcon
} from 'lucide-react';

export const CoupleDiaryView: React.FC = () => {
  const {
    diaryEntries,
    addDiaryEntry,
    deleteDiaryEntry,
    companions,
    selectedCompanionId,
    getCompanion
  } = useApp();

  const [filterCompanionId, setFilterCompanionId] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [companionId, setCompanionId] = useState(selectedCompanionId || 'char_f_1');
  const [imageUrl, setImageUrl] = useState('');

  const filteredEntries = diaryEntries.filter((e) =>
    filterCompanionId === 'all' ? true : e.companionId === filterCompanionId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const comp = getCompanion(companionId);
    addDiaryEntry({
      companionId,
      companionName: comp ? comp.name : 'Beloved',
      companionAvatar: comp ? comp.thumbnailUrl : '',
      title: title.trim(),
      summary: summary.trim(),
      imageUrl: imageUrl.trim() || comp?.profileImageUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });

    setTitle('');
    setSummary('');
    setImageUrl('');
    setModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Couple Keepsakes</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
            Our Private Couple Diary
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Revisit intimate dates, meaningful whispers, and captured memories across your relationships.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Filter by companion */}
          <select
            value={filterCompanionId}
            onChange={(e) => setFilterCompanionId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Companions</option>
            {companions.slice(0, 30).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Memory</span>
          </button>
        </div>
      </div>

      {/* Diary Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#120e1a] border border-zinc-800/60 p-8 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">Your diary is waiting for its first page</h3>
          <p className="text-xs text-zinc-400 mb-5">
            Take a companion on a Virtual Date or click "New Memory" above to write an intimate reflection.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-950 text-rose-200 border border-rose-800/60 text-xs font-medium cursor-pointer"
          >
            Write a Diary Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group relative rounded-2xl overflow-hidden bg-[#14101e] border border-rose-950/60 hover:border-rose-700/50 transition-all shadow-lg flex flex-col"
            >
              {entry.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={entry.imageUrl}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14101e] via-transparent to-black/30" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      <span>{entry.date}</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-rose-300 font-medium">
                      {entry.companionAvatar && (
                        <img
                          src={entry.companionAvatar}
                          alt={entry.companionName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{entry.companionName}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-bold text-white group-hover:text-rose-200 transition-colors">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap">
                    {entry.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Cherished Memory</span>
                  </span>
                  <button
                    onClick={() => deleteDiaryEntry(entry.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Memory Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-rose-900/40 bg-[#151122] p-6 shadow-2xl text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-white mb-1">
              Add New Couple Diary Memory
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Write down a special memory or sentiment with your companion.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Companion</label>
                <select
                  value={companionId}
                  onChange={(e) => setCompanionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500"
                >
                  {companions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Memory Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Walking under the stars in Rome"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Reflection / Notes</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe the feelings, what was said, or why this moment mattered..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Optional Photo URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... (leave blank to use companion portrait)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium shadow transition cursor-pointer"
              >
                Save Memory to Diary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
