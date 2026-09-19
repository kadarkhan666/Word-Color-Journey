import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  LevelData,
  MarkerColor,
  DEFAULT_MARKER_COLORS,
} from './types';
import { ALL_100_LEVELS, createLevel } from './models/LevelCatalog';
import {
  generateDailyPuzzle,
  getTodayDateKey,
  getTodayFormattedDisplay,
} from './models/DailyPuzzleGenerator';
import { generateGrid } from './models/GridGenerator';
import { CartoonIllustrationBox } from './components/CartoonIllustrations';
import { ColorMarkerSelector } from './components/ColorMarkerSelector';
import { PuzzleGrid } from './components/PuzzleGrid';
import { CelebrationDialog } from './components/CelebrationDialog';
import { LevelSelectDialog } from './components/LevelSelectDialog';
import { LevelMapSelector } from './components/LevelMapSelector';
import { GalleryModal } from './components/GalleryModal';
import {
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Grid,
  Calendar,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Star,
  Sparkles,
} from 'lucide-react';
import {
  playPopSound,
  playCelebrationSound,
  playHintSound,
  toggleAudioMute,
  getIsMuted,
} from './utils/audio';

const PRAISE_WORDS = ['Amazing!', 'Great Job!', 'Perfect!', 'Super!', 'Fantastic!', 'Brilliant!'];

export const App: React.FC = () => {
  // Persistence states
  const [unlockedMaxLevel, setUnlockedMaxLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('max_unlocked_level');
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('completed_levels');
      return saved ? new Set(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('daily_streak');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lastCompletedDailyDate, setLastCompletedDailyDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem('last_completed_daily_date');
    } catch {
      return null;
    }
  });

  // Game mode
  const [isDailyMode, setIsDailyMode] = useState<boolean>(false);
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);

  // Active Marker (5 juicy colors)
  const [activeMarker, setActiveMarker] = useState<MarkerColor>(DEFAULT_MARKER_COLORS[0]);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => getIsMuted());

  // Screen / Modal Overlays
  const [isCelebrationVisible, setIsCelebrationVisible] = useState<boolean>(false);
  const [isLevelSelectVisible, setIsLevelSelectVisible] = useState<boolean>(false);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState<boolean>(false);

  // Puzzle State
  const todayKey = useMemo(() => getTodayDateKey(), []);
  const todayFormatted = useMemo(() => getTodayFormattedDisplay(), []);
  const isDailyCompletedToday = lastCompletedDailyDate === todayKey;

  const currentLevel: LevelData = useMemo(() => {
    if (isDailyMode) {
      return generateDailyPuzzle(todayKey);
    }
    return ALL_100_LEVELS[currentLevelNumber - 1] || createLevel(currentLevelNumber);
  }, [isDailyMode, todayKey, currentLevelNumber]);

  const [grid, setGrid] = useState<string[][]>(() => generateGrid(currentLevel));
  const [solvedCells, setSolvedCells] = useState<[number, number][]>([]);
  const [revealProgress, setRevealProgress] = useState<number>(0);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [isShakeAnimating, setIsShakeAnimating] = useState<boolean>(false);
  const [hintCell, setHintCell] = useState<[number, number] | null>(null);
  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset or reload puzzle on level or mode change
  const loadPuzzle = useCallback((level: LevelData) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
    setGrid(generateGrid(level));
    setSolvedCells([]);
    setRevealProgress(0);
    setIsLevelCompleted(false);
    setIsShakeAnimating(false);
    setHintCell(null);
    setPraiseMessage(null);
    setIsCelebrationVisible(false);
  }, []);

  useEffect(() => {
    loadPuzzle(currentLevel);
  }, [currentLevel, loadPuzzle]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextMuted = toggleAudioMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playPopSound(0);
    }
  };

  // Trigger reveal animation when word is found
  const startRevealAnimation = () => {
    const startTime = performance.now();
    const duration = 2100; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      setRevealProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsLevelCompleted(true);
        handleLevelCompletion();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleLevelCompletion = () => {
    if (isDailyMode) {
      if (lastCompletedDailyDate !== todayKey) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = getTodayDateKey(yesterday);

        let newStreak = 1;
        if (lastCompletedDailyDate === yesterdayKey) {
          newStreak = dailyStreak + 1;
        }
        setDailyStreak(newStreak);
        setLastCompletedDailyDate(todayKey);
        try {
          localStorage.setItem('daily_streak', String(newStreak));
          localStorage.setItem('last_completed_daily_date', todayKey);
        } catch {
          // localStorage disabled
        }
      }
    } else {
      const nextUnlocked = Math.max(unlockedMaxLevel, currentLevelNumber + 1);
      setUnlockedMaxLevel(nextUnlocked);
      setCompletedLevels((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(currentLevelNumber);
        try {
          localStorage.setItem('completed_levels', JSON.stringify(Array.from(nextSet)));
          localStorage.setItem('max_unlocked_level', String(nextUnlocked));
        } catch {
          // Ignore storage errors
        }
        return nextSet;
      });
    }

    setTimeout(() => {
      setIsCelebrationVisible(true);
    }, 450);
  };

  // Word selection verification
  const handleWordSelected = (selected: [number, number][]) => {
    if (isLevelCompleted || solvedCells.length > 0) return;

    const target = currentLevel.targetCells;
    if (selected.length !== target.length) {
      triggerShake();
      return;
    }

    // Check forward
    const matchForward = selected.every(
      (cell, idx) => cell[0] === target[idx][0] && cell[1] === target[idx][1]
    );

    // Check backward
    const matchBackward = selected.every(
      (cell, idx) =>
        cell[0] === target[target.length - 1 - idx][0] &&
        cell[1] === target[target.length - 1 - idx][1]
    );

    if (matchForward || matchBackward) {
      setSolvedCells(target);
      const randomPraise = PRAISE_WORDS[Math.floor(Math.random() * PRAISE_WORDS.length)];
      setPraiseMessage(randomPraise);
      setHintCell(null);
      startRevealAnimation();
    } else {
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShakeAnimating(true);
    setTimeout(() => {
      setIsShakeAnimating(false);
    }, 350);
  };

  // Hint button handler
  const handleHintClick = () => {
    if (isLevelCompleted || solvedCells.length > 0) return;
    if (currentLevel.targetCells.length > 0) {
      const firstCell = currentLevel.targetCells[0];
      setHintCell(firstCell);
      playHintSound();

      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setHintCell(null);
      }, 3500);
    }
  };

  const handleNextLevel = () => {
    if (isDailyMode) {
      setIsDailyMode(false);
      setIsCelebrationVisible(false);
    } else {
      if (currentLevelNumber < ALL_100_LEVELS.length) {
        setCurrentLevelNumber((prev) => prev + 1);
      }
      setIsCelebrationVisible(false);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelNumber > 1) {
      setCurrentLevelNumber((prev) => prev - 1);
    }
  };

  const handleSelectLevel = (level: LevelData) => {
    setIsDailyMode(false);
    setCurrentLevelNumber(level.levelNumber);
  };

  const handleSelectDaily = () => {
    setIsDailyMode(true);
  };

  // Stars calculation for the current level
  const isCurrentLevelSolved = isDailyMode ? isDailyCompletedToday : completedLevels.has(currentLevelNumber);

  return (
    <div
      id="app_container"
      className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-start text-[#263238] antialiased px-3 sm:px-6 py-3 sm:py-6"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-5">
        {/* Top Header Navigation */}
        <header
          id="app_header"
          className="w-full bg-white rounded-3xl border-2 border-[#ECEFF1] shadow-xs px-3.5 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3"
        >
          {/* Left: Level Switcher or Daily Label */}
          <div className="flex items-center gap-2">
            {!isDailyMode ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="header_prev_level_button"
                  type="button"
                  disabled={currentLevelNumber <= 1}
                  onClick={handlePrevLevel}
                  className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#455A64] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Award className="w-4 h-4 text-[#FFB300]" />
                  <span className="text-xs font-black text-[#37474F]">
                    Level {currentLevelNumber}
                  </span>
                </div>
                <button
                  id="header_next_level_button"
                  type="button"
                  disabled={currentLevelNumber >= unlockedMaxLevel || currentLevelNumber >= ALL_100_LEVELS.length}
                  onClick={handleNextLevel}
                  className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#455A64] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header_back_to_levels_button"
                type="button"
                onClick={() => setIsDailyMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#ECEFF1] hover:bg-[#CFD8DC] text-xs font-bold text-[#455A64] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Classic</span>
              </button>
            )}

            {/* Stars Indicator */}
            <div className="hidden sm:flex items-center gap-0.5 ml-1">
              {[0, 1, 2].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    isCurrentLevelSolved
                      ? 'text-[#F59E0B] fill-[#F59E0B]'
                      : 'text-[#E2E8F0] fill-[#F1F5F9]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center / Right: Navigation buttons for Map, Gallery, Daily & Sound */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* 100 Levels Map Button */}
            <button
              id="open_map_selector_button"
              type="button"
              onClick={() => setIsMapVisible(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#334155] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              <Compass className="w-4 h-4 text-[#0EA5E9]" />
              <span className="hidden sm:inline">Adventure Map</span>
              <span className="sm:hidden">Map</span>
            </button>

            {/* 100 Pictures Gallery Button */}
            <button
              id="open_gallery_button"
              type="button"
              onClick={() => setIsGalleryVisible(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#334155] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
              <span className="hidden sm:inline">Gallery</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#8B5CF6] text-white">
                {completedLevels.size}
              </span>
            </button>

            {/* Daily Mode Switcher */}
            <button
              id="mode_switch_daily"
              type="button"
              onClick={() => setIsDailyMode(!isDailyMode)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                isDailyMode
                  ? 'bg-[#FFF9C4] text-[#E65100] border-[#FFB300] shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0] hover:text-[#E65100]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily</span>
              {dailyStreak > 0 && (
                <span className="flex items-center text-[10px] text-[#E65100] font-black">
                  <Flame className="w-3 h-3 fill-[#E65100]" />
                  {dailyStreak}
                </span>
              )}
            </button>

            {/* Sound Mute / Unmute Button */}
            <button
              id="sound_toggle_button"
              type="button"
              onClick={handleToggleAudio}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#475569] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#94A3B8]" /> : <Volume2 className="w-4 h-4 text-[#059669]" />}
            </button>
          </div>
        </header>

        {/* Main Game Board Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Picture Reveal & Word Clue */}
          <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
            {/* Word Banner / Clue Card */}
            <div
              id="word_target_card"
              className="bg-white rounded-3xl border-2 border-[#ECEFF1] shadow-xs p-4 flex flex-col items-center justify-center text-center"
            >
              {/* Category pill */}
              {currentLevel.category && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] mb-2">
                  {currentLevel.category}
                </span>
              )}

              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-3xl">{currentLevel.icon}</span>
                <span
                  className="text-3xl font-black tracking-wider uppercase"
                  style={{ color: activeMarker.primaryColor }}
                >
                  {currentLevel.word}
                </span>
              </div>

              {/* Letter blank slot bubbles */}
              <div className="flex items-center justify-center gap-1.5 my-1.5">
                {currentLevel.word.split('').map((char, idx) => {
                  const isFound = solvedCells.length > 0;
                  return (
                    <span
                      key={idx}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${
                        isFound
                          ? 'bg-white shadow-xs font-black'
                          : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#94A3B8]'
                      }`}
                      style={{
                        borderColor: isFound ? activeMarker.primaryColor : undefined,
                        color: isFound ? activeMarker.primaryColor : undefined,
                      }}
                    >
                      {isFound ? char : '_'}
                    </span>
                  );
                })}
              </div>

              <p className="text-xs font-medium text-[#78909C] max-w-xs line-clamp-2 mt-1">
                {currentLevel.hintText}
              </p>

              {/* Praise Banner on correct match */}
              {praiseMessage && (
                <div
                  className="mt-2 text-sm font-black tracking-wide animate-bounce"
                  style={{ color: activeMarker.primaryColor }}
                >
                  ✨ {praiseMessage} ✨
                </div>
              )}
            </div>

            {/* Cartoon Picture Reveal Canvas */}
            <div className="w-full aspect-square max-h-[350px] mx-auto">
              <CartoonIllustrationBox
                type={currentLevel.illustrationType}
                revealProgress={revealProgress}
                isCompleted={isLevelCompleted}
                activeMarker={activeMarker}
                className="w-full h-full"
              />
            </div>

            {/* Color Marker Selector with 5 Juicy Vibrant Highlighters */}
            <div className="bg-white rounded-2xl border-2 border-[#ECEFF1] shadow-xs p-2">
              <div className="text-[10px] font-bold text-center text-[#90A4AE] mb-1 uppercase tracking-wider">
                Select Marker Color
              </div>
              <ColorMarkerSelector
                markers={DEFAULT_MARKER_COLORS}
                selectedMarker={activeMarker}
                onMarkerSelected={setActiveMarker}
              />
            </div>
          </div>

          {/* Right Column: Puzzle Matrix Grid & Action Controls */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            {/* Puzzle Matrix Grid with popping animations */}
            <div className="flex justify-center">
              <PuzzleGrid
                grid={grid}
                targetCells={currentLevel.targetCells}
                solvedCells={solvedCells}
                activeMarker={activeMarker}
                hintCell={hintCell}
                isShakeAnimating={isShakeAnimating}
                onWordSelected={handleWordSelected}
                className="w-full max-w-[440px]"
              />
            </div>

            {/* Bottom Actions: Reset, Hint, Next */}
            <div
              id="game_action_toolbar"
              className="bg-white rounded-3xl border-2 border-[#ECEFF1] shadow-xs p-3 flex items-center justify-between gap-3 max-w-[440px] mx-auto w-full"
            >
              <button
                id="reset_puzzle_button"
                type="button"
                onClick={() => loadPuzzle(currentLevel)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#455A64] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                id="hint_puzzle_button"
                type="button"
                disabled={isLevelCompleted || solvedCells.length > 0}
                onClick={handleHintClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  hintCell !== null
                    ? 'bg-[#FFF9C4] text-[#E65100] border border-[#FFB300] scale-105 shadow-xs'
                    : 'bg-[#FFFDE7] hover:bg-[#FFF9C4] text-[#F57F17] border border-[#FFF59D] cursor-pointer'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>{hintCell !== null ? 'Hint Active' : 'Hint'}</span>
              </button>

              <button
                id="next_level_button"
                type="button"
                disabled={!isLevelCompleted && currentLevelNumber >= unlockedMaxLevel}
                onClick={handleNextLevel}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white text-xs font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                style={{
                  backgroundColor: activeMarker.primaryColor,
                }}
              >
                <span>{isDailyMode ? 'Daily Solved' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Date Banner or Level Info Bar */}
            {isDailyMode ? (
              <div className="bg-[#FFFDE7] rounded-2xl border border-[#FFF59D] p-3 text-center max-w-[440px] mx-auto w-full">
                <div className="text-xs font-extrabold text-[#E65100]">{todayFormatted}</div>
                <div className="text-[11px] text-[#795548] mt-0.5">
                  {isDailyCompletedToday
                    ? "✓ You have successfully solved today's puzzle!"
                    : 'Swipe the word in any direction to reveal the picture!'}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] max-w-[440px] mx-auto w-full text-xs text-[#64748B]">
                <span className="font-semibold">
                  Progress: {completedLevels.size} / 100 Completed
                </span>
                <button
                  type="button"
                  onClick={() => setIsMapVisible(true)}
                  className="font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 1. Level Complete Celebration Modal (Enhanced with Gallery & Map shortcuts) */}
      {isCelebrationVisible && (
        <CelebrationDialog
          level={currentLevel}
          activeMarker={activeMarker}
          isDaily={isDailyMode}
          onNextLevel={handleNextLevel}
          onReplay={() => {
            loadPuzzle(currentLevel);
          }}
          onOpenGallery={() => setIsGalleryVisible(true)}
          onOpenMap={() => setIsMapVisible(true)}
          onClose={() => setIsCelebrationVisible(false)}
        />
      )}

      {/* 2. 100 Levels Map Selector (Adventure Map) */}
      {isMapVisible && (
        <LevelMapSelector
          currentLevelNumber={currentLevelNumber}
          unlockedMaxLevel={unlockedMaxLevel}
          completedLevels={completedLevels}
          activeMarker={activeMarker}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsMapVisible(false)}
        />
      )}

      {/* 3. 100 Pictures Collection Gallery */}
      {isGalleryVisible && (
        <GalleryModal
          completedLevels={completedLevels}
          activeMarker={activeMarker}
          onSelectLevelToPlay={handleSelectLevel}
          onClose={() => setIsGalleryVisible(false)}
        />
      )}

      {/* 4. Classic Grid Level Select Dialog (Fallback quick grid) */}
      {isLevelSelectVisible && (
        <LevelSelectDialog
          currentLevelNumber={currentLevelNumber}
          unlockedMaxLevel={unlockedMaxLevel}
          completedLevels={completedLevels}
          activeMarker={activeMarker}
          isDailyCompleted={isDailyCompletedToday}
          dailyStreak={dailyStreak}
          onSelectLevel={handleSelectLevel}
          onSelectDaily={handleSelectDaily}
          onClose={() => setIsLevelSelectVisible(false)}
        />
      )}
    </div>
  );
};

export default App;
