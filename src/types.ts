export enum Direction {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
  DIAGONAL_DOWN = 'DIAGONAL_DOWN',
  DIAGONAL_UP = 'DIAGONAL_UP',
}

export interface DirectionOffset {
  dRow: number;
  dCol: number;
}

export const DIRECTION_OFFSETS: Record<Direction, DirectionOffset> = {
  [Direction.HORIZONTAL]: { dRow: 0, dCol: 1 },
  [Direction.VERTICAL]: { dRow: 1, dCol: 0 },
  [Direction.DIAGONAL_DOWN]: { dRow: 1, dCol: 1 },
  [Direction.DIAGONAL_UP]: { dRow: -1, dCol: 1 },
};

export enum IllustrationType {
  APPLE = 'APPLE',
  CAT = 'CAT',
  FLOWER = 'FLOWER',
  SUN = 'SUN',
  FISH = 'FISH',
  RAINBOW = 'RAINBOW',
  BALLOON = 'BALLOON',
  BUTTERFLY = 'BUTTERFLY',
  AVOCADO = 'AVOCADO',
  ROCKET = 'ROCKET',
}

export interface MarkerColor {
  id: number;
  name: string;
  primaryColor: string;
  highlightColor: string;
  pencilColor: string;
}

export interface GridCell {
  row: number;
  col: number;
  char: string;
}

export interface LevelData {
  levelNumber: number;
  word: string;
  icon: string;
  hintText: string;
  category?: string;
  gridRows: number;
  gridCols: number;
  startRow: number;
  startCol: number;
  direction: Direction;
  illustrationType: IllustrationType;
  targetCells: [number, number][];
}

export interface LevelProgress {
  levelNumber: number;
  isCompleted: boolean;
  stars: number;
}

export interface ChapterInfo {
  id: number;
  name: string;
  icon: string;
  tagline: string;
  startLevel: number;
  endLevel: number;
  accentColor: string;
  bgGradient: string;
}

export const CHAPTERS_INFO: ChapterInfo[] = [
  {
    id: 1,
    name: 'Sunny Meadow',
    icon: '☀️',
    tagline: 'Fresh fruits and friendly creatures',
    startLevel: 1,
    endLevel: 10,
    accentColor: '#FF5277',
    bgGradient: 'from-[#FFF0F5] to-[#FFF9E6]',
  },
  {
    id: 2,
    name: 'Safari & Pets',
    icon: '🦁',
    tagline: 'Playful companions of land and sky',
    startLevel: 11,
    endLevel: 20,
    accentColor: '#FF9800',
    bgGradient: 'from-[#FFF3E0] to-[#FFFDE7]',
  },
  {
    id: 3,
    name: 'Whispering Woods',
    icon: '🌲',
    tagline: 'Gentle winds, glowing stars, and leaves',
    startLevel: 21,
    endLevel: 30,
    accentColor: '#4CAF50',
    bgGradient: 'from-[#E8F5E9] to-[#E0F2F1]',
  },
  {
    id: 4,
    name: 'Sweet Orchard',
    icon: '🍇',
    tagline: 'Juicy berries, melons, and summer harvests',
    startLevel: 31,
    endLevel: 40,
    accentColor: '#E91E63',
    bgGradient: 'from-[#FCE4EC] to-[#FFF3E0]',
  },
  {
    id: 5,
    name: 'Toy Fair & Sweets',
    icon: '🎈',
    tagline: 'Celebration cakes, bouncy balls, and kites',
    startLevel: 41,
    endLevel: 50,
    accentColor: '#9C27B0',
    bgGradient: 'from-[#F3E5F5] to-[#EDE7F6]',
  },
  {
    id: 6,
    name: 'Coral Waters',
    icon: '🐬',
    tagline: 'Shimmering ocean depths and friendly turtles',
    startLevel: 51,
    endLevel: 60,
    accentColor: '#00BCD4',
    bgGradient: 'from-[#E0F7FA] to-[#E1F5FE]',
  },
  {
    id: 7,
    name: 'Cosmic Sky',
    icon: '🚀',
    tagline: 'Planets, blazing comets, and twinkling stars',
    startLevel: 61,
    endLevel: 70,
    accentColor: '#3F51B5',
    bgGradient: 'from-[#EDE7F6] to-[#E8EAF6]',
  },
  {
    id: 8,
    name: 'Blossom Garden',
    icon: '🌸',
    tagline: 'Fragrant roses, tulips, and fluttering bees',
    startLevel: 71,
    endLevel: 80,
    accentColor: '#E91E63',
    bgGradient: 'from-[#FCE4EC] to-[#F3E5F5]',
  },
  {
    id: 9,
    name: 'Cozy Village',
    icon: '🏡',
    tagline: 'Warm bread, bright lamps, and morning birds',
    startLevel: 81,
    endLevel: 90,
    accentColor: '#FF7043',
    bgGradient: 'from-[#FBE9E7] to-[#FFF8E1]',
  },
  {
    id: 10,
    name: 'Grand Discovery',
    icon: '🏆',
    tagline: 'Master quests, ancient keys, and rainbows',
    startLevel: 91,
    endLevel: 100,
    accentColor: '#FFB300',
    bgGradient: 'from-[#FFF8E1] to-[#FFFDE7]',
  },
];

export const DEFAULT_MARKER_COLORS: MarkerColor[] = [
  {
    id: 0,
    name: 'Bubblegum Pink',
    primaryColor: '#FF5277',
    highlightColor: 'rgba(255, 82, 119, 0.4)',
    pencilColor: '#FF4081',
  },
  {
    id: 1,
    name: 'Neon Lemon',
    primaryColor: '#FFB300',
    highlightColor: 'rgba(255, 213, 79, 0.45)',
    pencilColor: '#FFC107',
  },
  {
    id: 2,
    name: 'Sky Mint',
    primaryColor: '#00BFA5',
    highlightColor: 'rgba(128, 203, 196, 0.45)',
    pencilColor: '#26A69A',
  },
  {
    id: 3,
    name: 'Lavender Pop',
    primaryColor: '#AB47BC',
    highlightColor: 'rgba(186, 104, 200, 0.45)',
    pencilColor: '#8E24AA',
  },
  {
    id: 4,
    name: 'Tangerine Glow',
    primaryColor: '#FF7043',
    highlightColor: 'rgba(255, 138, 101, 0.45)',
    pencilColor: '#F4511E',
  },
];
