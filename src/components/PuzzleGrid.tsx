import React, { useState, useRef, useEffect } from 'react';
import { MarkerColor } from '../types';
import { playPopSound, playWrongSound } from '../utils/audio';

interface PuzzleGridProps {
  grid: string[][];
  targetCells: [number, number][];
  solvedCells: [number, number][];
  activeMarker: MarkerColor;
  hintCell: [number, number] | null;
  isShakeAnimating: boolean;
  onWordSelected: (selectedCells: [number, number][]) => void;
  className?: string;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  grid,
  solvedCells,
  activeMarker,
  hintCell,
  isShakeAnimating,
  onWordSelected,
  className = '',
}) => {
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [currentSelection, setCurrentSelection] = useState<[number, number][]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const prevSelectionLengthRef = useRef<number>(0);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  useEffect(() => {
    if (isShakeAnimating) {
      playWrongSound();
    }
  }, [isShakeAnimating]);

  // Helper to compute straight line cells between (r1, c1) and (r2, c2)
  const computeLineCells = (
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ): [number, number][] => {
    const dr = r2 - r1;
    const dc = c2 - c1;

    // Check if straight line: horizontal, vertical, or diagonal
    const isHorizontal = dr === 0 && dc !== 0;
    const isVertical = dc === 0 && dr !== 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc) && dr !== 0;

    if (!isHorizontal && !isVertical && !isDiagonal) {
      return [[r1, c1]];
    }

    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    const cells: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push([r1 + i * stepR, c1 + i * stepC]);
    }
    return cells;
  };

  const getCellFromPoint = (clientX: number, clientY: number): [number, number] | null => {
    const el = document.elementFromPoint(clientX, clientY);
    const cellEl = el?.closest('[data-cell-pos]');
    if (cellEl) {
      const r = parseInt(cellEl.getAttribute('data-row') ?? '-1', 10);
      const c = parseInt(cellEl.getAttribute('data-col') ?? '-1', 10);
      if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
        return [r, c];
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (cell) {
      isDraggingRef.current = true;
      setStartCell(cell);
      setCurrentSelection([cell]);
      prevSelectionLengthRef.current = 1;
      playPopSound(0);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !startCell) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (cell) {
      const line = computeLineCells(startCell[0], startCell[1], cell[0], cell[1]);
      setCurrentSelection(line);
      if (line.length > prevSelectionLengthRef.current) {
        playPopSound(line.length - 1);
        prevSelectionLengthRef.current = line.length;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current && currentSelection.length > 0) {
      onWordSelected(currentSelection);
    }
    isDraggingRef.current = false;
    setStartCell(null);
    setCurrentSelection([]);
    prevSelectionLengthRef.current = 0;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if pointer wasn't captured
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setStartCell(null);
    setCurrentSelection([]);
    prevSelectionLengthRef.current = 0;
  };

  const isCellInSelection = (r: number, c: number): boolean => {
    return currentSelection.some(([sr, sc]) => sr === r && sc === c);
  };

  const isCellSolved = (r: number, c: number): boolean => {
    return solvedCells.some(([sr, sc]) => sr === r && sc === c);
  };

  const isCellHinted = (r: number, c: number): boolean => {
    return hintCell !== null && hintCell[0] === r && hintCell[1] === c;
  };

  return (
    <div
      ref={gridContainerRef}
      id="puzzle_grid_container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`touch-none relative rounded-3xl bg-white border-3 border-[#ECEFF1] shadow-lg p-3 sm:p-4 select-none ${
        isShakeAnimating ? 'animate-shake' : ''
      } ${className}`}
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div
        className="grid gap-1.5 sm:gap-2 w-full max-w-[420px] mx-auto"
        style={{
          gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
          aspectRatio: `${numCols} / ${numRows}`,
        }}
      >
        {grid.map((rowArr, r) =>
          rowArr.map((letter, c) => {
            const inSelection = isCellInSelection(r, c);
            const inSolved = isCellSolved(r, c);
            const inHint = isCellHinted(r, c);

            let bgStyle = 'bg-[#F8FAFC]';
            let textStyle = 'text-[#37474F]';
            let borderStyle = 'border-transparent';
            let customBg = '';

            if (inSolved) {
              customBg = activeMarker.highlightColor;
              textStyle = 'text-[#1A237E] font-black scale-105';
              borderStyle = 'border-white';
            } else if (inSelection) {
              customBg = activeMarker.highlightColor;
              textStyle = 'text-[#212121] font-black scale-110 -translate-y-0.5 shadow-sm';
              borderStyle = 'border-white/80';
            } else if (inHint) {
              bgStyle = 'bg-[#FFF9C4]';
              textStyle = 'text-[#E65100] font-black';
              borderStyle = 'border-[#FFB300] animate-pulse';
            }

            return (
              <div
                key={`cell_${r}_${c}`}
                id={`grid_cell_${r}_${c}`}
                data-cell-pos="true"
                data-row={r}
                data-col={c}
                className={`relative flex items-center justify-center rounded-2xl font-bold transition-all duration-150 border-2 cursor-pointer ${bgStyle} ${textStyle} ${borderStyle}`}
                style={{
                  backgroundColor: customBg || undefined,
                  fontSize: numCols > 7 ? '1.1rem' : numCols > 5 ? '1.35rem' : '1.65rem',
                }}
              >
                <span className="pointer-events-none transform transition-transform">
                  {letter}
                </span>

                {/* Hint indicator dot */}
                {inHint && !inSolved && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9800] animate-ping" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
