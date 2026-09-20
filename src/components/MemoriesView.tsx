import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Sparkles,
  Plus,
  Trash2,
  Filter,
  CheckCircle2,
  X,
  RotateCcw
} from 'lucide-react';

export const MemoriesView: React.FC = () => {
  const {
    memories,
    addMemory,
    deleteMemory,
    clearMemoriesForCompanion,
    companions,
    selectedCompanionId,
    getCompanion
  } = useApp();

  const [filterCompanionId, setFilterCompanionId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [memoryText, setMemoryText] = useState('');
  const [category, setCategory] = useState<
    'preference' | 'hobby' | 'shared_moment' | 'milestone' | 'joke' | 'emotional_context' | 'background'
  >('preference');
  const [companionId, setCompanionId] = useState(selectedCompanionId || 'char_f_1');
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredMemories = memories.filter((m) => {
    const matchComp = filterCompanionId === 'all' || m.companionId === filterCompanionId;
    const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchComp && matchCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryText.trim()) return;

    addMemory({
      companionId,
      memoryText: memoryText.trim(),
      category,
      importance
    });

    setMemoryText('');
    setModalOpen(false);
  };

  const categories: Array<'preference' | 'hobby' | 'shared_moment' | 'milestone' | 'joke' | 'emotional_context' | 'background'> = [
    'preference',
    'hobby',
    'shared_moment',
    'milestone',
    'joke',
    'emotional_context',
    'background'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Emotional Memory Engine</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
            Companion Long-Term Memory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            See what your companions remember about you. These memories are referenced during conversations to maintain authentic emotional continuity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800/60 text-purple-200 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="mb-6 p-3.5 rounded-xl bg-[#14101e] border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Companion filter */}
          <select
            value={filterCompanionId}
            onChange={(e) => setFilterCompanionId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Companions</option>
            {companions.slice(0, 30).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Category pills */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition capitalize cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-950 text-purple-200 border border-purple-800/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition capitalize cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-950 text-purple-200 border border-purple-800/60'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filterCompanionId !== 'all' && (
          <button
            onClick={() => {
              if (window.confirm('Reset all memories for this companion?')) {
                clearMemoriesForCompanion(filterCompanionId);
              }
            }}
            className="text-zinc-500 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Companion Memories</span>
          </button>
        )}
      </div>

      {/* Memory Cards Grid */}
      {filteredMemories.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#120e1a] border border-zinc-800/60 p-8 max-w-md mx-auto">
          <Brain className="w-12 h-12 text-purple-500/30 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">No memories recorded yet</h3>
          <p className="text-xs text-zinc-400 mb-4">
            During conversations, companions automatically extract and remember your favorite things and moments.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-950 text-purple-200 border border-purple-800/60 text-xs font-medium cursor-pointer"
          >
            Add First Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((mem) => {
            const comp = getCompanion(mem.companionId);
            return (
              <div
                key={mem.id}
                className="p-4 rounded-xl bg-[#151121] border border-purple-950/60 hover:border-purple-800/60 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 capitalize font-medium border border-purple-900/50">
                        {mem.category}
                      </span>
                      {mem.detectedEmotion && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 text-[10px] italic border border-rose-900/40">
                          {mem.detectedEmotion}
                        </span>
                      )}
                    </div>
                    <span className="text-zinc-500 text-[10px]">{mem.createdAt}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                    "{mem.memoryText}"
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    {comp && (
                      <>
                        <img
                          src={comp.thumbnailUrl}
                          alt={comp.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{comp.name}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="text-zinc-500 hover:text-rose-400 transition cursor-pointer p-1"
                    title="Forget this memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Memory Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-purple-900/40 bg-[#151122] p-6 shadow-2xl text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-white mb-1">
              Store Companion Memory
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Add a personal detail or preference your companion should remember.
            </p>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Companion</label>
                <select
                  value={companionId}
                  onChange={(e) => setCompanionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                >
                  {companions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Memory Detail</label>
                <textarea
                  rows={3}
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  placeholder="e.g. Loves rainy Tuesday evenings, drinks green tea without sugar, dreams of learning Italian..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Importance</label>
                  <select
                    value={importance}
                    onChange={(e) => setImportance(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-medium shadow transition cursor-pointer"
              >
                Record Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
