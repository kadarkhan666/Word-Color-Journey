import React, { useState, useMemo } from 'react';
import { LevelData, MarkerColor } from '../types';
import { ALL_100_LEVELS } from '../models/LevelCatalog';
import { CartoonIllustrationBox } from './CartoonIllustrations';
import {
  X,
  Lock,
  Search,
  Sparkles,
  Star,
  Play,
  CheckCircle2,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';

interface GalleryModalProps {
  completedLevels: Set<number>;
  activeMarker: MarkerColor;
  onSelectLevelToPlay: (level: LevelData) => void;
  onClose: () => void;
}

const CATEGORIES = [
  'All',
  'Sunny Meadow',
  'Safari & Pets',
  'Whispering Woods',
  'Sweet Orchard',
  'Toy Fair & Sweets',
  'Coral Waters',
  'Cosmic Sky',
  'Blossom Garden',
  'Cozy Village',
  'Grand Discovery',
];

export const GalleryModal: React.FC<GalleryModalProps> = ({
  completedLevels,
  activeMarker,
  onSelectLevelToPlay,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [selectedInspectLevel, setSelectedInspectLevel] = useState<LevelData | null>(null);

  const totalLevels = ALL_100_LEVELS.length;
  const unlockedCount = completedLevels.size;
  const unlockedPercentage = Math.round((unlockedCount / totalLevels) * 100);

  // Filter levels
  const filteredLevels = useMemo(() => {
    return ALL_100_LEVELS.filter((level) => {
      const isUnlocked = completedLevels.has(level.levelNumber);

      // Status filter
      if (filterMode === 'UNLOCKED' && !isUnlocked) return false;
      if (filterMode === 'LOCKED' && isUnlocked) return false;

      // Category filter
      if (selectedCategory !== 'All' && level.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const wordMatch = level.word.toLowerCase().includes(query);
        const hintMatch = level.hintText.toLowerCase().includes(query);
        const levelMatch = `level ${level.levelNumber}`.includes(query) || `${level.levelNumber}` === query;
        return wordMatch || hintMatch || levelMatch;
      }

      return true;
    });
  }, [completedLevels, filterMode, selectedCategory, searchQuery]);

  return (
    <div
      id="gallery_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="gallery_modal_container"
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white border-2 border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden text-[#1E293B]"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: activeMarker.primaryColor }}
            >
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A]">
                  100 Pictures Gallery
                </h2>
                <span
                  className="text-xs font-extrabold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: activeMarker.primaryColor }}
                >
                  {unlockedCount}/100 Revealed
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium hidden sm:block">
                Complete levels in Word Search to colorize and collect all 100 illustrations!
              </p>
            </div>
          </div>

          <button
            id="close_gallery_button"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#475569] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Stats Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#FFF9E6] border-b border-[#FEF08A] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E]">
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
            <span>Collection Mastery: {unlockedPercentage}% Complete</span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full sm:w-64 h-2.5 rounded-full bg-[#FEF9C3] border border-[#FDE047] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${unlockedPercentage}%`,
                backgroundColor: activeMarker.primaryColor,
              }}
            />
          </div>
        </div>

        {/* Controls: Search, Status Tabs, Category Pills */}
        <div className="p-3 sm:p-4 border-b border-[#E2E8F0] bg-white flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                id="gallery_search_input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, category, or #..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#F1F5F9] border border-[#E2E8F0] focus:outline-hidden focus:border-[#94A3B8] text-[#1E293B]"
              />
            </div>

            {/* Filter Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All (100)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('UNLOCKED')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'UNLOCKED'
                    ? 'bg-[#ECFDF5] text-[#059669] shadow-xs'
                    : 'text-[#64748B] hover:text-[#059669]'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('LOCKED')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'LOCKED'
                    ? 'bg-white text-[#64748B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Locked ({totalLevels - unlockedCount})
              </button>
            </div>
          </div>

          {/* Category Horizontal Scrollable Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 ml-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pictures Grid Gallery */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#F8FAFC]">
          {filteredLevels.length === 0 ? (
            <div className="py-16 text-center text-[#94A3B8]">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-sm">No picture collection found matching filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setFilterMode('ALL');
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredLevels.map((level) => {
                const isUnlocked = completedLevels.has(level.levelNumber);

                return (
                  <div
                    key={level.levelNumber}
                    id={`gallery_card_level_${level.levelNumber}`}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedInspectLevel(level);
                      } else {
                        // Prompt play level
                        onSelectLevelToPlay(level);
                        onClose();
                      }
                    }}
                    className={`group relative rounded-2xl p-2.5 sm:p-3 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md'
                        : 'bg-[#F1F5F9]/70 border-dashed border-[#CBD5E1] opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Top Card Info: Level Number & Category */}
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className="font-black px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569]">
                        #{level.levelNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-[#64748B] truncate max-w-[80px]">
                        {level.category || 'Classic'}
                      </span>
                    </div>

                    {/* Picture Preview Box */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                      {isUnlocked ? (
                        <CartoonIllustrationBox
                          type={level.illustrationType}
                          revealProgress={1}
                          isCompleted={true}
                          activeMarker={activeMarker}
                          className="w-full h-full p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#F1F5F9]">
                          <div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-1">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-xl opacity-30 select-none">{level.icon}</span>
                          <span className="text-[10px] font-bold text-[#94A3B8] mt-1">
                            Solve Lvl {level.levelNumber}
                          </span>
                        </div>
                      )}

                      {/* Revealed star badge */}
                      {isUnlocked && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#FEF08A] border border-[#FACC15] flex items-center justify-center shadow-xs">
                          <Star className="w-3.5 h-3.5 text-[#CA8A04] fill-[#CA8A04]" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Word & Label */}
                    <div className="mt-2 text-center">
                      <div className="flex items-center justify-center gap-1 font-black text-xs text-[#0F172A]">
                        <span>{isUnlocked ? level.icon : '❓'}</span>
                        <span className="uppercase tracking-wider">
                          {isUnlocked ? level.word : 'Locked'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#64748B] font-medium truncate mt-0.5">
                        {isUnlocked ? level.hintText : 'Play level to unlock art'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Picture Inspector Modal */}
        {selectedInspectLevel && (
          <div
            id="artwork_inspect_modal"
            className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          >
            <div className="relative w-full max-w-md rounded-3xl bg-white p-5 border-2 border-[#E2E8F0] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setSelectedInspectLevel(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{selectedInspectLevel.icon}</span>
                <h3
                  className="text-2xl font-black uppercase tracking-wider"
                  style={{ color: activeMarker.primaryColor }}
                >
                  {selectedInspectLevel.word}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#64748B] px-3 py-0.5 rounded-full bg-[#F1F5F9] mb-3">
                Level #{selectedInspectLevel.levelNumber} • {selectedInspectLevel.category}
              </span>

              {/* High-Res Art Preview Canvas */}
              <div className="w-56 h-56 mx-auto mb-3">
                <CartoonIllustrationBox
                  type={selectedInspectLevel.illustrationType}
                  revealProgress={1}
                  isCompleted={true}
                  activeMarker={activeMarker}
                  className="w-full h-full"
                />
              </div>

              {/* Description & Clue */}
              <p className="text-xs font-semibold text-[#475569] max-w-xs mb-4">
                "{selectedInspectLevel.hintText}"
              </p>

              {/* 3 Golden Stars */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                {[0, 1, 2].map((idx) => (
                  <Star
                    key={idx}
                    className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] drop-shadow-xs"
                  />
                ))}
                <span className="text-xs font-extrabold text-[#D97706] ml-1">Mastered!</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    onSelectLevelToPlay(selectedInspectLevel);
                    setSelectedInspectLevel(null);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-white font-black text-xs shadow-md transition-transform hover:scale-102 cursor-pointer"
                  style={{ backgroundColor: activeMarker.primaryColor }}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play This Level</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInspectLevel(null)}
                  className="py-2.5 px-4 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#475569] cursor-pointer"
                >
                  Back to Gallery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
