package com.example.ui.illustrations

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.unit.dp
import com.example.model.IllustrationType
import com.example.model.MarkerColor
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun CartoonIllustrationBox(
    type: IllustrationType,
    revealProgress: Float, // 0f (sketch outline) -> 1f (full vibrant color)
    isCompleted: Boolean,
    activeMarker: MarkerColor,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "illustration")

    // Pencil drawing wiggle animation
    val pencilAngle by infiniteTransition.animateFloat(
        initialValue = -15f,
        targetValue = 15f,
        animationSpec = infiniteRepeatable(
            animation = tween(220, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pencilAngle"
    )

    val celebrationBounce by infiniteTransition.animateFloat(
        initialValue = 0.98f,
        targetValue = 1.02f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "celebrationBounce"
    )

    Box(
        modifier = modifier
            .shadow(6.dp, RoundedCornerShape(24.dp), spotColor = activeMarker.primaryColor.copy(alpha = 0.25f))
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xFFFFFFFF))
            .border(3.dp, if (isCompleted) activeMarker.primaryColor else Color(0xFFECEFF1), RoundedCornerShape(24.dp))
            .padding(12.dp),
        contentAlignment = Alignment.Center
    ) {
        // Cute canvas drawing of the cartoon
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .scale(if (isCompleted) celebrationBounce else 1f)
        ) {
            val canvasW = size.width
            val canvasH = size.height

            // 1. Base Layer: Sketch / Outline representation
            drawCartoonArt(
                type = type,
                isColor = false,
                markerTint = activeMarker.primaryColor
            )

            // 2. Progressive Colour Fill Layer (clipped by revealProgress)
            if (revealProgress > 0f) {
                // Reveal from left-to-right / top-to-bottom diagonally
                clipRect(
                    left = 0f,
                    top = 0f,
                    right = canvasW * (revealProgress * 1.15f).coerceAtMost(1f),
                    bottom = canvasH * (revealProgress * 1.15f).coerceAtMost(1f)
                ) {
                    drawCartoonArt(
                        type = type,
                        isColor = true,
                        markerTint = activeMarker.primaryColor
                    )
                }
            }
        }

        // Animated marker / pencil effect while colouring
        if (revealProgress > 0.02f && revealProgress < 0.99f) {
            val progressFactor = revealProgress.coerceIn(0f, 1f)
            val posX = (progressFactor * 0.75f) * 200f
            val posY = (progressFactor * 0.7f) * 120f

            Box(
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .offset(x = posX.dp, y = posY.dp)
                    .rotate(pencilAngle - 30f)
                    .size(44.dp)
                    .background(Color.White, CircleShape)
                    .border(2.dp, activeMarker.primaryColor, CircleShape)
                    .shadow(4.dp, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Pencil colouring effect",
                    tint = activeMarker.pencilColor,
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        // Completion star sparkles badge
        if (isCompleted) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(4.dp)
                    .size(32.dp)
                    .background(Color(0xFFFFD54F), CircleShape)
                    .border(2.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Completed Star",
                    tint = Color(0xFFE65100),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

private fun DrawScope.drawCartoonArt(
    type: IllustrationType,
    isColor: Boolean,
    markerTint: Color
) {
    val outlineColor = Color(0xFF37474F)
    val sketchTint = Color(0xFFF1F5F9)

    when (type) {
        IllustrationType.APPLE -> drawApple(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.CAT -> drawCat(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.FLOWER -> drawFlower(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.SUN -> drawSun(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.FISH -> drawFish(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.RAINBOW -> drawRainbow(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.BALLOON -> drawBalloon(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.BUTTERFLY -> drawButterfly(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.AVOCADO -> drawAvocado(isColor, outlineColor, sketchTint, markerTint)
        IllustrationType.ROCKET -> drawRocket(isColor, outlineColor, sketchTint, markerTint)
    }
}

// 1. APPLE 🍎
private fun DrawScope.drawApple(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.58f
    val r = size.height * 0.32f

    val appleRed = if (isColor) Color(0xFFFF334B) else sketchBg
    val leafGreen = if (isColor) Color(0xFF4CAF50) else sketchBg
    val stemBrown = if (isColor) Color(0xFF795548) else outline

    // Apple body path
    val path = Path().apply {
        moveTo(cx, cy - r * 0.7f)
        cubicTo(cx - r * 0.6f, cy - r * 1.1f, cx - r * 1.2f, cy - r * 0.2f, cx - r * 0.95f, cy + r * 0.6f)
        cubicTo(cx - r * 0.7f, cy + r * 1.1f, cx - r * 0.2f, cy + r * 0.95f, cx, cy + r * 0.75f)
        cubicTo(cx + r * 0.2f, cy + r * 0.95f, cx + r * 0.7f, cy + r * 1.1f, cx + r * 0.95f, cy + r * 0.6f)
        cubicTo(cx + r * 1.2f, cy - r * 0.2f, cx + r * 0.6f, cy - r * 1.1f, cx, cy - r * 0.7f)
        close()
    }
    drawPath(path, appleRed)
    drawPath(path, outline, style = Stroke(width = 8f, cap = StrokeCap.Round, join = StrokeJoin.Round))

    // Stem
    val stemPath = Path().apply {
        moveTo(cx, cy - r * 0.7f)
        cubicTo(cx - 10f, cy - r * 1.1f, cx - 5f, cy - r * 1.35f, cx + 15f, cy - r * 1.4f)
    }
    drawPath(stemPath, stemBrown, style = Stroke(width = 12f, cap = StrokeCap.Round))

    // Leaf
    val leafPath = Path().apply {
        moveTo(cx + 8f, cy - r * 0.9f)
        cubicTo(cx + 35f, cy - r * 1.35f, cx + 70f, cy - r * 1.2f, cx + 60f, cy - r * 0.75f)
        cubicTo(cx + 40f, cy - r * 0.65f, cx + 20f, cy - r * 0.75f, cx + 8f, cy - r * 0.9f)
        close()
    }
    drawPath(leafPath, leafGreen)
    drawPath(leafPath, outline, style = Stroke(width = 6f, cap = StrokeCap.Round))

    // Cute kawaii face & highlight
    if (isColor) {
        // Highlight arc
        drawArc(
            color = Color(0x66FFFFFF),
            startAngle = 190f,
            sweepAngle = 70f,
            useCenter = false,
            topLeft = Offset(cx - r * 0.75f, cy - r * 0.6f),
            size = Size(r * 1.4f, r * 1.3f),
            style = Stroke(width = 10f, cap = StrokeCap.Round)
        )
        // Eyes
        drawCircle(Color(0xFF212121), radius = 7f, center = Offset(cx - 24f, cy))
        drawCircle(Color.White, radius = 2.5f, center = Offset(cx - 26f, cy - 2f))
        drawCircle(Color(0xFF212121), radius = 7f, center = Offset(cx + 24f, cy))
        drawCircle(Color.White, radius = 2.5f, center = Offset(cx + 22f, cy - 2f))
        // Cheeks
        drawCircle(Color(0x88FF80AB), radius = 10f, center = Offset(cx - 36f, cy + 12f))
        drawCircle(Color(0x88FF80AB), radius = 10f, center = Offset(cx + 36f, cy + 12f))
        // Smile
        drawArc(
            color = outline,
            startAngle = 20f,
            sweepAngle = 140f,
            useCenter = false,
            topLeft = Offset(cx - 10f, cy + 4f),
            size = Size(20f, 16f),
            style = Stroke(width = 6f, cap = StrokeCap.Round)
        )
    }
}

// 2. CAT 🐱
private fun DrawScope.drawCat(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.52f
    val r = size.height * 0.32f

    val catColor = if (isColor) Color(0xFFFFAB40) else sketchBg
    val earPink = if (isColor) Color(0xFFFF80AB) else sketchBg

    // Ears
    val leftEar = Path().apply {
        moveTo(cx - r * 0.8f, cy - r * 0.2f)
        lineTo(cx - r * 0.85f, cy - r * 0.95f)
        lineTo(cx - r * 0.25f, cy - r * 0.75f)
        close()
    }
    val rightEar = Path().apply {
        moveTo(cx + r * 0.8f, cy - r * 0.2f)
        lineTo(cx + r * 0.85f, cy - r * 0.95f)
        lineTo(cx + r * 0.25f, cy - r * 0.75f)
        close()
    }
    drawPath(leftEar, catColor)
    drawPath(leftEar, outline, style = Stroke(width = 8f, cap = StrokeCap.Round, join = StrokeJoin.Round))
    drawPath(rightEar, catColor)
    drawPath(rightEar, outline, style = Stroke(width = 8f, cap = StrokeCap.Round, join = StrokeJoin.Round))

    if (isColor) {
        val innerLeftEar = Path().apply {
            moveTo(cx - r * 0.75f, cy - r * 0.3f)
            lineTo(cx - r * 0.8f, cy - r * 0.85f)
            lineTo(cx - r * 0.35f, cy - r * 0.7f)
            close()
        }
        val innerRightEar = Path().apply {
            moveTo(cx + r * 0.75f, cy - r * 0.3f)
            lineTo(cx + r * 0.8f, cy - r * 0.85f)
            lineTo(cx + r * 0.35f, cy - r * 0.7f)
            close()
        }
        drawPath(innerLeftEar, earPink)
        drawPath(innerRightEar, earPink)
    }

    // Cat face circle
    drawCircle(catColor, radius = r * 0.82f, center = Offset(cx, cy))
    drawCircle(outline, radius = r * 0.82f, center = Offset(cx, cy), style = Stroke(width = 8f))

    if (isColor) {
        // Big sparkling eyes
        drawCircle(Color(0xFF263238), radius = 10f, center = Offset(cx - 30f, cy - 8f))
        drawCircle(Color.White, radius = 4f, center = Offset(cx - 33f, cy - 11f))
        drawCircle(Color(0xFF263238), radius = 10f, center = Offset(cx + 30f, cy - 8f))
        drawCircle(Color.White, radius = 4f, center = Offset(cx + 27f, cy - 11f))

        // Pink nose & mouth
        drawCircle(Color(0xFFFF4081), radius = 6f, center = Offset(cx, cy + 8f))
        // :3 mouth
        val mouthL = Path().apply {
            moveTo(cx, cy + 12f)
            cubicTo(cx - 8f, cy + 24f, cx - 18f, cy + 18f, cx - 18f, cy + 12f)
        }
        val mouthR = Path().apply {
            moveTo(cx, cy + 12f)
            cubicTo(cx + 8f, cy + 24f, cx + 18f, cy + 18f, cx + 18f, cy + 12f)
        }
        drawPath(mouthL, outline, style = Stroke(width = 5f, cap = StrokeCap.Round))
        drawPath(mouthR, outline, style = Stroke(width = 5f, cap = StrokeCap.Round))

        // Whiskers
        drawLine(outline, Offset(cx - 40f, cy + 2f), Offset(cx - 75f, cy - 4f), strokeWidth = 5f, cap = StrokeCap.Round)
        drawLine(outline, Offset(cx - 40f, cy + 12f), Offset(cx - 72f, cy + 16f), strokeWidth = 5f, cap = StrokeCap.Round)
        drawLine(outline, Offset(cx + 40f, cy + 2f), Offset(cx + 75f, cy - 4f), strokeWidth = 5f, cap = StrokeCap.Round)
        drawLine(outline, Offset(cx + 40f, cy + 12f), Offset(cx + 72f, cy + 16f), strokeWidth = 5f, cap = StrokeCap.Round)

        // Rosy cheeks
        drawCircle(Color(0x66FF80AB), radius = 12f, center = Offset(cx - 45f, cy + 10f))
        drawCircle(Color(0x66FF80AB), radius = 12f, center = Offset(cx + 45f, cy + 10f))
    }
}

// 3. FLOWER 🌸
private fun DrawScope.drawFlower(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.45f
    val r = size.height * 0.22f

    val petalColor = if (isColor) Color(0xFFFF69B4) else sketchBg
    val centerColor = if (isColor) Color(0xFFFFD54F) else sketchBg
    val stemColor = if (isColor) Color(0xFF66BB6A) else outline

    // Stem
    val stem = Path().apply {
        moveTo(cx, cy + r)
        cubicTo(cx - 15f, cy + r + 35f, cx + 20f, cy + r + 60f, cx, size.height * 0.92f)
    }
    drawPath(stem, stemColor, style = Stroke(width = 10f, cap = StrokeCap.Round))

    // Leaf
    val leaf = Path().apply {
        moveTo(cx + 6f, cy + r + 30f)
        cubicTo(cx + 35f, cy + r + 15f, cx + 55f, cy + r + 35f, cx + 10f, cy + r + 45f)
        close()
    }
    drawPath(leaf, if (isColor) Color(0xFF4CAF50) else sketchBg)
    drawPath(leaf, outline, style = Stroke(width = 5f, cap = StrokeCap.Round))

    // 6 Petals around center
    for (i in 0 until 6) {
        val angle = (i * 60.0) * Math.PI / 180.0
        val px = (cx + cos(angle) * r * 0.95f).toFloat()
        val py = (cy + sin(angle) * r * 0.95f).toFloat()
        drawCircle(petalColor, radius = r * 0.65f, center = Offset(px, py))
        drawCircle(outline, radius = r * 0.65f, center = Offset(px, py), style = Stroke(width = 7f))
    }

    // Center disc
    drawCircle(centerColor, radius = r * 0.72f, center = Offset(cx, cy))
    drawCircle(outline, radius = r * 0.72f, center = Offset(cx, cy), style = Stroke(width = 7f))

    if (isColor) {
        // Smiling face in center
        drawCircle(Color(0xFF212121), radius = 5f, center = Offset(cx - 15f, cy - 4f))
        drawCircle(Color(0xFF212121), radius = 5f, center = Offset(cx + 15f, cy - 4f))
        drawArc(
            color = outline,
            startAngle = 20f,
            sweepAngle = 140f,
            useCenter = false,
            topLeft = Offset(cx - 12f, cy - 2f),
            size = Size(24f, 18f),
            style = Stroke(width = 5f, cap = StrokeCap.Round)
        )
        drawCircle(Color(0x66FF4081), radius = 7f, center = Offset(cx - 24f, cy + 4f))
        drawCircle(Color(0x66FF4081), radius = 7f, center = Offset(cx + 24f, cy + 4f))
    }
}

// 4. SUN ☀️
private fun DrawScope.drawSun(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.5f
    val r = size.height * 0.26f

    val sunColor = if (isColor) Color(0xFFFFCA28) else sketchBg
    val rayColor = if (isColor) Color(0xFFFF9800) else outline

    // 8 Smiling radiating rays
    for (i in 0 until 8) {
        val angle = (i * 45.0) * Math.PI / 180.0
        val startX = (cx + cos(angle) * (r + 8f)).toFloat()
        val startY = (cy + sin(angle) * (r + 8f)).toFloat()
        val endX = (cx + cos(angle) * (r + 28f)).toFloat()
        val endY = (cy + sin(angle) * (r + 28f)).toFloat()
        drawLine(rayColor, Offset(startX, startY), Offset(endX, endY), strokeWidth = 10f, cap = StrokeCap.Round)
    }

    // Main sun body
    drawCircle(sunColor, radius = r, center = Offset(cx, cy))
    drawCircle(outline, radius = r, center = Offset(cx, cy), style = Stroke(width = 8f))

    if (isColor) {
        // Cute smiling sunglasses or big smiling eyes
        drawCircle(Color(0xFF212121), radius = 8f, center = Offset(cx - 22f, cy - 8f))
        drawCircle(Color.White, radius = 3f, center = Offset(cx - 25f, cy - 11f))
        drawCircle(Color(0xFF212121), radius = 8f, center = Offset(cx + 22f, cy - 8f))
        drawCircle(Color.White, radius = 3f, center = Offset(cx + 19f, cy - 11f))

        // Rosy cheeks
        drawCircle(Color(0x88FF5252), radius = 12f, center = Offset(cx - 35f, cy + 8f))
        drawCircle(Color(0x88FF5252), radius = 12f, center = Offset(cx + 35f, cy + 8f))

        // Sweet open smile
        drawArc(
            color = outline,
            startAngle = 10f,
            sweepAngle = 160f,
            useCenter = false,
            topLeft = Offset(cx - 18f, cy - 2f),
            size = Size(36f, 28f),
            style = Stroke(width = 6f, cap = StrokeCap.Round)
        )
    }
}

// 5. FISH 🐟
private fun DrawScope.drawFish(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.48f
    val cy = size.height * 0.52f
    val r = size.height * 0.28f

    val fishColor = if (isColor) Color(0xFF29B6F6) else sketchBg
    val finColor = if (isColor) Color(0xFFFFB74D) else sketchBg

    // Tail fin
    val tail = Path().apply {
        moveTo(cx - r * 0.9f, cy)
        lineTo(cx - r * 1.5f, cy - r * 0.6f)
        cubicTo(cx - r * 1.3f, cy, cx - r * 1.3f, cy, cx - r * 1.5f, cy + r * 0.6f)
        close()
    }
    drawPath(tail, finColor)
    drawPath(tail, outline, style = Stroke(width = 8f, cap = StrokeCap.Round, join = StrokeJoin.Round))

    // Dorsal top fin
    val dorsal = Path().apply {
        moveTo(cx - r * 0.3f, cy - r * 0.65f)
        cubicTo(cx, cy - r * 1.05f, cx + r * 0.3f, cy - r * 0.9f, cx + r * 0.4f, cy - r * 0.55f)
        close()
    }
    drawPath(dorsal, finColor)
    drawPath(dorsal, outline, style = Stroke(width = 7f, cap = StrokeCap.Round, join = StrokeJoin.Round))

    // Fish body oval
    val body = Path().apply {
        moveTo(cx - r * 0.9f, cy)
        cubicTo(cx - r * 0.4f, cy - r * 0.8f, cx + r * 0.7f, cy - r * 0.65f, cx + r * 1.15f, cy)
        cubicTo(cx + r * 0.7f, cy + r * 0.65f, cx - r * 0.4f, cy + r * 0.8f, cx - r * 0.9f, cy)
        close()
    }
    drawPath(body, fishColor)
    drawPath(body, outline, style = Stroke(width = 8f, cap = StrokeCap.Round, join = StrokeJoin.Round))

    if (isColor) {
        // Eye
        drawCircle(Color.White, radius = 14f, center = Offset(cx + r * 0.6f, cy - 10f))
        drawCircle(outline, radius = 14f, center = Offset(cx + r * 0.6f, cy - 10f), style = Stroke(width = 4f))
        drawCircle(Color(0xFF212121), radius = 7f, center = Offset(cx + r * 0.64f, cy - 10f))
        drawCircle(Color.White, radius = 2.5f, center = Offset(cx + r * 0.62f, cy - 12f))

        // Smile
        drawArc(
            color = outline,
            startAngle = 40f,
            sweepAngle = 100f,
            useCenter = false,
            topLeft = Offset(cx + r * 0.85f, cy - 2f),
            size = Size(16f, 16f),
            style = Stroke(width = 5f, cap = StrokeCap.Round)
        )

        // Scale arc stripes
        drawArc(
            color = Color(0x55FFFFFF),
            startAngle = 270f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(cx - r * 0.1f, cy - r * 0.35f),
            size = Size(20f, r * 0.7f),
            style = Stroke(width = 6f, cap = StrokeCap.Round)
        )

        // Bubbles
        drawCircle(Color(0x884FC3F7), radius = 8f, center = Offset(cx + r * 1.35f, cy - 25f))
        drawCircle(Color(0x884FC3F7), radius = 5f, center = Offset(cx + r * 1.55f, cy - 45f))
    }
}

// 6. RAINBOW 🌈
private fun DrawScope.drawRainbow(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.62f
    val r = size.height * 0.42f

    val colors = if (isColor) listOf(
        Color(0xFFFF3D00), // Red
        Color(0xFFFF9100), // Orange
        Color(0xFFFFEA00), // Yellow
        Color(0xFF00E676), // Green
        Color(0xFF2979FF), // Blue
        Color(0xFF651FFF)  // Purple
    ) else List(6) { sketchBg }

    // Concentric rainbow bands
    colors.forEachIndexed { index, color ->
        val bandR = r - index * 12f
        drawArc(
            color = color,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(cx - bandR, cy - bandR),
            size = Size(bandR * 2, bandR * 2),
            style = Stroke(width = 13f, cap = StrokeCap.Round)
        )
        drawArc(
            color = outline,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(cx - bandR, cy - bandR),
            size = Size(bandR * 2, bandR * 2),
            style = Stroke(width = 1.5f, cap = StrokeCap.Round)
        )
    }

    // Two smiling fluffy clouds at the bottom
    val drawCloud = { cloudX: Float, cloudY: Float ->
        val cloudColor = if (isColor) Color.White else sketchBg
        drawCircle(cloudColor, radius = 24f, center = Offset(cloudX, cloudY))
        drawCircle(cloudColor, radius = 32f, center = Offset(cloudX + 22f, cloudY - 10f))
        drawCircle(cloudColor, radius = 22f, center = Offset(cloudX + 44f, cloudY))
        drawCircle(outline, radius = 24f, center = Offset(cloudX, cloudY), style = Stroke(width = 5f))
        drawCircle(outline, radius = 32f, center = Offset(cloudX + 22f, cloudY - 10f), style = Stroke(width = 5f))
        drawCircle(outline, radius = 22f, center = Offset(cloudX + 44f, cloudY), style = Stroke(width = 5f))

        if (isColor) {
            drawCircle(Color(0xFF212121), radius = 4f, center = Offset(cloudX + 16f, cloudY - 8f))
            drawCircle(Color(0xFF212121), radius = 4f, center = Offset(cloudX + 28f, cloudY - 8f))
            drawCircle(Color(0x88FF80AB), radius = 5f, center = Offset(cloudX + 8f, cloudY - 2f))
            drawCircle(Color(0x88FF80AB), radius = 5f, center = Offset(cloudX + 36f, cloudY - 2f))
        }
    }

    drawCloud(cx - r - 20f, cy)
    drawCloud(cx + r - 35f, cy)
}

// 7. BALLOON 🎈
private fun DrawScope.drawBalloon(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.44f
    val r = size.height * 0.28f

    // 3 Balloons: Left (Blue), Right (Yellow), Center (Red)
    data class BalloonInfo(val x: Float, val y: Float, val color: Color, val scale: Float)
    val balloons = listOf(
        BalloonInfo(cx - 40f, cy + 10f, if (isColor) Color(0xFF42A5F5) else sketchBg, 0.85f),
        BalloonInfo(cx + 40f, cy + 10f, if (isColor) Color(0xFFFFCA28) else sketchBg, 0.85f),
        BalloonInfo(cx, cy - 10f, if (isColor) Color(0xFFFF334B) else sketchBg, 1.0f)
    )

    balloons.forEach { b ->
        val br = r * b.scale
        // Oval body
        drawOval(
            color = b.color,
            topLeft = Offset(b.x - br * 0.72f, b.y - br),
            size = Size(br * 1.44f, br * 1.8f)
        )
        drawOval(
            color = outline,
            topLeft = Offset(b.x - br * 0.72f, b.y - br),
            size = Size(br * 1.44f, br * 1.8f),
            style = Stroke(width = 7f)
        )

        // Balloon knot
        val knot = Path().apply {
            moveTo(b.x - 8f, b.y + br * 0.8f)
            lineTo(b.x + 8f, b.y + br * 0.8f)
            lineTo(b.x, b.y + br * 0.95f)
            close()
        }
        drawPath(knot, b.color)
        drawPath(knot, outline, style = Stroke(width = 5f))

        // Curly string
        val stringPath = Path().apply {
            moveTo(b.x, b.y + br * 0.95f)
            cubicTo(b.x - 12f, b.y + br * 1.25f, b.x + 12f, b.y + br * 1.45f, cx, size.height * 0.95f)
        }
        drawPath(stringPath, outline, style = Stroke(width = 4f, cap = StrokeCap.Round))

        if (isColor) {
            // White glossy reflection
            drawArc(
                color = Color(0x88FFFFFF),
                startAngle = 200f,
                sweepAngle = 60f,
                useCenter = false,
                topLeft = Offset(b.x - br * 0.55f, b.y - br * 0.85f),
                size = Size(br * 0.9f, br * 1.2f),
                style = Stroke(width = 8f, cap = StrokeCap.Round)
            )
        }
    }
}

// 8. BUTTERFLY 🦋
private fun DrawScope.drawButterfly(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.5f
    val r = size.height * 0.28f

    val wingColor = if (isColor) Color(0xFFAB47BC) else sketchBg
    val wingAccent = if (isColor) Color(0xFFFF4081) else sketchBg
    val bodyColor = if (isColor) Color(0xFFFFB74D) else outline

    // Wings
    val leftTopWing = Path().apply {
        moveTo(cx - 8f, cy - 10f)
        cubicTo(cx - r * 1.3f, cy - r * 1.1f, cx - r * 1.4f, cy - r * 0.1f, cx - 12f, cy + 10f)
        close()
    }
    val rightTopWing = Path().apply {
        moveTo(cx + 8f, cy - 10f)
        cubicTo(cx + r * 1.3f, cy - r * 1.1f, cx + r * 1.4f, cy - r * 0.1f, cx + 12f, cy + 10f)
        close()
    }
    val leftBottomWing = Path().apply {
        moveTo(cx - 10f, cy + 12f)
        cubicTo(cx - r * 1.05f, cy + 20f, cx - r * 0.85f, cy + r * 0.95f, cx - 6f, cy + r * 0.6f)
        close()
    }
    val rightBottomWing = Path().apply {
        moveTo(cx + 10f, cy + 12f)
        cubicTo(cx + r * 1.05f, cy + 20f, cx + r * 0.85f, cy + r * 0.95f, cx + 6f, cy + r * 0.6f)
        close()
    }

    drawPath(leftTopWing, wingColor)
    drawPath(leftTopWing, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))
    drawPath(rightTopWing, wingColor)
    drawPath(rightTopWing, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))
    drawPath(leftBottomWing, wingAccent)
    drawPath(leftBottomWing, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))
    drawPath(rightBottomWing, wingAccent)
    drawPath(rightBottomWing, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))

    if (isColor) {
        // Wing spots
        drawCircle(Color(0xFFFFEB3B), radius = 14f, center = Offset(cx - r * 0.65f, cy - r * 0.45f))
        drawCircle(outline, radius = 14f, center = Offset(cx - r * 0.65f, cy - r * 0.45f), style = Stroke(width = 3f))
        drawCircle(Color(0xFFFFEB3B), radius = 14f, center = Offset(cx + r * 0.65f, cy - r * 0.45f))
        drawCircle(outline, radius = 14f, center = Offset(cx + r * 0.65f, cy - r * 0.45f), style = Stroke(width = 3f))
    }

    // Body
    drawRoundRect(
        color = bodyColor,
        topLeft = Offset(cx - 10f, cy - r * 0.4f),
        size = Size(20f, r * 1.1f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(10f, 10f)
    )
    drawRoundRect(
        color = outline,
        topLeft = Offset(cx - 10f, cy - r * 0.4f),
        size = Size(20f, r * 1.1f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(10f, 10f),
        style = Stroke(width = 6f)
    )

    // Antennae
    val antL = Path().apply {
        moveTo(cx - 5f, cy - r * 0.4f)
        cubicTo(cx - 15f, cy - r * 0.75f, cx - 30f, cy - r * 0.7f, cx - 25f, cy - r * 0.85f)
    }
    val antR = Path().apply {
        moveTo(cx + 5f, cy - r * 0.4f)
        cubicTo(cx + 15f, cy - r * 0.75f, cx + 30f, cy - r * 0.7f, cx + 25f, cy - r * 0.85f)
    }
    drawPath(antL, outline, style = Stroke(width = 5f, cap = StrokeCap.Round))
    drawPath(antR, outline, style = Stroke(width = 5f, cap = StrokeCap.Round))
    drawCircle(Color(0xFFFF4081), radius = 5f, center = Offset(cx - 25f, cy - r * 0.85f))
    drawCircle(Color(0xFFFF4081), radius = 5f, center = Offset(cx + 25f, cy - r * 0.85f))
}

// 9. AVOCADO 🥑
private fun DrawScope.drawAvocado(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.52f
    val r = size.height * 0.35f

    val skinDark = if (isColor) Color(0xFF2E7D32) else outline
    val fleshLight = if (isColor) Color(0xFFC8E6C9) else sketchBg
    val seedBrown = if (isColor) Color(0xFF6D4C41) else outline

    // Pear shape
    val makeAvocadoPath = { scale: Float ->
        val sr = r * scale
        Path().apply {
            moveTo(cx, cy - sr * 0.95f)
            cubicTo(cx + sr * 0.55f, cy - sr * 0.95f, cx + sr * 0.6f, cy - sr * 0.2f, cx + sr * 0.85f, cy + sr * 0.35f)
            cubicTo(cx + sr * 0.95f, cy + sr * 0.85f, cx - sr * 0.95f, cy + sr * 0.85f, cx - sr * 0.85f, cy + sr * 0.35f)
            cubicTo(cx - sr * 0.6f, cy - sr * 0.2f, cx - sr * 0.55f, cy - sr * 0.95f, cx, cy - sr * 0.95f)
            close()
        }
    }

    // Outer skin
    drawPath(makeAvocadoPath(1.0f), skinDark)
    drawPath(makeAvocadoPath(1.0f), outline, style = Stroke(width = 8f, join = StrokeJoin.Round))

    // Inner creamy flesh
    drawPath(makeAvocadoPath(0.85f), fleshLight)

    // Center round seed
    val seedY = cy + r * 0.28f
    val seedR = r * 0.36f
    drawCircle(seedBrown, radius = seedR, center = Offset(cx, seedY))
    drawCircle(outline, radius = seedR, center = Offset(cx, seedY), style = Stroke(width = 7f))

    if (isColor) {
        // Kawaii smiling face on the seed
        drawCircle(Color(0xFF212121), radius = 6f, center = Offset(cx - 18f, seedY - 6f))
        drawCircle(Color.White, radius = 2.5f, center = Offset(cx - 20f, seedY - 8f))
        drawCircle(Color(0xFF212121), radius = 6f, center = Offset(cx + 18f, seedY - 6f))
        drawCircle(Color.White, radius = 2.5f, center = Offset(cx + 16f, seedY - 8f))

        // Blushing cheeks
        drawCircle(Color(0x99FF80AB), radius = 8f, center = Offset(cx - 28f, seedY + 6f))
        drawCircle(Color(0x99FF80AB), radius = 8f, center = Offset(cx + 28f, seedY + 6f))

        // Sweet smile
        drawArc(
            color = Color.White,
            startAngle = 20f,
            sweepAngle = 140f,
            useCenter = false,
            topLeft = Offset(cx - 10f, seedY),
            size = Size(20f, 16f),
            style = Stroke(width = 5f, cap = StrokeCap.Round)
        )
    }
}

// 10. ROCKET 🚀
private fun DrawScope.drawRocket(isColor: Boolean, outline: Color, sketchBg: Color, marker: Color) {
    val cx = size.width * 0.5f
    val cy = size.height * 0.45f
    val r = size.height * 0.32f

    val rocketWhite = if (isColor) Color(0xFFECEFF1) else sketchBg
    val noseRed = if (isColor) Color(0xFFFF3D00) else sketchBg
    val flameOrange = if (isColor) Color(0xFFFFAB00) else sketchBg

    // Blazing flames at bottom
    val flame = Path().apply {
        moveTo(cx - 25f, cy + r * 0.85f)
        lineTo(cx, cy + r * 1.4f)
        lineTo(cx + 25f, cy + r * 0.85f)
        close()
    }
    drawPath(flame, flameOrange)
    drawPath(flame, outline, style = Stroke(width = 6f))

    if (isColor) {
        val innerFlame = Path().apply {
            moveTo(cx - 14f, cy + r * 0.85f)
            lineTo(cx, cy + r * 1.2f)
            lineTo(cx + 14f, cy + r * 0.85f)
            close()
        }
        drawPath(innerFlame, Color(0xFFFFEA00))
    }

    // Side fins
    val leftFin = Path().apply {
        moveTo(cx - 25f, cy + r * 0.3f)
        lineTo(cx - r * 0.75f, cy + r * 0.85f)
        lineTo(cx - 25f, cy + r * 0.75f)
        close()
    }
    val rightFin = Path().apply {
        moveTo(cx + 25f, cy + r * 0.3f)
        lineTo(cx + r * 0.75f, cy + r * 0.85f)
        lineTo(cx + 25f, cy + r * 0.75f)
        close()
    }
    drawPath(leftFin, noseRed)
    drawPath(leftFin, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))
    drawPath(rightFin, noseRed)
    drawPath(rightFin, outline, style = Stroke(width = 7f, join = StrokeJoin.Round))

    // Rocket body
    val body = Path().apply {
        moveTo(cx, cy - r * 1.1f)
        cubicTo(cx + r * 0.55f, cy - r * 0.4f, cx + 32f, cy + r * 0.7f, cx + 25f, cy + r * 0.85f)
        lineTo(cx - 25f, cy + r * 0.85f)
        cubicTo(cx - 32f, cy + r * 0.7f, cx - r * 0.55f, cy - r * 0.4f, cx, cy - r * 1.1f)
        close()
    }
    drawPath(body, rocketWhite)
    drawPath(body, outline, style = Stroke(width = 8f, join = StrokeJoin.Round))

    // Red nosecone
    val nose = Path().apply {
        moveTo(cx, cy - r * 1.1f)
        cubicTo(cx + r * 0.3f, cy - r * 0.7f, cx + 24f, cy - r * 0.5f, cx, cy - r * 0.5f)
        cubicTo(cx - 24f, cy - r * 0.5f, cx - r * 0.3f, cy - r * 0.7f, cx, cy - r * 1.1f)
        close()
    }
    drawPath(nose, noseRed)
    drawPath(nose, outline, style = Stroke(width = 6f, join = StrokeJoin.Round))

    // Porthole circular window
    drawCircle(Color(0xFF00E5FF), radius = 22f, center = Offset(cx, cy))
    drawCircle(outline, radius = 22f, center = Offset(cx, cy), style = Stroke(width = 6f))
    if (isColor) {
        drawCircle(Color.White, radius = 6f, center = Offset(cx - 7f, cy - 7f))
    }
}
