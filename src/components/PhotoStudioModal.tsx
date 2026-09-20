import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Sparkles,
  ShieldCheck,
  Download,
  BookOpen,
  Trash2,
  X,
  Plus,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserCheck
} from 'lucide-react';

export const PhotoStudioModal: React.FC = () => {
  const {
    photoModalOpen,
    setPhotoModalOpen,
    selectedCompanionId,
    setSelectedCompanionId,
    companions,
    getCompanion,
    generatePhoto,
    generatedPhotos,
    deletePhoto,
    addDiaryEntry,
    credits,
    addCredits
  } = useApp();

  const companion = getCompanion(selectedCompanionId || 'char_f_1');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [savedDiaryNotice, setSavedDiaryNotice] = useState<string | null>(null);

  if (!photoModalOpen) return null;

  const presetPrompts = [
    'At a sunlit Parisian café terrace sipping espresso in soft afternoon light',
    'Wearing a warm cashmere sweater reading by a crackling stone fireplace',
    'Walking along a twilight Mediterranean beach with the sea breeze',
    'In an elegant evening outfit at a rooftop jazz lounge overlooking city lights',
    'Strolling under blooming cherry blossoms in a tranquil Japanese garden'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companion || !prompt.trim() || loading) return;

    setError('');
    setLoading(true);
    try {
      await generatePhoto(companion.id, prompt.trim());
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please ensure prompt is non-explicit.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = (photo: any) => {
    addDiaryEntry({
      companionId: photo.companionId,
      companionName: photo.companionName,
      companionAvatar: companion?.thumbnailUrl || '',
      title: `Portrait: ${photo.prompt.slice(0, 30)}...`,
      summary: `Generated a keepsake portrait of ${photo.companionName}. Prompt: "${photo.prompt}"`,
      imageUrl: photo.imageUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
    setSavedDiaryNotice(photo.id);
    setTimeout(() => setSavedDiaryNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-rose-900/40 bg-[#130f1e] shadow-2xl overflow-hidden my-auto text-left">
        {/* Close Button */}
        <button
          onClick={() => setPhotoModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-rose-950/40 bg-[#171224] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white">
                Companion Photo Studio
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Generate non-explicit, cinematic keepsake photos of your selected AI companion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-rose-300 font-semibold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span>{credits} Credits Left</span>
            </span>
            <button
              onClick={() => addCredits(25)}
              className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-medium border border-rose-800/60 transition cursor-pointer flex items-center gap-1"
              title="Claim 25 Free Photo Credits"
            >
              <Plus className="w-3 h-3" />
              <span>Refill</span>
            </button>
          </div>
        </div>

        {/* Studio Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Companion Selector & Visual Identity Card */}
          <div className="p-4 rounded-xl bg-[#1a1427] border border-rose-950/60 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-rose-800/60 shrink-0 relative">
                <img
                  src={companion?.profileImageUrl}
                  alt={companion?.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 p-0.5 bg-black/80 rounded-tl text-[10px]" title="Identity Locked">
                  🔒
                </span>
              </div>

              <div className="flex-1 w-full text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="text-zinc-400 font-medium">Model Companion:</label>
                  <select
                    value={selectedCompanionId || 'char_f_1'}
                    onChange={(e) => setSelectedCompanionId(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {companions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                {companion && (
                  <div className="text-[11px] text-zinc-400 space-y-0.5">
                    <p>
                      <strong className="text-zinc-300">Identity: </strong>
                      {companion.visualIdentity.faceDescription} • {companion.visualIdentity.hair}
                    </p>
                    <p>
                      <strong className="text-zinc-300">Aesthetic: </strong>
                      {companion.visualIdentity.fashionStyle}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Permanent Visual Identity Lock Specs */}
            {companion && (
              <div className="pt-2.5 border-t border-zinc-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-zinc-500 block">Facial Lock:</span>
                  <span className="text-zinc-300 font-medium truncate block">{(companion.visualIdentity.faceDescription || companion.visualIdentity.faceIdentity || 'Permanent Oval Contours').slice(0, 30)}</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-zinc-500 block">Eyes & Gaze:</span>
                  <span className="text-zinc-300 font-medium truncate block">{companion.visualIdentity.eyeColor || companion.visualIdentity.eyeDescription || 'Warm Almond Eyes'}</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-zinc-500 block">Skin & Hair:</span>
                  <span className="text-zinc-300 font-medium truncate block">{companion.visualIdentity.skinTone}, {(companion.visualIdentity.hair || companion.visualIdentity.hairDescription || 'Styled Hair').slice(0, 15)}</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-zinc-500 block">Identity Engine:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    v1.0 Strict Lock
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Non-Explicit Safety Policy Guarantee */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All generated photos are strictly non-explicit, tasteful, and depict adult fictional characters only.
            </span>
          </div>

          {/* Generation Prompt Form */}
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Describe the Scene or Outfit:
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Sitting at an outdoor café in Paris drinking espresso during autumn sunset..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 resize-none transition"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400">Sample romantic backdrops:</span>
              <div className="flex flex-wrap gap-1.5">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition cursor-pointer text-left"
                  >
                    {p.slice(0, 38)}...
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 text-white font-medium text-xs sm:text-sm tracking-wide shadow-md shadow-rose-950/50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-rose-200" />
                  <span>Creating Aesthetic Portrait...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Generate Photo (1 Credit)</span>
                </>
              )}
            </button>
          </form>

          {/* Photo Gallery of Previously Generated Photos */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Saved Keepsakes Gallery ({generatedPhotos.length})
            </h3>

            {generatedPhotos.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">
                No photos created yet. Type a scene above to create your first visual keepsake!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {generatedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-rose-600/50 transition"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.prompt}
                      className="w-full aspect-square object-cover"
                    />

                    {/* Permanent Identity Lock Pill */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs border border-emerald-500/40 text-[9px] text-emerald-300">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Identity Locked</span>
                    </div>

                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setZoomedImage(photo.imageUrl)}
                          className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
                          title="View full image"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-black/60 text-rose-400 hover:bg-rose-950 transition cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-300 line-clamp-2 leading-tight">
                          {photo.prompt}
                        </p>
                        <button
                          onClick={() => handleSaveToDiary(photo)}
                          className="w-full py-1 rounded bg-rose-950/90 hover:bg-rose-900 text-[10px] text-rose-200 font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          {savedDiaryNotice === photo.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Saved to Diary!</span>
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-3 h-3" />
                              <span>Save to Diary</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-2xl w-full">
            <img
              src={zoomedImage}
              alt="Zoomed keepsake"
              className="w-full rounded-2xl object-contain max-h-[85vh] mx-auto shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
