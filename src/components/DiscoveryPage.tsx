import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Search,
  Filter,
  Sparkles,
  MessageCircleHeart,
  Eye,
  CalendarHeart,
  Camera,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  filterCharacters,
  availableCountries,
  availableLanguages,
  availablePersonalities
} from '../data/characters';
import { Gender } from '../types';

export const DiscoveryPage: React.FC = () => {
  const {
    companions,
    setSelectedCompanionId,
    setActiveView,
    setProfileModalOpen,
    setPhotoModalOpen,
    isFavorite,
    toggleFavorite,
    getRelationshipProgress
  } = useApp();

  // Filter and search states
  const [selectedGender, setSelectedGender] = useState<'all' | Gender>('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedPersonality, setSelectedPersonality] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Compute filtered characters
  const filteredList = useMemo(() => {
    return filterCharacters(companions, {
      gender: selectedGender,
      country: selectedCountry,
      language: selectedLanguage,
      personality: selectedPersonality,
      search: searchQuery,
      sortBy
    });
  }, [
    companions,
    selectedGender,
    selectedCountry,
    selectedLanguage,
    selectedPersonality,
    searchQuery,
    sortBy
  ]);

  const femaleCount = companions.filter((c) => c.gender === 'female').length;
  const maleCount = companions.filter((c) => c.gender === 'male').length;

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedCountry('all');
    setSelectedLanguage('all');
    setSelectedPersonality('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Discover All 100 AI Companions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
            Meet Someone Who Understands You
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Explore 50 women and 50 men from around the globe. Every companion has an authentic voice, real memory retention, and distinct romantic soul.
          </p>
        </div>

        {/* Gender Toggle Pills */}
        <div className="flex items-center rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setSelectedGender('all')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              selectedGender === 'all'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All (100)
          </button>
          <button
            onClick={() => setSelectedGender('female')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              selectedGender === 'female'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Women ({femaleCount})
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              selectedGender === 'male'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Men ({maleCount})
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#130f1c] border border-rose-950/50 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companions by name, city, country, or traits..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Alphabetical</option>
              <option value="newest">Recently Added</option>
            </select>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Detailed Dropdown Filters */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/60 text-xs ${
            showFiltersMobile ? 'block' : 'hidden sm:grid'
          }`}
        >
          {/* Country */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Countries ({availableCountries.length})</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Personality</label>
            <select
              value={selectedPersonality}
              onChange={(e) => setSelectedPersonality(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Personalities</option>
              {availablePersonalities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-4 px-1">
        <span>
          Showing <strong className="text-rose-300">{filteredList.length}</strong> companions
        </span>
        <span className="text-[11px] text-zinc-500">
          All companions are fictional adults 18+
        </span>
      </div>

      {/* Companion Cards Grid (Section 8: 4-5 desktop, 3 tablet, 2 mobile) */}
      {filteredList.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#120e1a] border border-zinc-800/60 p-8">
          <Heart className="w-10 h-10 text-rose-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">No companions match your criteria</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or relaxing your filters to discover more companions.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-rose-950 text-rose-200 border border-rose-800/60 text-xs font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredList.map((character) => {
            const favorited = isFavorite(character.id);
            const progress = getRelationshipProgress(character.id);
            return (
              <div
                key={character.id}
                className="group relative rounded-2xl overflow-hidden bg-[#151120] border border-rose-950/50 hover:border-rose-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/40 flex flex-col"
              >
                {/* Image Container with 3:4 Aspect Ratio */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={character.profileImageUrl}
                    alt={character.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151120] via-transparent to-black/35" />

                  {/* Top Left: Country & Flag */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                    <span>{character.flag}</span>
                    <span className="truncate max-w-[80px]">{character.city}</span>
                  </div>

                  {/* Top Right: Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(character.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer ${
                      favorited
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950'
                        : 'bg-black/50 text-zinc-300 border-white/10 hover:text-white hover:bg-black/80'
                    }`}
                    title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
                  </button>

                  {/* Online Badge */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] text-emerald-400 border border-emerald-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-14">
                    <h3 className="text-sm font-serif font-bold text-white leading-tight truncate">
                      {character.name}, {character.age}
                    </h3>
                    <p className="text-[10px] text-rose-300/90 font-medium truncate mt-0.5">
                      {character.personality}
                    </p>
                  </div>
                </div>

                {/* Card Content & Bio */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5 bg-[#14101e]">
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed italic">
                    “{character.quote}”
                  </p>

                  {/* Relationship stage and mood */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2">
                    <span className={`px-1.5 py-0.5 rounded font-medium text-[9px] ${
                      progress.stage === 'Stranger'
                        ? 'bg-zinc-800/80 text-zinc-300'
                        : progress.stage === 'Acquaintance'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : progress.stage === 'Friend'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                    }`}>
                      {progress.stage}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {character.mood}
                    </span>
                  </div>

                  {/* Actions (Section 8: View Profile & Chat Now) */}
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
                      className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[11px] font-medium shadow transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageCircleHeart className="w-3 h-3 fill-white/30" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
