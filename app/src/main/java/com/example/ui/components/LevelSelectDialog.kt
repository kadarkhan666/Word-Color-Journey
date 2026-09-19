package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.model.GAME_LEVELS
import com.example.model.LevelData
import com.example.model.MarkerColor

@Composable
fun LevelSelectDialog(
    currentLevelNumber: Int,
    unlockedMaxLevel: Int,
    completedLevels: Set<Int>,
    activeMarker: MarkerColor,
    isDailyCompleted: Boolean = false,
    dailyStreak: Int = 0,
    onSelectLevel: (LevelData) -> Unit,
    onSelectDaily: () -> Unit = {},
    onDismiss: () -> Unit
) {
    val gridState = rememberLazyGridState()

    // Auto scroll to current level in the 100 levels grid
    LaunchedEffect(currentLevelNumber) {
        val targetIndex = (currentLevelNumber - 1).coerceAtLeast(0)
        gridState.scrollToItem(targetIndex)
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0x77000000))
                .padding(horizontal = 16.dp, vertical = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxSize(0.92f)
                    .shadow(16.dp, RoundedCornerShape(32.dp))
                    .clip(RoundedCornerShape(32.dp))
                    .border(3.dp, Color(0xFFE0E0E0), RoundedCornerShape(32.dp)),
                color = Color(0xFFFAFAFA)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(18.dp)
                ) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "Select Level",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF263238)
                            )
                            Text(
                                text = "${completedLevels.size} / ${GAME_LEVELS.size} Completed",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF78909C)
                            )
                        }
                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier
                                .testTag("close_level_dialog_button")
                                .size(40.dp)
                                .background(Color(0xFFECEFF1), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close",
                                tint = Color(0xFF455A64)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Daily Puzzle Quick Banner inside Level Selector
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("select_dialog_daily_button")
                            .shadow(2.dp, RoundedCornerShape(18.dp))
                            .clip(RoundedCornerShape(18.dp))
                            .background(Color(0xFFFFF9C4))
                            .border(2.dp, Color(0xFFFFB300), RoundedCornerShape(18.dp))
                            .clickable {
                                onSelectDaily()
                                onDismiss()
                            }
                            .padding(horizontal = 14.dp, vertical = 10.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(text = "📅", fontSize = 26.sp)
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "Today's Daily Puzzle",
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 14.sp,
                                        color = Color(0xFFE65100)
                                    )
                                    Text(
                                        text = if (isDailyCompleted) "Completed today! ✓" else "New unique puzzle every day!",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = if (isDailyCompleted) Color(0xFF2E7D32) else Color(0xFF5D4037)
                                    )
                                }
                            }

                            if (dailyStreak > 0) {
                                Text(
                                    text = "🔥 $dailyStreak",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 13.sp,
                                    color = Color(0xFFE65100)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        state = gridState,
                        contentPadding = PaddingValues(bottom = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        items(GAME_LEVELS) { level ->
                            val isUnlocked = level.levelNumber <= unlockedMaxLevel
                            val isCompleted = completedLevels.contains(level.levelNumber)
                            val isCurrent = level.levelNumber == currentLevelNumber

                            val cardBg = when {
                                isCurrent -> Color(0xFFFFF8E1)
                                isUnlocked -> Color.White
                                else -> Color(0xFFECEFF1)
                            }

                            val borderCol = when {
                                isCurrent -> activeMarker.primaryColor
                                isCompleted -> Color(0xFF81C784)
                                else -> Color(0xFFCFD8DC)
                            }

                            Box(
                                modifier = Modifier
                                    .testTag("level_item_${level.levelNumber}")
                                    .shadow(if (isUnlocked) 4.dp else 0.dp, RoundedCornerShape(20.dp))
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(cardBg)
                                    .border(2.5.dp, borderCol, RoundedCornerShape(20.dp))
                                    .clickable(enabled = isUnlocked) {
                                        onSelectLevel(level)
                                        onDismiss()
                                    }
                                    .padding(14.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Level ${level.levelNumber}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = if (isUnlocked) Color(0xFF37474F) else Color(0xFF90A4AE)
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    if (isUnlocked) {
                                        Text(
                                            text = level.icon,
                                            fontSize = 32.sp
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = level.word,
                                            fontWeight = FontWeight.ExtraBold,
                                            fontSize = 15.sp,
                                            color = activeMarker.primaryColor
                                        )

                                        Spacer(modifier = Modifier.height(6.dp))

                                        // Stars
                                        Row {
                                            repeat(3) { starIdx ->
                                                Icon(
                                                    imageVector = Icons.Default.Star,
                                                    contentDescription = null,
                                                    tint = if (isCompleted) Color(0xFFFFB300) else Color(0xFFE0E0E0),
                                                    modifier = Modifier.size(16.dp)
                                                )
                                            }
                                        }
                                    } else {
                                        Box(
                                            modifier = Modifier
                                                .size(48.dp)
                                                .background(Color(0xFFCFD8DC), CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Lock,
                                                contentDescription = "Locked level",
                                                tint = Color(0xFF78909C),
                                                modifier = Modifier.size(24.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = "Locked",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = Color(0xFF90A4AE)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
