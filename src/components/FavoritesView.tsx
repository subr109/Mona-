import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircleHeart, Eye, Sparkles } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const {
    companions,
    favorites,
    setSelectedCompanionId,
    setActiveView,
    setProfileModalOpen,
    toggleFavorite
  } = useApp();

  const favoriteCompanions = companions.filter((c) => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
            <span>Your Cherished Circle</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
            My Favorite Companions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            The companions you have marked with a heart for quick intimate access.
          </p>
        </div>

        <button
          onClick={() => setActiveView('discovery')}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer"
        >
          Browse More
        </button>
      </div>

      {favoriteCompanions.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#120e1a] border border-zinc-800/60 p-8 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-rose-500/30 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">No favorites saved yet</h3>
          <p className="text-xs text-zinc-400 mb-5">
            When you discover someone who catches your eye or understands your thoughts, tap the heart icon on their card.
          </p>
          <button
            onClick={() => setActiveView('discovery')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-medium cursor-pointer"
          >
            Explore 100 Companions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {favoriteCompanions.map((character) => (
            <div
              key={character.id}
              className="group relative rounded-2xl overflow-hidden bg-[#151120] border border-rose-950/50 hover:border-rose-700/60 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                <img
                  src={character.profileImageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151120] via-transparent to-black/35" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                  <span>{character.flag}</span>
                  <span>{character.city}</span>
                </div>

                <button
                  onClick={() => toggleFavorite(character.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center bg-rose-600 text-white shadow-md cursor-pointer"
                  title="Remove from favorites"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </button>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-sm font-serif font-bold text-white leading-tight">
                    {character.name}, {character.age}
                  </h3>
                  <p className="text-[10px] text-rose-300 font-medium truncate mt-0.5">
                    {character.personality}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#14101e] space-y-2">
                <p className="text-[11px] text-zinc-400 line-clamp-2 italic">
                  “{character.quote}”
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setSelectedCompanionId(character.id);
                      setProfileModalOpen(true);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-800 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-zinc-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCompanionId(character.id);
                      setActiveView('chat');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-medium shadow flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageCircleHeart className="w-3 h-3 fill-white/30" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
