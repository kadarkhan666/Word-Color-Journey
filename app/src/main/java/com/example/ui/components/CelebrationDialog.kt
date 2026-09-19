package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.model.LevelData
import com.example.model.MarkerColor
import com.example.ui.illustrations.CartoonIllustrationBox

@Composable
fun CelebrationDialog(
    level: LevelData,
    hasNextLevel: Boolean,
    activeMarker: MarkerColor,
    praiseWord: String,
    isDailyMode: Boolean = false,
    dailyStreak: Int = 0,
    onNextLevel: () -> Unit,
    onReplay: () -> Unit,
    onDismiss: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "celebration")
    val starScale by infiniteTransition.animateFloat(
        initialValue = 0.9f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "starScale"
    )

    // Confetti particles seed
    val confettiParticles = remember {
        List(35) {
            val colors = listOf(
                Color(0xFFFF3D00),
                Color(0xFFFFD600),
                Color(0xFF00E676),
                Color(0xFF2979FF),
                Color(0xFFFF4081),
                Color(0xFF7C4DFF)
            )
            ConfettiParticle(
                xNorm = (it * 37 % 100) / 100f,
                yNorm = (it * 53 % 100) / 100f,
                radius = 4f + (it % 5) * 2f,
                color = colors[it % colors.size]
            )
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0x77000000))
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            // Confetti sparkle background
            Canvas(modifier = Modifier.fillMaxSize()) {
                confettiParticles.forEach { p ->
                    drawCircle(
                        color = p.color,
                        radius = p.radius,
                        center = Offset(size.width * p.xNorm, size.height * p.yNorm)
                    )
                }
            }

            // Dialog Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(16.dp, RoundedCornerShape(32.dp))
                    .clip(RoundedCornerShape(32.dp))
                    .border(3.dp, Color(0xFFFFD54F), RoundedCornerShape(32.dp)),
                color = Color.White
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Praise title: "Amazing!", "Great Job!", "Perfect!"
                    Text(
                        text = if (isDailyMode) "Daily Solved! 🌟" else praiseWord,
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Black,
                        color = activeMarker.primaryColor,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = if (isDailyMode) {
                            "Completed Today's Puzzle: ${level.word} ${level.icon}"
                        } else {
                            "You found ${level.word} ${level.icon}!"
                        },
                        fontSize = 17.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF455A64),
                        textAlign = TextAlign.Center
                    )

                    if (isDailyMode && dailyStreak > 0) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFFFF8E1),
                            border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFFFD54F))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "🔥 Daily Streak: $dailyStreak day${if (dailyStreak > 1) "s" else ""}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFFE65100)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Three celebratory stars
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(3) { index ->
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = "Star reward",
                                tint = Color(0xFFFFB300),
                                modifier = Modifier
                                    .padding(horizontal = 4.dp)
                                    .size(if (index == 1) 46.dp else 36.dp)
                                    .scale(if (index == 1) starScale else 1f)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Finished illustration preview
                    Box(
                        modifier = Modifier
                            .size(160.dp)
                            .shadow(6.dp, RoundedCornerShape(20.dp))
                            .clip(RoundedCornerShape(20.dp))
                    ) {
                        CartoonIllustrationBox(
                            type = level.illustrationType,
                            revealProgress = 1f,
                            isCompleted = true,
                            activeMarker = activeMarker,
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Action buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = onReplay,
                            modifier = Modifier
                                .weight(1f)
                                .height(54.dp)
                                .testTag("replay_button"),
                            shape = RoundedCornerShape(20.dp),
                            border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFCFD8DC))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Replay level",
                                tint = Color(0xFF546E7A)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Replay", color = Color(0xFF546E7A), fontWeight = FontWeight.Bold)
                        }

                        if (hasNextLevel && !isDailyMode) {
                            Button(
                                onClick = onNextLevel,
                                modifier = Modifier
                                    .weight(1.4f)
                                    .height(54.dp)
                                    .testTag("dialog_next_level_button"),
                                shape = RoundedCornerShape(20.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = activeMarker.primaryColor)
                            ) {
                                Text(
                                    text = "Next Level",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(
                                    imageVector = Icons.Default.ArrowForward,
                                    contentDescription = "Next Level",
                                    tint = Color.White
                                )
                            }
                        } else if (isDailyMode) {
                            Button(
                                onClick = onDismiss,
                                modifier = Modifier
                                    .weight(1.4f)
                                    .height(54.dp)
                                    .testTag("dialog_done_button"),
                                shape = RoundedCornerShape(20.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = activeMarker.primaryColor)
                            ) {
                                Text(
                                    text = "Done",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private data class ConfettiParticle(
    val xNorm: Float,
    val yNorm: Float,
    val radius: Float,
    val color: Color
)
