import React, { useEffect, useRef } from 'react';
import { LevelData, MarkerColor } from '../types';
import { ALL_100_LEVELS } from '../models/LevelCatalog';
import { X, Lock, Star, Calendar, Flame } from 'lucide-react';

interface LevelSelectDialogProps {
  currentLevelNumber: number;
  unlockedMaxLevel: number;
  completedLevels: Set<number>;
  activeMarker: MarkerColor;
  isDailyCompleted: boolean;
  dailyStreak: number;
  onSelectLevel: (level: LevelData) => void;
  onSelectDaily: () => void;
  onClose: () => void;
}

export const LevelSelectDialog: React.FC<LevelSelectDialogProps> = ({
  currentLevelNumber,
  unlockedMaxLevel,
  completedLevels,
  activeMarker,
  isDailyCompleted,
  dailyStreak,
  onSelectLevel,
  onSelectDaily,
  onClose,
}) => {
  const currentCardRef = useRef<HTMLButtonElement>(null);

  // Auto scroll to current level
  useEffect(() => {
    if (currentCardRef.current) {
      currentCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLevelNumber]);

  return (
    <div
      id="level_select_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="level_select_modal"
        className="relative w-full max-w-lg h-[88vh] rounded-3xl bg-[#FAFAFA] border-3 border-[#E0E0E0] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ECEFF1] bg-white">
          <div>
            <h2 className="text-xl font-black text-[#263238]">Select Level</h2>
            <p className="text-xs font-semibold text-[#78909C]">
              {completedLevels.size} / {ALL_100_LEVELS.length} Completed
            </p>
          </div>

          <button
            id="close_level_dialog_button"
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#455A64] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Daily Puzzle Quick Banner */}
          <button
            id="select_dialog_daily_button"
            type="button"
            onClick={() => {
              onSelectDaily();
              onClose();
            }}
            className="w-full text-left rounded-2xl bg-[#FFF9C4] border-2 border-[#FFB300] p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFE082] flex items-center justify-center text-xl">
                <Calendar className="w-5 h-5 text-[#E65100]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#E65100]">Today's Daily Puzzle</div>
                <div
                  className={`text-xs font-semibold ${
                    isDailyCompleted ? 'text-[#2E7D32]' : 'text-[#5D4037]'
                  }`}
                >
                  {isDailyCompleted ? 'Completed today! ✓' : 'New unique puzzle every day!'}
                </div>
              </div>
            </div>

            {dailyStreak > 0 && (
              <div className="flex items-center gap-1 bg-[#FFE082] px-2.5 py-1 rounded-full text-xs font-black text-[#E65100]">
                <Flame className="w-3.5 h-3.5 fill-[#E65100]" />
                <span>{dailyStreak}</span>
              </div>
            )}
          </button>

          {/* 100 Levels Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_100_LEVELS.map((level) => {
              const isUnlocked = level.levelNumber <= unlockedMaxLevel;
              const isCompleted = completedLevels.has(level.levelNumber);
              const isCurrent = level.levelNumber === currentLevelNumber;

              let cardBg = isCurrent ? 'bg-[#FFF8E1]' : isUnlocked ? 'bg-white' : 'bg-[#ECEFF1]';
              let borderColor = isCurrent
                ? activeMarker.primaryColor
                : isCompleted
                ? '#81C784'
                : '#CFD8DC';

              return (
                <button
                  key={level.levelNumber}
                  id={`level_item_${level.levelNumber}`}
                  ref={isCurrent ? currentCardRef : null}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectLevel(level);
                      onClose();
                    }
                  }}
                  className={`relative p-3.5 rounded-2xl border-2.5 text-center flex flex-col items-center justify-center transition-all ${cardBg} ${
                    isUnlocked
                      ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      : 'cursor-not-allowed opacity-80'
                  }`}
                  style={{
                    borderColor,
                    boxShadow: isCurrent ? `0 4px 14px ${activeMarker.primaryColor}30` : undefined,
                  }}
                >
                  <span
                    className={`text-xs font-bold mb-1 ${
                      isUnlocked ? 'text-[#37474F]' : 'text-[#90A4AE]'
                    }`}
                  >
                    Level {level.levelNumber}
                  </span>

                  {isUnlocked ? (
                    <>
                      <span className="text-3xl my-1">{level.icon}</span>
                      <span
                        className="text-xs font-black tracking-wide"
                        style={{ color: activeMarker.primaryColor }}
                      >
                        {level.word}
                      </span>

                      {/* 3 Stars */}
                      <div className="flex items-center justify-center gap-0.5 mt-2">
                        {[0, 1, 2].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              isCompleted
                                ? 'text-[#FFB300] fill-[#FFB300]'
                                : 'text-[#CFD8DC] fill-[#ECEFF1]'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-10 h-10 rounded-full bg-[#CFD8DC] flex items-center justify-center mb-1">
                        <Lock className="w-5 h-5 text-[#78909C]" />
                      </div>
                      <span className="text-xs font-medium text-[#90A4AE]">Locked</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
