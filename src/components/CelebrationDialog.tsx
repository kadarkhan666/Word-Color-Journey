import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelData, MarkerColor } from '../types';
import { CartoonIllustrationBox } from './CartoonIllustrations';
import { RotateCcw, ArrowRight, Star, X, Image as ImageIcon, Compass } from 'lucide-react';
import { playCelebrationSound } from '../utils/audio';

interface CelebrationDialogProps {
  level: LevelData;
  activeMarker: MarkerColor;
  isDaily: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenGallery?: () => void;
  onOpenMap?: () => void;
  onClose: () => void;
}

export const CelebrationDialog: React.FC<CelebrationDialogProps> = ({
  level,
  activeMarker,
  isDaily,
  onNextLevel,
  onReplay,
  onOpenGallery,
  onOpenMap,
  onClose,
}) => {
  useEffect(() => {
    // Play celebratory chord
    playCelebrationSound();

    // Launch celebratory confetti fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.25, y: 0.6 },
        colors: ['#FF5277', '#FFD54F', '#00BFA5', '#7C4DFF'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.75, y: 0.6 },
        colors: ['#FF5277', '#FFD54F', '#00BFA5', '#7C4DFF'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const titleText = isDaily ? 'Daily Solved! 🌟' : 'Level Complete! 🎉';
  const subtitleText = isDaily
    ? "You've successfully solved today's daily puzzle!"
    : `You unlocked the picture for ${level.word}!`;

  return (
    <div
      id="celebration_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="celebration_modal_card"
        className="relative w-full max-w-sm rounded-3xl bg-white border-3 border-[#ECEFF1] shadow-2xl p-5 sm:p-6 text-center transform transition-all"
        style={{
          boxShadow: `0 20px 40px ${activeMarker.primaryColor}33`,
        }}
      >
        {/* Close Button */}
        <button
          id="celebration_close_button"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#455A64] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3 Golden Celebration Stars */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="w-10 h-10 rounded-full bg-[#FFF8E1] border-2 border-[#FFE082] flex items-center justify-center shadow-xs animate-bounce"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <Star className="w-6 h-6 text-[#FFB300] fill-[#FFB300]" />
            </div>
          ))}
        </div>

        {/* Praise Titles */}
        <h2 className="text-2xl font-black text-[#263238] tracking-tight">{titleText}</h2>
        <p className="text-xs font-semibold text-[#78909C] mt-0.5 mb-3">{subtitleText}</p>

        {/* Completed Illustration Preview */}
        <div className="w-44 h-44 mx-auto mb-3">
          <CartoonIllustrationBox
            type={level.illustrationType}
            revealProgress={1}
            isCompleted={true}
            activeMarker={activeMarker}
            className="w-full h-full"
          />
        </div>

        {/* Word Display with Icon & Category */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">{level.icon}</span>
          <span
            className="text-2xl font-black tracking-wider uppercase"
            style={{ color: activeMarker.primaryColor }}
          >
            {level.word}
          </span>
        </div>

        {level.category && (
          <span className="inline-block text-[11px] font-bold text-[#64748B] px-3 py-0.5 rounded-full bg-[#F1F5F9] mb-2">
            {level.category}
          </span>
        )}

        {/* Hint / Fun fact */}
        <p className="text-xs font-medium text-[#546E7A] italic px-2 mb-4">
          "{level.hintText}"
        </p>

        {/* Gallery / Map Shortcuts */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {onOpenGallery && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGallery();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-bold text-[#475569] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>In Gallery</span>
            </button>
          )}

          {onOpenMap && !isDaily && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMap();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-bold text-[#475569] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Next on Map</span>
            </button>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="celebration_replay_button"
            type="button"
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#455A64] font-bold text-sm transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          <button
            id="celebration_next_button"
            type="button"
            onClick={onNextLevel}
            className="flex-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white font-black text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: activeMarker.primaryColor,
              boxShadow: `0 6px 16px ${activeMarker.primaryColor}55`,
            }}
          >
            <span>{isDaily ? 'Done' : 'Next Level'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
