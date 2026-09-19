import React, { useRef, useEffect, useState } from 'react';
import { LevelData, MarkerColor, CHAPTERS_INFO } from '../types';
import { ALL_100_LEVELS } from '../models/LevelCatalog';
import {
  X,
  Star,
  Lock,
  Play,
  Check,
  Compass,
  Trophy,
  ArrowDown,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface LevelMapSelectorProps {
  currentLevelNumber: number;
  unlockedMaxLevel: number;
  completedLevels: Set<number>;
  activeMarker: MarkerColor;
  onSelectLevel: (level: LevelData) => void;
  onClose: () => void;
}

export const LevelMapSelector: React.FC<LevelMapSelectorProps> = ({
  currentLevelNumber,
  unlockedMaxLevel,
  completedLevels,
  activeMarker,
  onSelectLevel,
  onClose,
}) => {
  const currentLevelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number>(() => {
    return Math.min(Math.floor((currentLevelNumber - 1) / 10) + 1, 10);
  });

  const totalStars = completedLevels.size * 3;
  const maxStars = ALL_100_LEVELS.length * 3;

  // Auto-scroll to current unlocked level on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLevelRef.current) {
        currentLevelRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCurrentLevel = () => {
    if (currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const scrollToChapter = (chapterStartLevel: number) => {
    const el = document.getElementById(`map_level_node_${chapterStartLevel}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="level_map_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="level_map_modal_container"
        className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white border-2 border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden text-[#1E293B]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: activeMarker.primaryColor }}
            >
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A]">
                  100 Levels Adventure Map
                </h2>
              </div>
              <p className="text-xs text-[#64748B] font-medium">
                Follow the winding path from Sunny Meadow to Grand Discovery!
              </p>
            </div>
          </div>

          <button
            id="close_map_button"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#475569] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stars and Quick Jump Banner */}
        <div className="px-4 py-2.5 bg-[#FFFDE7] border-b border-[#FFF59D] flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-2 font-black text-[#B45309]">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF08A] border border-[#FACC15]">
              <Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
              <span>{totalStars} / {maxStars} Stars</span>
            </div>
            <span className="text-[#92400E] font-medium hidden sm:inline">
              Unlocked Level {unlockedMaxLevel} of 100
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToCurrentLevel}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-white shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: activeMarker.primaryColor }}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Go to Level {unlockedMaxLevel}</span>
          </button>
        </div>

        {/* Chapter Shortcut Pills */}
        <div className="px-3 py-2 bg-white border-b border-[#E2E8F0] overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {CHAPTERS_INFO.map((chapter) => {
            const isSelected = selectedChapterId === chapter.id;
            const isChapterUnlocked = unlockedMaxLevel >= chapter.startLevel;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => {
                  setSelectedChapterId(chapter.id);
                  scrollToChapter(chapter.startLevel);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : isChapterUnlocked
                    ? 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
                    : 'bg-[#F8FAFC] text-[#94A3B8] opacity-60'
                }`}
              >
                <span>{chapter.icon}</span>
                <span>Ch.{chapter.id}</span>
              </button>
            );
          })}
        </div>

        {/* Map Serpentine Scrollable Canvas */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC] relative"
        >
          <div className="max-w-md mx-auto flex flex-col items-center gap-8 py-6">
            {CHAPTERS_INFO.map((chapter) => {
              const chapterLevels = ALL_100_LEVELS.slice(chapter.startLevel - 1, chapter.endLevel);
              const isChapterUnlocked = unlockedMaxLevel >= chapter.startLevel;

              return (
                <div
                  key={chapter.id}
                  id={`chapter_section_${chapter.id}`}
                  className="w-full flex flex-col items-center gap-6"
                >
                  {/* Chapter Milestone Banner */}
                  <div
                    className={`w-full rounded-2xl p-3.5 border-2 shadow-xs flex items-center justify-between gap-3 ${
                      isChapterUnlocked
                        ? `bg-gradient-to-r ${chapter.bgGradient} border-[#CBD5E1]`
                        : 'bg-[#F1F5F9] border-dashed border-[#CBD5E1] opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{chapter.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-[#475569]">
                            Chapter {chapter.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-[#334155] border border-[#CBD5E1]">
                            Lv {chapter.startLevel} - {chapter.endLevel}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#0F172A]">{chapter.name}</h3>
                        <p className="text-[11px] text-[#64748B]">{chapter.tagline}</p>
                      </div>
                    </div>

                    {chapter.id === 10 ? (
                      <Trophy className="w-7 h-7 text-[#EAB308] shrink-0 fill-[#FEF08A]" />
                    ) : (
                      <span className="text-xl shrink-0 opacity-80">{chapter.icon}</span>
                    )}
                  </div>

                  {/* Serpentine Nodes in this chapter */}
                  <div className="w-full flex flex-col items-center gap-6 relative">
                    {chapterLevels.map((lvl, index) => {
                      const isCompleted = completedLevels.has(lvl.levelNumber);
                      const isCurrent = lvl.levelNumber === unlockedMaxLevel;
                      const isLocked = lvl.levelNumber > unlockedMaxLevel;
                      const isSelectedCurrent = lvl.levelNumber === currentLevelNumber;

                      // Serpentine offset pattern: Left, Center-Left, Center, Center-Right, Right...
                      // Use a sine wave to position horizontally: 5 positions
                      const posPattern = [0, 60, 100, 60, 0, -60, -100, -60];
                      const xOffset = posPattern[index % posPattern.length];

                      return (
                        <div
                          key={lvl.levelNumber}
                          ref={isCurrent ? currentLevelRef : null}
                          id={`map_level_node_${lvl.levelNumber}`}
                          className="relative flex flex-col items-center"
                          style={{
                            transform: `translateX(${xOffset}px)`,
                          }}
                        >
                          {/* Pulsing indicator for current active level */}
                          {isCurrent && (
                            <div className="absolute -top-7 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0F172A] text-white text-[10px] font-black tracking-wider shadow-md animate-bounce">
                              <Sparkles className="w-3 h-3 text-[#FACC15]" />
                              <span>CURRENT</span>
                            </div>
                          )}

                          {/* Interactive Level Circle Button */}
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => {
                              onSelectLevel(lvl);
                              onClose();
                            }}
                            className={`group relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                              isSelectedCurrent
                                ? 'ring-4 ring-offset-2 scale-110'
                                : 'hover:scale-105'
                            } ${
                              isCompleted
                                ? 'bg-[#ECFDF5] border-3 border-[#10B981] text-[#065F46]'
                                : isCurrent
                                ? 'bg-white border-3 text-white'
                                : 'bg-[#F1F5F9] border-2 border-[#CBD5E1] text-[#94A3B8] opacity-60 cursor-not-allowed'
                            }`}
                            style={{
                              borderColor: isCurrent ? activeMarker.primaryColor : undefined,
                              boxShadow: isCurrent
                                ? `0 8px 20px ${activeMarker.primaryColor}40`
                                : undefined,
                            }}
                          >
                            {isCompleted ? (
                              <>
                                <span className="text-base leading-none mb-0.5">{lvl.icon}</span>
                                <span className="text-[11px] font-black text-[#047857]">
                                  {lvl.levelNumber}
                                </span>
                              </>
                            ) : isCurrent ? (
                              <div
                                className="w-full h-full rounded-full flex flex-col items-center justify-center text-white"
                                style={{ backgroundColor: activeMarker.primaryColor }}
                              >
                                <Play className="w-5 h-5 fill-white mb-0.5" />
                                <span className="text-[10px] font-black">{lvl.levelNumber}</span>
                              </div>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 text-[#94A3B8] mb-0.5" />
                                <span className="text-[10px] font-bold text-[#94A3B8]">
                                  {lvl.levelNumber}
                                </span>
                              </>
                            )}
                          </button>

                          {/* Star Rating Badge Below Completed Nodes */}
                          <div className="mt-1 flex items-center justify-center gap-0.5">
                            {isCompleted ? (
                              [0, 1, 2].map((s) => (
                                <Star
                                  key={s}
                                  className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]"
                                />
                              ))
                            ) : isCurrent ? (
                              <span
                                className="text-[10px] font-black uppercase tracking-wider"
                                style={{ color: activeMarker.primaryColor }}
                              >
                                {lvl.word}
                              </span>
                            ) : (
                              <span className="text-[9px] text-[#94A3B8] font-semibold">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
