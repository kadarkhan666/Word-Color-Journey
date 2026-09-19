package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.DEFAULT_MARKER_COLORS
import com.example.model.GAME_LEVELS
import com.example.model.LevelData
import com.example.ui.components.CelebrationDialog
import com.example.ui.components.ColorMarkerSelector
import com.example.ui.components.LevelSelectDialog
import com.example.ui.components.PuzzleGrid
import com.example.ui.illustrations.CartoonIllustrationBox
import com.example.ui.theme.MyApplicationTheme
import com.example.viewmodel.GameViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                WordSearchGameScreen()
            }
        }
    }
}

@Composable
fun WordSearchGameScreen(
    gameViewModel: GameViewModel = viewModel()
) {
    val currentLevel by gameViewModel.currentLevel.collectAsState()
    val gridMatrix by gameViewModel.gridMatrix.collectAsState()
    val isWordFound by gameViewModel.isWordFound.collectAsState()
    val revealProgress by gameViewModel.revealProgress.collectAsState()
    val isPictureCompleted by gameViewModel.isPictureCompleted.collectAsState()
    val showCelebration by gameViewModel.showCelebration.collectAsState()
    val praiseWord by gameViewModel.praiseWord.collectAsState()
    val activeMarker by gameViewModel.activeMarker.collectAsState()
    val hintLetterPos by gameViewModel.hintLetterPos.collectAsState()
    val unlockedMaxLevel by gameViewModel.unlockedMaxLevel.collectAsState()
    val completedLevels by gameViewModel.completedLevels.collectAsState()

    val isDailyMode by gameViewModel.isDailyMode.collectAsState()
    val todayDisplayDate by gameViewModel.todayDisplayDate.collectAsState()
    val isDailyCompleted by gameViewModel.isDailyCompleted.collectAsState()
    val dailyStreak by gameViewModel.dailyStreak.collectAsState()

    var showLevelSelectDialog by remember { mutableStateOf(false) }

    val infiniteTransition = rememberInfiniteTransition(label = "pulseNext")
    val nextButtonScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(650, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "nextButtonScale"
    )

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding(),
        containerColor = Color(0xFFFBFBFD)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Mode Selector Pill (Classic Levels vs Daily Puzzle)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color(0xFFEDE7F6))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Classic Levels Tab
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .testTag("mode_classic_button")
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (!isDailyMode) Color.White else Color.Transparent)
                        .clickable { gameViewModel.switchToClassicMode() }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "⭐ Classic Levels",
                        fontSize = 13.sp,
                        fontWeight = if (!isDailyMode) FontWeight.ExtraBold else FontWeight.Medium,
                        color = if (!isDailyMode) Color(0xFF5E35B1) else Color(0xFF7E57C2)
                    )
                }

                // Daily Puzzle Tab
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .testTag("mode_daily_button")
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isDailyMode) Color(0xFFFFB300) else Color.Transparent)
                        .clickable { gameViewModel.switchToDailyMode() }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = if (isDailyCompleted) "📅 Daily ✓" else "📅 Daily Puzzle",
                            fontSize = 13.sp,
                            fontWeight = if (isDailyMode) FontWeight.ExtraBold else FontWeight.Medium,
                            color = if (isDailyMode) Color.White else Color(0xFF7E57C2)
                        )
                        if (dailyStreak > 0) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "🔥$dailyStreak",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = if (isDailyMode) Color.White else Color(0xFFE65100)
                            )
                        }
                    }
                }
            }

            // 1. Top Bar: Back Button / Mode badge, Level Info / Date Info, and Level Selector Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                if (isDailyMode) {
                    // In Daily Mode: Back to Classic Levels button
                    IconButton(
                        onClick = { gameViewModel.switchToClassicMode() },
                        modifier = Modifier
                            .testTag("daily_back_button")
                            .size(44.dp)
                            .background(Color.White, CircleShape)
                            .border(1.5.dp, Color(0xFFE2E8F0), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to Classic Levels",
                            tint = Color(0xFF37474F),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                } else {
                    // Back / Previous Level button
                    IconButton(
                        onClick = {
                            if (currentLevel.levelNumber > 1) {
                                gameViewModel.previousLevel()
                            } else {
                                showLevelSelectDialog = true
                            }
                        },
                        modifier = Modifier
                            .testTag("back_button")
                            .size(44.dp)
                            .background(Color.White, CircleShape)
                            .border(1.5.dp, Color(0xFFE2E8F0), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = Color(0xFF37474F),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                // Header Info: Daily Date or Level Number
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    if (isDailyMode) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Daily Puzzle",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFE65100)
                            )
                            if (isDailyCompleted) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Daily puzzle solved",
                                    tint = Color(0xFFFFB300),
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        Text(
                            text = todayDisplayDate,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF78909C)
                        )
                    } else {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Level ${currentLevel.levelNumber}",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFF263238)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            if (completedLevels.contains(currentLevel.levelNumber)) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Level completed",
                                    tint = Color(0xFFFFB300),
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        Text(
                            text = "${currentLevel.levelNumber} of ${GAME_LEVELS.size} Levels",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF78909C)
                        )
                    }
                }

                // Level grid selector button
                IconButton(
                    onClick = { showLevelSelectDialog = true },
                    modifier = Modifier
                        .testTag("level_select_button")
                        .size(44.dp)
                        .background(Color.White, CircleShape)
                        .border(1.5.dp, Color(0xFFE2E8F0), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.GridView,
                        contentDescription = "Select Level",
                        tint = Color(0xFF37474F),
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            // Progress / Status indicator
            Spacer(modifier = Modifier.height(4.dp))
            if (isDailyMode) {
                // Daily banner status
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isDailyCompleted) Color(0xFFE8F5E9) else Color(0xFFFFF8E1),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (isDailyCompleted) Color(0xFFA5D6A7) else Color(0xFFFFE082)
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = if (isDailyCompleted) "✓ Daily Puzzle Solved!" else "✨ Unique Seeded Puzzle Today",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isDailyCompleted) Color(0xFF2E7D32) else Color(0xFFE65100)
                        )
                        if (dailyStreak > 0) {
                            Text(
                                text = "Streak: $dailyStreak 🔥",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFE65100)
                            )
                        }
                    }
                }
            } else {
                LinearProgressIndicator(
                    progress = { currentLevel.levelNumber / GAME_LEVELS.size.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = activeMarker.primaryColor,
                    trackColor = Color(0xFFECEFF1),
                    strokeCap = StrokeCap.Round
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 2. Target Word Area with Icon and Letter Badges
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(3.dp, RoundedCornerShape(20.dp), spotColor = Color(0x1A000000))
                    .clip(RoundedCornerShape(20.dp))
                    .border(2.dp, if (isWordFound) activeMarker.primaryColor else Color(0xFFE2E8F0), RoundedCornerShape(20.dp)),
                color = Color.White
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = currentLevel.icon,
                            fontSize = 28.sp
                        )
                        Spacer(modifier = Modifier.width(10.dp))

                        // Target word letters in playful badges
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            currentLevel.word.forEach { ch ->
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(
                                            if (isWordFound) activeMarker.primaryColor else Color(0xFFF1F5F9)
                                        )
                                        .border(
                                            1.5.dp,
                                            if (isWordFound) activeMarker.pencilColor else Color(0xFFE2E8F0),
                                            RoundedCornerShape(8.dp)
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = ch.toString(),
                                        fontWeight = FontWeight.Black,
                                        fontSize = 18.sp,
                                        color = if (isWordFound) Color.White else Color(0xFF263238)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = if (isWordFound) praiseWord else currentLevel.hintText,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isWordFound) activeMarker.primaryColor else Color(0xFF546E7A),
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 3. Cute Cartoon Illustration Area (Sketch -> Progressive Color Reveal)
            CartoonIllustrationBox(
                type = currentLevel.illustrationType,
                revealProgress = revealProgress,
                isCompleted = isPictureCompleted,
                activeMarker = activeMarker,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 4. Three Colourful Selection / Colour Buttons
            ColorMarkerSelector(
                markers = DEFAULT_MARKER_COLORS,
                selectedMarker = activeMarker,
                onMarkerSelected = { gameViewModel.selectMarker(it) }
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 5. Large Word-Search Puzzle Area (Swiping letters grid)
            PuzzleGrid(
                level = currentLevel,
                gridMatrix = gridMatrix,
                isWordFound = isWordFound,
                hintLetterPos = hintLetterPos,
                activeMarker = activeMarker,
                onWordSelected = { selectedPath ->
                    gameViewModel.checkSelection(selectedPath)
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 6. Action Buttons Bar (Reset, Hint, Next Level)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Reset / Retry button
                OutlinedButton(
                    onClick = { gameViewModel.resetLevel() },
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                        .testTag("reset_button"),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFCFD8DC))
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Reset Level",
                        tint = Color(0xFF546E7A),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Reset",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF546E7A)
                    )
                }

                // Hint Button 💡
                FilledTonalButton(
                    onClick = { gameViewModel.useHint() },
                    enabled = !isWordFound,
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                        .testTag("hint_button"),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.filledTonalButtonColors(
                        containerColor = Color(0xFFFFF8E1),
                        contentColor = Color(0xFFF57F17)
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Lightbulb,
                        contentDescription = "Hint",
                        tint = Color(0xFFF57F17),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Hint",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFF57F17)
                    )
                }

                // Next Level Button ➡️ (or Back to Levels in daily mode)
                val hasNext = currentLevel.levelNumber < GAME_LEVELS.size
                if (isDailyMode) {
                    Button(
                        onClick = { gameViewModel.switchToClassicMode() },
                        enabled = isWordFound,
                        modifier = Modifier
                            .weight(1.3f)
                            .height(50.dp)
                            .scale(if (isWordFound) nextButtonScale else 1f)
                            .testTag("daily_done_action_button"),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = activeMarker.primaryColor,
                            disabledContainerColor = Color(0xFFECEFF1)
                        )
                    ) {
                        Text(
                            text = "Levels",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (isWordFound) Color.White else Color(0xFF90A4AE)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.Default.GridView,
                            contentDescription = "Go to Classic Levels",
                            tint = if (isWordFound) Color.White else Color(0xFF90A4AE),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                } else {
                    Button(
                        onClick = { gameViewModel.nextLevel() },
                        enabled = isWordFound && hasNext,
                        modifier = Modifier
                            .weight(1.3f)
                            .height(50.dp)
                            .scale(if (isWordFound && hasNext) nextButtonScale else 1f)
                            .testTag("next_level_button"),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = activeMarker.primaryColor,
                            disabledContainerColor = Color(0xFFECEFF1)
                        )
                    ) {
                        Text(
                            text = "Next",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (isWordFound && hasNext) Color.White else Color(0xFF90A4AE)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                            contentDescription = "Next Level",
                            tint = if (isWordFound && hasNext) Color.White else Color(0xFF90A4AE),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }

    // Celebration Dialog on completing the picture
    if (showCelebration) {
        CelebrationDialog(
            level = currentLevel,
            hasNextLevel = !isDailyMode && currentLevel.levelNumber < GAME_LEVELS.size,
            activeMarker = activeMarker,
            praiseWord = praiseWord,
            isDailyMode = isDailyMode,
            dailyStreak = dailyStreak,
            onNextLevel = { gameViewModel.nextLevel() },
            onReplay = { gameViewModel.resetLevel() },
            onDismiss = { gameViewModel.dismissCelebration() }
        )
    }

    // Level Select Dialog
    if (showLevelSelectDialog) {
        LevelSelectDialog(
            currentLevelNumber = currentLevel.levelNumber,
            unlockedMaxLevel = unlockedMaxLevel,
            completedLevels = completedLevels,
            activeMarker = activeMarker,
            isDailyCompleted = isDailyCompleted,
            dailyStreak = dailyStreak,
            onSelectLevel = { selectedLevel ->
                gameViewModel.selectClassicLevel(selectedLevel)
            },
            onSelectDaily = {
                gameViewModel.switchToDailyMode()
            },
            onDismiss = { showLevelSelectDialog = false }
        )
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hello $name!", modifier = modifier)
}

@Preview(showBackground = true)
@Composable
fun WordSearchPreview() {
    MyApplicationTheme {
        WordSearchGameScreen()
    }
}
