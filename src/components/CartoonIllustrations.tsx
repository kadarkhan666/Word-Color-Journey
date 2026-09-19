import React, { useEffect, useRef } from 'react';
import { IllustrationType, MarkerColor } from '../types';
import { Pencil, Star } from 'lucide-react';

interface CartoonIllustrationBoxProps {
  type: IllustrationType;
  revealProgress: number; // 0 (sketch outline) -> 1 (full vibrant color)
  isCompleted: boolean;
  activeMarker: MarkerColor;
  className?: string;
}

export const CartoonIllustrationBox: React.FC<CartoonIllustrationBoxProps> = ({
  type,
  revealProgress,
  isCompleted,
  activeMarker,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Base Layer: Sketch / Outline
    drawCartoonArt(ctx, type, width, height, false, activeMarker.primaryColor);

    // 2. Draw Color Layer with clipping based on revealProgress
    if (revealProgress > 0) {
      ctx.save();
      const clipExtent = Math.min(1, revealProgress * 1.15);
      ctx.beginPath();
      ctx.rect(0, 0, width * clipExtent, height * clipExtent);
      ctx.clip();

      drawCartoonArt(ctx, type, width, height, true, activeMarker.primaryColor);
      ctx.restore();
    }

    ctx.restore();
  }, [type, revealProgress, activeMarker.primaryColor]);

  const progressFactor = Math.max(0, Math.min(1, revealProgress));
  const showPencil = revealProgress > 0.02 && revealProgress < 0.99;
  const pencilX = progressFactor * 65; // percentage
  const pencilY = progressFactor * 45; // percentage

  return (
    <div
      className={`relative w-full rounded-3xl bg-white border-3 transition-colors duration-300 p-3 shadow-md flex items-center justify-center overflow-hidden ${
        isCompleted ? 'border-[#FFD54F]' : 'border-[#ECEFF1]'
      } ${isCompleted ? 'animate-pulse-gentle' : ''} ${className}`}
      style={{
        boxShadow: isCompleted
          ? `0 8px 24px ${activeMarker.primaryColor}33`
          : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Animated Pencil Marker during color reveal */}
      {showPencil && (
        <div
          className="absolute pointer-events-none transition-all duration-75 ease-linear"
          style={{
            left: `calc(12% + ${pencilX * 0.75}%)`,
            top: `calc(10% + ${pencilY * 0.7}%)`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full bg-white border-2 shadow-lg flex items-center justify-center animate-pencil"
            style={{
              borderColor: activeMarker.primaryColor,
              color: activeMarker.pencilColor,
            }}
          >
            <Pencil className="w-5 h-5 -rotate-45" />
          </div>
        </div>
      )}

      {/* Completion Star Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#FFD54F] border-2 border-white flex items-center justify-center shadow-md animate-bounce">
          <Star className="w-4 h-4 text-[#E65100] fill-[#E65100]" />
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Cartoon Drawing Routines matching Compose CartoonIllustrations.kt
// -------------------------------------------------------------

function drawCartoonArt(
  ctx: CanvasRenderingContext2D,
  type: IllustrationType,
  w: number,
  h: number,
  isColor: boolean,
  markerTint: string
) {
  const outline = '#37474F';
  const sketchBg = '#F1F5F9';

  switch (type) {
    case IllustrationType.APPLE:
      drawApple(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.CAT:
      drawCat(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.FLOWER:
      drawFlower(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.SUN:
      drawSun(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.FISH:
      drawFish(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.RAINBOW:
      drawRainbow(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.BALLOON:
      drawBalloon(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.BUTTERFLY:
      drawButterfly(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.AVOCADO:
      drawAvocado(ctx, w, h, isColor, outline, sketchBg);
      break;
    case IllustrationType.ROCKET:
      drawRocket(ctx, w, h, isColor, outline, sketchBg);
      break;
  }
}

// 1. APPLE 🍎
function drawApple(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.58;
  const r = h * 0.32;

  const appleRed = isColor ? '#FF334B' : sketchBg;
  const leafGreen = isColor ? '#4CAF50' : sketchBg;
  const stemBrown = isColor ? '#795548' : outline;

  // Body
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.7);
  ctx.bezierCurveTo(cx - r * 0.6, cy - r * 1.1, cx - r * 1.2, cy - r * 0.2, cx - r * 0.95, cy + r * 0.6);
  ctx.bezierCurveTo(cx - r * 0.7, cy + r * 1.1, cx - r * 0.2, cy + r * 0.95, cx, cy + r * 0.75);
  ctx.bezierCurveTo(cx + r * 0.2, cy + r * 0.95, cx + r * 0.7, cy + r * 1.1, cx + r * 0.95, cy + r * 0.6);
  ctx.bezierCurveTo(cx + r * 1.2, cy - r * 0.2, cx + r * 0.6, cy - r * 1.1, cx, cy - r * 0.7);
  ctx.closePath();
  ctx.fillStyle = appleRed;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Stem
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.7);
  ctx.bezierCurveTo(cx - 5, cy - r * 1.1, cx - 3, cy - r * 1.35, cx + 8, cy - r * 1.4);
  ctx.strokeStyle = stemBrown;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Leaf
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy - r * 0.9);
  ctx.bezierCurveTo(cx + 20, cy - r * 1.35, cx + 45, cy - r * 1.2, cx + 38, cy - r * 0.75);
  ctx.bezierCurveTo(cx + 25, cy - r * 0.65, cx + 12, cy - r * 0.75, cx + 4, cy - r * 0.9);
  ctx.closePath();
  ctx.fillStyle = leafGreen;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  if (isColor) {
    // Highlight arc
    ctx.beginPath();
    ctx.arc(cx - r * 0.1, cy - r * 0.1, r * 0.6, Math.PI * 1.05, Math.PI * 1.45);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Eyes
    drawDot(ctx, cx - 14, cy, 4, '#212121');
    drawDot(ctx, cx - 15, cy - 1, 1.5, '#FFFFFF');
    drawDot(ctx, cx + 14, cy, 4, '#212121');
    drawDot(ctx, cx + 13, cy - 1, 1.5, '#FFFFFF');

    // Cheeks
    drawDot(ctx, cx - 22, cy + 6, 6, 'rgba(255, 128, 171, 0.55)');
    drawDot(ctx, cx + 22, cy + 6, 6, 'rgba(255, 128, 171, 0.55)');

    // Smile
    ctx.beginPath();
    ctx.arc(cx, cy + 2, 7, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// 2. CAT 🐱
function drawCat(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const r = h * 0.32;

  const catColor = isColor ? '#FFAB40' : sketchBg;
  const earPink = isColor ? '#FF80AB' : sketchBg;

  // Left Ear
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.8, cy - r * 0.2);
  ctx.lineTo(cx - r * 0.85, cy - r * 0.95);
  ctx.lineTo(cx - r * 0.25, cy - r * 0.75);
  ctx.closePath();
  ctx.fillStyle = catColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Right Ear
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.8, cy - r * 0.2);
  ctx.lineTo(cx + r * 0.85, cy - r * 0.95);
  ctx.lineTo(cx + r * 0.25, cy - r * 0.75);
  ctx.closePath();
  ctx.fillStyle = catColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  if (isColor) {
    // Inner ears
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.75, cy - r * 0.3);
    ctx.lineTo(cx - r * 0.8, cy - r * 0.85);
    ctx.lineTo(cx - r * 0.35, cy - r * 0.7);
    ctx.closePath();
    ctx.fillStyle = earPink;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + r * 0.75, cy - r * 0.3);
    ctx.lineTo(cx + r * 0.8, cy - r * 0.85);
    ctx.lineTo(cx + r * 0.35, cy - r * 0.7);
    ctx.closePath();
    ctx.fillStyle = earPink;
    ctx.fill();
  }

  // Face circle
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = catColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  if (isColor) {
    // Eyes
    drawDot(ctx, cx - 18, cy - 5, 6, '#263238');
    drawDot(ctx, cx - 20, cy - 7, 2.5, '#FFFFFF');
    drawDot(ctx, cx + 18, cy - 5, 6, '#263238');
    drawDot(ctx, cx + 16, cy - 7, 2.5, '#FFFFFF');

    // Nose
    drawDot(ctx, cx, cy + 4, 4, '#FF4081');

    // Mouth :3
    ctx.beginPath();
    ctx.arc(cx - 5, cy + 8, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 5, cy + 8, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Whiskers
    drawLine(ctx, cx - 25, cy + 1, cx - 45, cy - 3, outline, 2.5);
    drawLine(ctx, cx - 25, cy + 7, cx - 44, cy + 10, outline, 2.5);
    drawLine(ctx, cx + 25, cy + 1, cx + 45, cy - 3, outline, 2.5);
    drawLine(ctx, cx + 25, cy + 7, cx + 44, cy + 10, outline, 2.5);

    // Cheeks
    drawDot(ctx, cx - 26, cy + 6, 7, 'rgba(255, 128, 171, 0.45)');
    drawDot(ctx, cx + 26, cy + 6, 7, 'rgba(255, 128, 171, 0.45)');
  }
}

// 3. FLOWER 🌸
function drawFlower(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.45;
  const r = h * 0.22;

  const petalColor = isColor ? '#FF69B4' : sketchBg;
  const centerColor = isColor ? '#FFD54F' : sketchBg;
  const stemColor = isColor ? '#66BB6A' : outline;

  // Stem
  ctx.beginPath();
  ctx.moveTo(cx, cy + r);
  ctx.bezierCurveTo(cx - 10, cy + r + 20, cx + 12, cy + r + 40, cx, h * 0.92);
  ctx.strokeStyle = stemColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Leaf
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy + r + 18);
  ctx.bezierCurveTo(cx + 25, cy + r + 8, cx + 38, cy + r + 24, cx + 6, cy + r + 28);
  ctx.closePath();
  ctx.fillStyle = isColor ? '#4CAF50' : sketchBg;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6 Petals
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    const px = cx + Math.cos(angle) * r * 0.95;
    const py = cy + Math.sin(angle) * r * 0.95;

    ctx.beginPath();
    ctx.arc(px, py, r * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = petalColor;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = centerColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx - 8, cy - 2, 3, '#212121');
    drawDot(ctx, cx + 8, cy - 2, 3, '#212121');
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    drawDot(ctx, cx - 14, cy + 2, 4, 'rgba(255, 64, 129, 0.4)');
    drawDot(ctx, cx + 14, cy + 2, 4, 'rgba(255, 64, 129, 0.4)');
  }
}

// 4. SUN ☀️
function drawSun(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const r = h * 0.26;

  const sunColor = isColor ? '#FFCA28' : sketchBg;
  const rayColor = isColor ? '#FF9800' : outline;

  // Rays
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 * Math.PI) / 180;
    const sx = cx + Math.cos(angle) * (r + 4);
    const sy = cy + Math.sin(angle) * (r + 4);
    const ex = cx + Math.cos(angle) * (r + 18);
    const ey = cy + Math.sin(angle) * (r + 18);
    drawLine(ctx, sx, sy, ex, ey, rayColor, 5);
  }

  // Sun disc
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = sunColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx - 14, cy - 5, 4.5, '#212121');
    drawDot(ctx, cx - 15, cy - 6, 1.8, '#FFFFFF');
    drawDot(ctx, cx + 14, cy - 5, 4.5, '#212121');
    drawDot(ctx, cx + 13, cy - 6, 1.8, '#FFFFFF');

    drawDot(ctx, cx - 20, cy + 5, 7, 'rgba(255, 82, 82, 0.5)');
    drawDot(ctx, cx + 20, cy + 5, 7, 'rgba(255, 82, 82, 0.5)');

    ctx.beginPath();
    ctx.arc(cx, cy + 2, 10, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }
}

// 5. FISH 🐟
function drawFish(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.48;
  const cy = h * 0.52;
  const r = h * 0.28;

  const fishColor = isColor ? '#29B6F6' : sketchBg;
  const finColor = isColor ? '#FFB74D' : sketchBg;

  // Tail
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.9, cy);
  ctx.lineTo(cx - r * 1.5, cy - r * 0.6);
  ctx.bezierCurveTo(cx - r * 1.3, cy, cx - r * 1.3, cy, cx - r * 1.5, cy + r * 0.6);
  ctx.closePath();
  ctx.fillStyle = finColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Top Fin
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.3, cy - r * 0.65);
  ctx.bezierCurveTo(cx, cy - r * 1.05, cx + r * 0.3, cy - r * 0.9, cx + r * 0.4, cy - r * 0.55);
  ctx.closePath();
  ctx.fillStyle = finColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.9, cy);
  ctx.bezierCurveTo(cx - r * 0.4, cy - r * 0.8, cx + r * 0.7, cy - r * 0.65, cx + r * 1.15, cy);
  ctx.bezierCurveTo(cx + r * 0.7, cy + r * 0.65, cx - r * 0.4, cy + r * 0.8, cx - r * 0.9, cy);
  ctx.closePath();
  ctx.fillStyle = fishColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx + r * 0.6, cy - 6, 8, '#FFFFFF');
    ctx.beginPath();
    ctx.arc(cx + r * 0.6, cy - 6, 8, 0, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.stroke();

    drawDot(ctx, cx + r * 0.63, cy - 6, 4, '#212121');
    drawDot(ctx, cx + r * 0.61, cy - 7, 1.5, '#FFFFFF');

    ctx.beginPath();
    ctx.arc(cx + r * 0.85, cy - 1, 6, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Bubbles
    drawDot(ctx, cx + r * 1.35, cy - 15, 5, 'rgba(79, 195, 247, 0.55)');
    drawDot(ctx, cx + r * 1.5, cy - 28, 3, 'rgba(79, 195, 247, 0.55)');
  }
}

// 6. RAINBOW 🌈
function drawRainbow(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.64;
  const r = h * 0.42;

  const colors = isColor
    ? ['#FF3D00', '#FF9100', '#FFEA00', '#00E676', '#2979FF', '#651FFF']
    : [sketchBg, sketchBg, sketchBg, sketchBg, sketchBg, sketchBg];

  colors.forEach((color, index) => {
    const bandR = r - index * 7;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(5, bandR), Math.PI, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(5, bandR), Math.PI, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Fluffy clouds at ends
  const drawCloud = (x: number, y: number) => {
    const cFill = isColor ? '#FFFFFF' : sketchBg;
    drawDot(ctx, x, y, 14, cFill);
    drawDot(ctx, x + 13, y - 6, 18, cFill);
    drawDot(ctx, x + 26, y, 13, cFill);

    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 13, y - 6, 18, 0, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 26, y, 13, 0, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (isColor) {
      drawDot(ctx, x + 9, y - 5, 2, '#212121');
      drawDot(ctx, x + 17, y - 5, 2, '#212121');
      drawDot(ctx, x + 5, y - 1, 3, 'rgba(255, 128, 171, 0.5)');
      drawDot(ctx, x + 21, y - 1, 3, 'rgba(255, 128, 171, 0.5)');
    }
  };

  drawCloud(cx - r - 12, cy - 2);
  drawCloud(cx + r - 22, cy - 2);
}

// 7. BALLOON 🎈
function drawBalloon(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.44;
  const r = h * 0.28;

  const balloons = [
    { x: cx - 25, y: cy + 6, color: isColor ? '#42A5F5' : sketchBg, scale: 0.85 },
    { x: cx + 25, y: cy + 6, color: isColor ? '#FFCA28' : sketchBg, scale: 0.85 },
    { x: cx, y: cy - 6, color: isColor ? '#FF334B' : sketchBg, scale: 1.0 },
  ];

  balloons.forEach((b) => {
    const br = r * b.scale;
    // Oval
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, br * 0.72, br * 0.9, 0, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Knot
    ctx.beginPath();
    ctx.moveTo(b.x - 5, b.y + br * 0.9);
    ctx.lineTo(b.x + 5, b.y + br * 0.9);
    ctx.lineTo(b.x, b.y + br * 1.05);
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.stroke();

    // String
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + br * 1.05);
    ctx.bezierCurveTo(b.x - 8, b.y + br * 1.25, b.x + 8, b.y + br * 1.45, cx, h * 0.95);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isColor) {
      ctx.beginPath();
      ctx.ellipse(b.x - br * 0.25, b.y - br * 0.35, br * 0.15, br * 0.3, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
    }
  });
}

// 8. BUTTERFLY 🦋
function drawButterfly(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const r = h * 0.28;

  const wingColor = isColor ? '#AB47BC' : sketchBg;
  const wingAccent = isColor ? '#FF4081' : sketchBg;
  const bodyColor = isColor ? '#FFB74D' : outline;

  // Left Top Wing
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - 6);
  ctx.bezierCurveTo(cx - r * 1.3, cy - r * 1.1, cx - r * 1.4, cy - r * 0.1, cx - 8, cy + 6);
  ctx.closePath();
  ctx.fillStyle = wingColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Right Top Wing
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy - 6);
  ctx.bezierCurveTo(cx + r * 1.3, cy - r * 1.1, cx + r * 1.4, cy - r * 0.1, cx + 8, cy + 6);
  ctx.closePath();
  ctx.fillStyle = wingColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Bottom Wings
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 8);
  ctx.bezierCurveTo(cx - r * 1.05, cy + 12, cx - r * 0.85, cy + r * 0.95, cx - 4, cy + r * 0.6);
  ctx.closePath();
  ctx.fillStyle = wingAccent;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 6, cy + 8);
  ctx.bezierCurveTo(cx + r * 1.05, cy + 12, cx + r * 0.85, cy + r * 0.95, cx + 4, cy + r * 0.6);
  ctx.closePath();
  ctx.fillStyle = wingAccent;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx - r * 0.65, cy - r * 0.45, 7, '#FFEB3B');
    drawDot(ctx, cx + r * 0.65, cy - r * 0.45, 7, '#FFEB3B');
  }

  // Body
  ctx.beginPath();
  ctx.roundRect(cx - 5, cy - r * 0.4, 10, r * 1.1, [5]);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Antennae
  drawLine(ctx, cx - 3, cy - r * 0.4, cx - 14, cy - r * 0.8, outline, 2.5);
  drawLine(ctx, cx + 3, cy - r * 0.4, cx + 14, cy - r * 0.8, outline, 2.5);
  drawDot(ctx, cx - 14, cy - r * 0.8, 3, '#FF4081');
  drawDot(ctx, cx + 14, cy - r * 0.8, 3, '#FF4081');
}

// 9. AVOCADO 🥑
function drawAvocado(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const r = h * 0.35;

  const skinDark = isColor ? '#2E7D32' : outline;
  const fleshLight = isColor ? '#C8E6C9' : sketchBg;
  const seedBrown = isColor ? '#6D4C41' : outline;

  const makePath = (scale: number) => {
    const sr = r * scale;
    ctx.beginPath();
    ctx.moveTo(cx, cy - sr * 0.95);
    ctx.bezierCurveTo(cx + sr * 0.55, cy - sr * 0.95, cx + sr * 0.6, cy - sr * 0.2, cx + sr * 0.85, cy + sr * 0.35);
    ctx.bezierCurveTo(cx + sr * 0.95, cy + sr * 0.85, cx - sr * 0.95, cy + sr * 0.85, cx - sr * 0.85, cy + sr * 0.35);
    ctx.bezierCurveTo(cx - sr * 0.6, cy - sr * 0.2, cx - sr * 0.55, cy - sr * 0.95, cx, cy - sr * 0.95);
    ctx.closePath();
  };

  // Outer skin
  makePath(1.0);
  ctx.fillStyle = skinDark;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Flesh
  makePath(0.85);
  ctx.fillStyle = fleshLight;
  ctx.fill();

  // Seed
  const seedY = cy + r * 0.28;
  const seedR = r * 0.36;
  ctx.beginPath();
  ctx.arc(cx, seedY, seedR, 0, Math.PI * 2);
  ctx.fillStyle = seedBrown;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx - 10, seedY - 4, 3, '#212121');
    drawDot(ctx, cx - 11, seedY - 5, 1.2, '#FFFFFF');
    drawDot(ctx, cx + 10, seedY - 4, 3, '#212121');
    drawDot(ctx, cx + 9, seedY - 5, 1.2, '#FFFFFF');

    drawDot(ctx, cx - 15, seedY + 3, 4, 'rgba(255, 128, 171, 0.6)');
    drawDot(ctx, cx + 15, seedY + 3, 4, 'rgba(255, 128, 171, 0.6)');

    ctx.beginPath();
    ctx.arc(cx, seedY, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}

// 10. ROCKET 🚀
function drawRocket(ctx: CanvasRenderingContext2D, w: number, h: number, isColor: boolean, outline: string, sketchBg: string) {
  const cx = w * 0.5;
  const cy = h * 0.45;
  const r = h * 0.32;

  const rocketWhite = isColor ? '#ECEFF1' : sketchBg;
  const noseRed = isColor ? '#FF3D00' : sketchBg;
  const flameOrange = isColor ? '#FFAB00' : sketchBg;

  // Flames
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + r * 0.85);
  ctx.lineTo(cx, cy + r * 1.4);
  ctx.lineTo(cx + 15, cy + r * 0.85);
  ctx.closePath();
  ctx.fillStyle = flameOrange;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  if (isColor) {
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + r * 0.85);
    ctx.lineTo(cx, cy + r * 1.2);
    ctx.lineTo(cx + 8, cy + r * 0.85);
    ctx.closePath();
    ctx.fillStyle = '#FFEA00';
    ctx.fill();
  }

  // Side Fins
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + r * 0.3);
  ctx.lineTo(cx - r * 0.75, cy + r * 0.85);
  ctx.lineTo(cx - 15, cy + r * 0.75);
  ctx.closePath();
  ctx.fillStyle = noseRed;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 15, cy + r * 0.3);
  ctx.lineTo(cx + r * 0.75, cy + r * 0.85);
  ctx.lineTo(cx + 15, cy + r * 0.75);
  ctx.closePath();
  ctx.fillStyle = noseRed;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Fuselage Body
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 1.1);
  ctx.bezierCurveTo(cx + r * 0.55, cy - r * 0.4, cx + 20, cy + r * 0.7, cx + 15, cy + r * 0.85);
  ctx.lineTo(cx - 15, cy + r * 0.85);
  ctx.bezierCurveTo(cx - 20, cy + r * 0.7, cx - r * 0.55, cy - r * 0.4, cx, cy - r * 1.1);
  ctx.closePath();
  ctx.fillStyle = rocketWhite;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Nose cone
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 1.1);
  ctx.bezierCurveTo(cx + r * 0.3, cy - r * 0.7, cx + 15, cy - r * 0.5, cx, cy - r * 0.5);
  ctx.bezierCurveTo(cx - 15, cy - r * 0.5, cx - r * 0.3, cy - r * 0.7, cx, cy - r * 1.1);
  ctx.closePath();
  ctx.fillStyle = noseRed;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Porthole Window
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#00E5FF';
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  if (isColor) {
    drawDot(ctx, cx - 4, cy - 4, 3.5, '#FFFFFF');
  }
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}
