package com.example.ui.components

import androidx.compose.animation.core.Animatable
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
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.LevelData
import com.example.model.MarkerColor
import kotlinx.coroutines.launch
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

@Composable
fun PuzzleGrid(
    level: LevelData,
    gridMatrix: List<List<Char>>,
    isWordFound: Boolean,
    hintLetterPos: Pair<Int, Int>?,
    activeMarker: MarkerColor,
    onWordSelected: (List<Pair<Int, Int>>) -> Boolean, // returns true if correct
    modifier: Modifier = Modifier
) {
    val rows = level.gridRows
    val cols = level.gridCols
    val scope = rememberCoroutineScope()

    var startCell by remember(level) { mutableStateOf<Pair<Int, Int>?>(null) }
    var currentDragCell by remember(level) { mutableStateOf<Pair<Int, Int>?>(null) }
    var selectedPath by remember(level) { mutableStateOf<List<Pair<Int, Int>>>(emptyList()) }

    // Shake animation on wrong selection
    val shakeOffset = remember { Animatable(0f) }

    // Hint letter pulse animation
    val infiniteTransition = rememberInfiniteTransition(label = "hintPulse")
    val hintScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(450, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "hintScale"
    )

    // Calculate straight-line cells between start and end
    fun computeStraightLine(start: Pair<Int, Int>, end: Pair<Int, Int>): List<Pair<Int, Int>> {
        val r1 = start.first
        val c1 = start.second
        val r2 = end.first
        val c2 = end.second

        val dr = r2 - r1
        val dc = c2 - c1

        val list = mutableListOf<Pair<Int, Int>>()

        when {
            // Horizontal
            dr == 0 -> {
                val step = if (dc >= 0) 1 else -1
                var c = c1
                while (c != c2 + step) {
                    list.add(Pair(r1, c))
                    c += step
                }
            }
            // Vertical
            dc == 0 -> {
                val step = if (dr >= 0) 1 else -1
                var r = r1
                while (r != r2 + step) {
                    list.add(Pair(r, c1))
                    r += step
                }
            }
            // Diagonal
            abs(dr) == abs(dc) -> {
                val stepR = if (dr >= 0) 1 else -1
                val stepC = if (dc >= 0) 1 else -1
                var r = r1
                var c = c1
                while (r != r2 + stepR) {
                    list.add(Pair(r, c))
                    r += stepR
                    c += stepC
                }
            }
            else -> {
                // Not collinear, just show start
                list.add(start)
            }
        }
        return list
    }

    BoxWithConstraints(
        modifier = modifier
            .testTag("letter_grid")
            .fillMaxWidth()
            .aspectRatio(1f)
            .offset { IntOffset(shakeOffset.value.roundToInt(), 0) }
            .shadow(8.dp, RoundedCornerShape(28.dp), spotColor = Color(0x33000000))
            .clip(RoundedCornerShape(28.dp))
            .background(Color(0xFFFFFFFF))
            .border(3.dp, Color(0xFFF1F5F9), RoundedCornerShape(28.dp))
            .padding(10.dp)
    ) {
        val cellW = maxWidth / cols
        val cellH = maxHeight / rows

        // Touch handling layer
        Box(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(level, isWordFound) {
                    if (isWordFound) return@pointerInput

                    detectDragGestures(
                        onDragStart = { offset ->
                            val c = (offset.x / (size.width / cols.toFloat()))
                                .toInt()
                                .coerceIn(0, cols - 1)
                            val r = (offset.y / (size.height / rows.toFloat()))
                                .toInt()
                                .coerceIn(0, rows - 1)
                            startCell = Pair(r, c)
                            currentDragCell = Pair(r, c)
                            selectedPath = listOf(Pair(r, c))
                        },
                        onDrag = { change, _ ->
                            val c = (change.position.x / (size.width / cols.toFloat()))
                                .toInt()
                                .coerceIn(0, cols - 1)
                            val r = (change.position.y / (size.height / rows.toFloat()))
                                .toInt()
                                .coerceIn(0, rows - 1)

                            val start = startCell
                            if (start != null && (r != currentDragCell?.first || c != currentDragCell?.second)) {
                                currentDragCell = Pair(r, c)
                                selectedPath = computeStraightLine(start, Pair(r, c))
                            }
                        },
                        onDragEnd = {
                            if (selectedPath.isNotEmpty()) {
                                val isCorrect = onWordSelected(selectedPath)
                                if (!isCorrect && selectedPath.size > 1) {
                                    // Trigger gentle shake feedback
                                    scope.launch {
                                        shakeOffset.animateTo(12f, tween(40, easing = LinearEasing))
                                        shakeOffset.animateTo(-12f, tween(40, easing = LinearEasing))
                                        shakeOffset.animateTo(8f, tween(40, easing = LinearEasing))
                                        shakeOffset.animateTo(-8f, tween(40, easing = LinearEasing))
                                        shakeOffset.animateTo(0f, tween(40, easing = LinearEasing))
                                    }
                                }
                            }
                            startCell = null
                            currentDragCell = null
                            selectedPath = emptyList()
                        },
                        onDragCancel = {
                            startCell = null
                            currentDragCell = null
                            selectedPath = emptyList()
                        }
                    )
                }
        ) {
            // Draw highlight overlay for completed word or current drag
            Canvas(modifier = Modifier.fillMaxSize()) {
                val cellPixelW = size.width / cols.toFloat()
                val cellPixelH = size.height / rows.toFloat()

                // 1. Permanent highlight if found
                if (isWordFound) {
                    val targetCells = level.targetCells
                    if (targetCells.isNotEmpty()) {
                        val first = targetCells.first()
                        val last = targetCells.last()
                        val startCenter = Offset(
                            (first.second + 0.5f) * cellPixelW,
                            (first.first + 0.5f) * cellPixelH
                        )
                        val endCenter = Offset(
                            (last.second + 0.5f) * cellPixelW,
                            (last.first + 0.5f) * cellPixelH
                        )

                        // Highlight ribbon capsule
                        drawLine(
                            color = activeMarker.highlightColor,
                            start = startCenter,
                            end = endCenter,
                            strokeWidth = min(cellPixelW, cellPixelH) * 0.85f,
                            cap = StrokeCap.Round
                        )
                        // Outer bright stroke
                        drawLine(
                            color = activeMarker.primaryColor,
                            start = startCenter,
                            end = endCenter,
                            strokeWidth = min(cellPixelW, cellPixelH) * 0.85f,
                            cap = StrokeCap.Round,
                            alpha = 0.4f
                        )
                    }
                }

                // 2. Interactive Dragging Ribbon
                if (selectedPath.size > 1 && !isWordFound) {
                    val first = selectedPath.first()
                    val last = selectedPath.last()
                    val startCenter = Offset(
                        (first.second + 0.5f) * cellPixelW,
                        (first.first + 0.5f) * cellPixelH
                    )
                    val endCenter = Offset(
                        (last.second + 0.5f) * cellPixelW,
                        (last.first + 0.5f) * cellPixelH
                    )

                    drawLine(
                        color = activeMarker.highlightColor,
                        start = startCenter,
                        end = endCenter,
                        strokeWidth = min(cellPixelW, cellPixelH) * 0.82f,
                        cap = StrokeCap.Round
                    )
                }
            }

            // Grid Tiles Layout
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.SpaceEvenly
            ) {
                for (r in 0 until rows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        for (c in 0 until cols) {
                            val char = gridMatrix.getOrNull(r)?.getOrNull(c) ?: ' '
                            val isCellSelected = selectedPath.contains(Pair(r, c))
                            val isCellInTarget = level.targetCells.contains(Pair(r, c))
                            val isHintCell = hintLetterPos?.first == r && hintLetterPos?.second == c && !isWordFound

                            val tileBg = when {
                                isWordFound && isCellInTarget -> activeMarker.primaryColor
                                isCellSelected -> activeMarker.highlightColor
                                isHintCell -> Color(0xFFFFF9C4)
                                else -> Color(0xFFF8FAFC)
                            }

                            val textColor = when {
                                isWordFound && isCellInTarget -> Color.White
                                isCellSelected -> activeMarker.primaryColor
                                isHintCell -> Color(0xFFE65100)
                                else -> Color(0xFF263238)
                            }

                            val tileSize = (if (cellW < cellH) cellW else cellH) * 0.92f

                            Box(
                                modifier = Modifier
                                    .testTag("letter_tile_${r}_${c}")
                                    .size(tileSize)
                                    .scale(if (isHintCell) hintScale else 1f)
                                    .shadow(
                                        elevation = if (isCellSelected || (isWordFound && isCellInTarget)) 4.dp else 1.dp,
                                        shape = RoundedCornerShape(14.dp),
                                        spotColor = if (isWordFound && isCellInTarget) activeMarker.primaryColor else Color(0x22000000)
                                    )
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(tileBg)
                                    .border(
                                        width = if (isHintCell) 2.5.dp else 1.dp,
                                        color = if (isHintCell) Color(0xFFFFB300) else if (isWordFound && isCellInTarget) Color.Transparent else Color(0xFFE2E8F0),
                                        shape = RoundedCornerShape(14.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = char.toString(),
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = when {
                                        cols <= 5 -> 24.sp
                                        cols <= 7 -> 20.sp
                                        else -> 16.sp
                                    },
                                    color = textColor
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
