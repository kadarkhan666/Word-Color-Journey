import { LevelData, DIRECTION_OFFSETS } from '../types';
import { SeededRandom } from './prng';

const FILLER_POOL = 'ABCDEFGHJKLMNOPRSTUVWYZ';

export function generateGrid(level: LevelData, customSeed?: number | null): string[][] {
  const rows = level.gridRows;
  const cols = level.gridCols;
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));

  const seed = customSeed ?? (level.levelNumber * 1000 + 42);
  const rng = new SeededRandom(seed);

  // Fill background letters
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = FILLER_POOL[rng.nextInt(FILLER_POOL.length)];
    }
  }

  // Place target word
  const word = level.word;
  const offset = DIRECTION_OFFSETS[level.direction];
  for (let i = 0; i < word.length; i++) {
    const r = level.startRow + i * offset.dRow;
    const c = level.startCol + i * offset.dCol;
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      grid[r][c] = word[i];
    }
  }

  return grid;
}
