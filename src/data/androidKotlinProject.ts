import { RepoFile } from '../types';

export const ANDROID_KOTLIN_FILES: RepoFile[] = [
  {
    path: '.github/workflows/build.yml',
    name: 'build.yml',
    category: 'workflow',
    language: 'yaml',
    description: 'سير عمل GitHub Actions لبناء ملف الـ APK وتوليده كـ Artifact تلقائياً عند كل Push',
    content: `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build & Assemble APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Build Debug APK with Gradle
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Android-Calculator-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error
          retention-days: 30
`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'config',
    language: 'gitignore',
    description: 'ملف الاستبعاد لمشاريع Android Studio و Gradle و Kotlin',
    content: `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
.idea/
app/build/
*.apk
*.aab
output-metadata.json
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'doc',
    language: 'markdown',
    description: 'دليل المشروع بالكامل باللغتين العربية والإنجليزية وطريقة التجميع والرفع',
    content: `# Android Material 3 Calculator (تطبيق آلة حاسبة أندرويد متكامل)

تطبيق آلة حاسبة عصري لنظام أندرويد مبني باستخدام **Kotlin** و **Jetpack Compose** ومبادئ **Material Design 3**.
المشروع جاهز ومُعد تماماً للرفع على مستودع **GitHub** مع تفعيل **GitHub Actions** للبناء التلقائي واستخراج ملف **APK** دون الحاجة إلى تثبيت Android Studio على جهازك.

---

## المميزات الرئيسية (Features)
- ➕ **العمليات الأساسية الأربع**: الجمع (+)، الطرح (−)، الضرب (×)، القسمة (÷).
- 🔢 **الأرقام العشرية والنسبة المئوية**: دعم دقيق للفواصل العشرية والنسبة المئوية (%).
- 🛡️ **إدارة ذكية للأخطاء**: منع وحماية كاملة ضد القسمة على الصفر أو التعبيرات الرياضية غير المكتملة.
- ⌫ **مسح فردي ومسح كامل**: زر مسح العنصر الأخير (Backspace) وزر مسح الشاشة بالكامل (AC).
- 📜 **سجل العمليات الحسابية (History)**: حفظ وتصفح الحسابات السابقة واسترجاع نتائجها بنقرة واحدة.
- 🎨 **تصميم Material You / Material 3**: ألوان ديناميكية، اهتزازات لمسية (Haptic Feedback)، ودعم الوضعين الفاتح والداكن (Dark/Light Mode).
- ⚙️ **GitHub Actions CI/CD**: بناء وتصدير ملف \`app-debug.apk\` تلقائياً كـ Artifact قابل للتنزيل فوراً.

---

## هيكل المجلدات (Project Directory Structure)
\`\`\`text
├── .github/
│   └── workflows/
│       └── build.yml               # GitHub Actions CI Workflow
├── app/
│   ├── build.gradle.kts            # App-level Gradle build configuration
│   ├── proguard-rules.pro          # Code obfuscation rules
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml # Android Application Manifest
│           ├── java/com/example/calculator/
│           │   ├── MainActivity.kt        # Main Compose Activity & UI
│           │   ├── CalculatorEngine.kt    # Shunting-yard Evaluation Engine
│           │   └── ui/theme/
│           │       ├── Color.kt           # Material 3 Color Palette
│           │       ├── Theme.kt           # Dynamic Theme Provider
│           │       └── Type.kt            # Typography
│           └── res/
│               └── values/
│                   ├── colors.xml         # XML Fallback Colors
│                   ├── strings.xml        # Localized String Resources
│                   └── themes.xml         # Window & Base Themes
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── build.gradle.kts                # Root-level Gradle build configuration
├── settings.gradle.kts             # Gradle project inclusion
├── gradle.properties               # JVM & AndroidX properties
├── .gitignore                      # Git ignore file
└── README.md                       # Documentation
\`\`\`

---

## طريقة الرفع على GitHub وبناء APK تلقائياً

1. قم بإنشاء مستودع جديد على حسابك في GitHub (New Repository).
2. افتح موجه الأوامر (Terminal) داخل مجلد المشروع وقم بتنفيذ الأوامر التالية:
\`\`\`bash
git init
git add .
git commit -m "Initial commit: Android Material 3 Calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
\`\`\`
3. انتقل إلى تبويب **Actions** في صفحة المستودع على GitHub.
4. ستشاهد الـ Workflow يعمل تلقائياً لبناء الـ APK في غضون 2-3 دقائق.
5. عند اكتمال البناء باللون الأخضر، اضغط على العملية وقم بتحميل ملف **Android-Calculator-APK** من قسم **Artifacts**.

---

## طريقة البناء والتشغيل محلياً (Local Build)

### باستخدام Android Studio:
1. افتح برنامج Android Studio واضغط على **Open**.
2. اختر مجلد المشروع وانتظر حتى ينتهي Gradle Sync.
3. اضغط على زر **Run** (الأيقونة الخضراء) لتشغيله على المحاكي أو هاتفك.

### باستخدام سطر الأوامر (Command Line):
\`\`\`bash
# Linux / macOS
./gradlew assembleDebug

# Windows
gradlew.bat assembleDebug
\`\`\`
سيكون ملف الـ APK الناتج متوفراً في المسار:
\`app/build/outputs/apk/debug/app-debug.apk\`
`,
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'config',
    language: 'kotlin',
    description: 'إعدادات Gradle الجذرية للمشروع وتعريف ملحقات Kotlin و Android',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'config',
    language: 'kotlin',
    description: 'ملف إعدادات Gradle لربط مستودعات Google و Maven Central',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AndroidCalculator"
include(":app")
`,
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    category: 'config',
    language: 'properties',
    description: 'خصائص JVM و AndroidX وتهيئة بيئة التجميع',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`,
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    category: 'config',
    language: 'properties',
    description: 'تحديد إصدار Gradle Wrapper الرسمي (8.4)',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (app)',
    category: 'config',
    language: 'kotlin',
    description: 'ملف بناء تطبيق الأندرويد مع مكتبات Jetpack Compose و Material 3',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.calculator"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.calculator"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.compose.material:material-icons-extended")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.02.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'source',
    language: 'xml',
    description: 'ملف تهيئة تطبيق الأندرويد وتحديد النشاط الرئيسي والأيقونة',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AndroidCalculator">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@style/Theme.AndroidCalculator">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/example/calculator/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'source',
    language: 'kotlin',
    description: 'واجهة المستخدم الرئيسية باستخدام Jetpack Compose مع دعم Material 3 الكامل',
    content: `package com.example.calculator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.calculator.ui.theme.AndroidCalculatorTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class HistoryEntry(
    val id: String = java.util.UUID.randomUUID().toString(),
    val expression: String,
    val result: String,
    val timestamp: String = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AndroidCalculatorTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CalculatorApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalculatorApp() {
    var expression by remember { mutableStateOf("") }
    var resultText by remember { mutableStateOf("0") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var historyList by remember { mutableStateOf(listOf<HistoryEntry>()) }
    var showHistoryDrawer by remember { mutableStateOf(false) }

    val haptic = LocalHapticFeedback.current

    fun onButtonClick(label: String) {
        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
        errorMessage = null

        when (label) {
            "AC" -> {
                expression = ""
                resultText = "0"
                errorMessage = null
            }
            "⌫" -> {
                if (expression.isNotEmpty()) {
                    expression = expression.dropLast(1)
                    if (expression.isEmpty()) {
                        resultText = "0"
                    } else {
                        val eval = CalculatorEngine.evaluate(expression)
                        if (eval.isSuccess) {
                            resultText = eval.result
                        }
                    }
                }
            }
            "=" -> {
                if (expression.isNotEmpty()) {
                    val eval = CalculatorEngine.evaluate(expression)
                    if (eval.isSuccess) {
                        val newEntry = HistoryEntry(
                            expression = expression,
                            result = eval.result
                        )
                        historyList = listOf(newEntry) + historyList
                        expression = eval.result
                        resultText = eval.result
                        errorMessage = null
                    } else {
                        errorMessage = eval.errorMessage
                    }
                }
            }
            "±" -> {
                if (expression.isNotEmpty()) {
                    if (expression.startsWith("-")) {
                        expression = expression.substring(1)
                    } else {
                        expression = "-$expression"
                    }
                }
            }
            "%" -> {
                if (expression.isNotEmpty() && !expression.endsWith("%")) {
                    expression += "%"
                    val eval = CalculatorEngine.evaluate(expression)
                    if (eval.isSuccess) {
                        resultText = eval.result
                    }
                }
            }
            "+", "−", "×", "÷" -> {
                if (expression.isNotEmpty()) {
                    val lastChar = expression.last()
                    if (lastChar == '+' || lastChar == '−' || lastChar == '×' || lastChar == '÷') {
                        expression = expression.dropLast(1) + label
                    } else {
                        expression += label
                    }
                } else if (label == "−") {
                    expression = "-"
                }
            }
            "." -> {
                val tokens = expression.split('+', '−', '×', '÷')
                val currentToken = tokens.lastOrNull() ?: ""
                if (!currentToken.contains(".")) {
                    if (currentToken.isEmpty()) {
                        expression += "0."
                    } else {
                        expression += "."
                    }
                }
            }
            else -> {
                // Digit 0..9
                expression += label
                val eval = CalculatorEngine.evaluate(expression)
                if (eval.isSuccess) {
                    resultText = eval.result
                }
            }
        }
    }

    if (showHistoryDrawer) {
        ModalBottomSheet(
            onDismissRequest = { showHistoryDrawer = false },
            sheetState = rememberModalBottomSheetState()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "سجل العمليات الحسابية",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(
                        onClick = { historyList = emptyList() },
                        enabled = historyList.isNotEmpty()
                    ) {
                        Icon(
                            imageVector = Icons.Default.DeleteSweep,
                            contentDescription = "مسح السجل",
                            tint = if (historyList.isNotEmpty()) MaterialTheme.colorScheme.error else Color.Gray
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                if (historyList.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "لا توجد عمليات حسابية سابقة",
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 350.dp)
                    ) {
                        items(historyList, key = { it.id }) { item ->
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .clickable {
                                        expression = item.result
                                        resultText = item.result
                                        showHistoryDrawer = false
                                    },
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                                )
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = item.expression,
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            text = item.timestamp,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "= \${item.result}",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "آلة حاسبة أندرويد",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.SemiBold
            )
            IconButton(onClick = { showHistoryDrawer = true }) {
                Icon(
                    imageVector = Icons.Default.History,
                    contentDescription = "السجل الحسابي",
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }

        // Display Screen
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(vertical = 16.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.End
        ) {
            // Expression Text
            Text(
                text = expression.ifEmpty { "0" },
                fontSize = 32.sp,
                fontWeight = FontWeight.Normal,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.End,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Error or Live Result
            if (errorMessage != null) {
                Text(
                    text = errorMessage ?: "",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.End,
                    modifier = Modifier.fillMaxWidth()
                )
            } else {
                Text(
                    text = if (expression.isNotEmpty() && resultText.isNotEmpty()) "= $resultText" else "",
                    fontSize = 44.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    textAlign = TextAlign.End,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        // Divider
        Divider(
            color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f),
            thickness = 1.dp,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Keypad Grid
        val buttonRows = listOf(
            listOf("AC", "⌫", "%", "÷"),
            listOf("7", "8", "9", "×"),
            listOf("4", "5", "6", "−"),
            listOf("1", "2", "3", "+"),
            listOf("±", "0", ".", "=")
        )

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            buttonRows.forEach { row ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    row.forEach { label ->
                        CalcButton(
                            label = label,
                            modifier = Modifier
                                .weight(1f)
                                .aspectRatio(1.15f),
                            onClick = { onButtonClick(label) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CalcButton(
    label: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val isAction = label in listOf("AC", "⌫", "%", "±")
    val isOperator = label in listOf("÷", "×", "−", "+")
    val isEqual = label == "="

    val containerColor = when {
        isEqual -> MaterialTheme.colorScheme.primary
        isOperator -> MaterialTheme.colorScheme.secondaryContainer
        isAction -> MaterialTheme.colorScheme.tertiaryContainer
        else -> MaterialTheme.colorScheme.surfaceVariant
    }

    val contentColor = when {
        isEqual -> MaterialTheme.colorScheme.onPrimary
        isOperator -> MaterialTheme.colorScheme.onSecondaryContainer
        isAction -> MaterialTheme.colorScheme.onTertiaryContainer
        else -> MaterialTheme.colorScheme.onSurface
    }

    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(containerColor)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        if (label == "⌫") {
            Icon(
                imageVector = Icons.Default.Backspace,
                contentDescription = "Backspace",
                tint = contentColor,
                modifier = Modifier.size(24.dp)
            )
        } else {
            Text(
                text = label,
                fontSize = if (label.length > 2) 20.sp else 26.sp,
                fontWeight = if (isEqual || isOperator) FontWeight.Bold else FontWeight.Medium,
                color = contentColor
            )
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/calculator/CalculatorEngine.kt',
    name: 'CalculatorEngine.kt',
    category: 'source',
    language: 'kotlin',
    description: 'محرك تقييم العمليات الرياضية الدقيق المكتوب بلغة Kotlin مع إدارة أخطاء القسمة على صفر',
    content: `package com.example.calculator

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode
import java.util.Stack

data class EvalResult(
    val isSuccess: Boolean,
    val result: String,
    val errorMessage: String? = null
)

object CalculatorEngine {

    private val mathContext = MathContext(12, RoundingMode.HALF_UP)

    fun evaluate(rawExpression: String): EvalResult {
        if (rawExpression.isBlank()) {
            return EvalResult(isSuccess = true, result = "0")
        }

        val cleaned = rawExpression
            .replace("×", "*")
            .replace("÷", "/")
            .replace("−", "-")
            .replace(" ", "")

        // Pre-check division by zero
        if (Regex("/0(?![.0-9])|/0\\\\.0+(?![1-9])").containsMatchIn(cleaned)) {
            return EvalResult(
                isSuccess = false,
                result = "0",
                errorMessage = "لا يمكن القسمة على الصفر"
            )
        }

        return try {
            val tokens = tokenize(cleaned)
            val postfix = infixToPostfix(tokens)
            val value = evaluatePostfix(postfix)

            // Format nicely
            val formatted = formatBigDecimal(value)
            EvalResult(isSuccess = true, result = formatted)
        } catch (e: ArithmeticException) {
            EvalResult(
                isSuccess = false,
                result = "0",
                errorMessage = "لا يمكن القسمة على الصفر"
            )
        } catch (e: Exception) {
            EvalResult(
                isSuccess = false,
                result = "0",
                errorMessage = "تعبير رياضي غير صالح"
            )
        }
    }

    private fun tokenize(expr: String): List<String> {
        val tokens = mutableListOf<String>()
        var i = 0
        while (i < expr.length) {
            val c = expr[i]
            when {
                c in "+*/()" -> {
                    tokens.add(c.toString())
                    i++
                }
                c == '-' -> {
                    // Check if it's unary minus or binary subtraction
                    val isUnary = (i == 0 || expr[i - 1] in "+-*/(")
                    if (isUnary) {
                        val numSb = StringBuilder("-")
                        i++
                        while (i < expr.length && (expr[i].isDigit() || expr[i] == '.')) {
                            numSb.append(expr[i])
                            i++
                        }
                        tokens.add(numSb.toString())
                    } else {
                        tokens.add("-")
                        i++
                    }
                }
                c == '%' -> {
                    tokens.add("%")
                    i++
                }
                c.isDigit() || c == '.' -> {
                    val numSb = StringBuilder()
                    while (i < expr.length && (expr[i].isDigit() || expr[i] == '.')) {
                        numSb.append(expr[i])
                        i++
                    }
                    tokens.add(numSb.toString())
                }
                else -> {
                    i++
                }
            }
        }
        return tokens
    }

    private fun precedence(op: String): Int = when (op) {
        "+", "-" -> 1
        "*", "/" -> 2
        "%" -> 3
        else -> 0
    }

    private fun infixToPostfix(tokens: List<String>): List<String> {
        val output = mutableListOf<String>()
        val operators = Stack<String>()

        for (token in tokens) {
            when {
                token.toDoubleOrNull() != null -> {
                    output.add(token)
                }
                token == "(" -> {
                    operators.push(token)
                }
                token == ")" -> {
                    while (operators.isNotEmpty() && operators.peek() != "(") {
                        output.add(operators.pop())
                    }
                    if (operators.isNotEmpty() && operators.peek() == "(") {
                        operators.pop()
                    }
                }
                token == "%" -> {
                    output.add(token)
                }
                else -> {
                    // Operator +, -, *, /
                    while (operators.isNotEmpty() && precedence(operators.peek()) >= precedence(token)) {
                        output.add(operators.pop())
                    }
                    operators.push(token)
                }
            }
        }

        while (operators.isNotEmpty()) {
            output.add(operators.pop())
        }

        return output
    }

    private fun evaluatePostfix(postfix: List<String>): BigDecimal {
        val stack = Stack<BigDecimal>()

        for (token in postfix) {
            when {
                token.toDoubleOrNull() != null -> {
                    stack.push(BigDecimal(token))
                }
                token == "%" -> {
                    if (stack.isNotEmpty()) {
                        val num = stack.pop()
                        stack.push(num.divide(BigDecimal(100), mathContext))
                    }
                }
                token in listOf("+", "-", "*", "/") -> {
                    if (stack.size < 2) continue
                    val b = stack.pop()
                    val a = stack.pop()
                    val res = when (token) {
                        "+" -> a.add(b, mathContext)
                        "-" -> a.subtract(b, mathContext)
                        "*" -> a.multiply(b, mathContext)
                        "/" -> {
                            if (b.compareTo(BigDecimal.ZERO) == 0) {
                                throw ArithmeticException("Division by zero")
                            }
                            a.divide(b, mathContext)
                        }
                        else -> BigDecimal.ZERO
                    }
                    stack.push(res)
                }
            }
        }

        return if (stack.isNotEmpty()) stack.pop() else BigDecimal.ZERO
    }

    private fun formatBigDecimal(bd: BigDecimal): String {
        val stripped = bd.stripTrailingZeros()
        return stripped.toPlainString()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/calculator/ui/theme/Color.kt',
    name: 'Color.kt',
    category: 'source',
    language: 'kotlin',
    description: 'تدرجات الألوان المعتمدة لنظام Material 3 في Jetpack Compose',
    content: `package com.example.calculator.ui.theme

import androidx.compose.ui.graphics.Color

val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

// Custom Material You Colors for Calculator
val MD3PrimaryLight = Color(0xFF00639B)
val MD3OnPrimaryLight = Color(0xFFFFFFFF)
val MD3PrimaryContainerLight = Color(0xFFCEE5FF)
val MD3OnPrimaryContainerLight = Color(0xFF001D33)

val MD3SecondaryContainerLight = Color(0xFFD7E3F8)
val MD3OnSecondaryContainerLight = Color(0xFF101C2B)

val MD3TertiaryContainerLight = Color(0xFFFFDBCF)
val MD3OnTertiaryContainerLight = Color(0xFF380D00)

val MD3PrimaryDark = Color(0xFF97CBFF)
val MD3OnPrimaryDark = Color(0xFF003353)
val MD3PrimaryContainerDark = Color(0xFF004A76)
val MD3OnPrimaryContainerDark = Color(0xFFCEE5FF)

val MD3SecondaryContainerDark = Color(0xFF3B4858)
val MD3OnSecondaryContainerDark = Color(0xFFD7E3F8)

val MD3TertiaryContainerDark = Color(0xFF5B2B1B)
val MD3OnTertiaryContainerDark = Color(0xFFFFDBCF)
`,
  },
  {
    path: 'app/src/main/java/com/example/calculator/ui/theme/Theme.kt',
    name: 'Theme.kt',
    category: 'source',
    language: 'kotlin',
    description: 'تطبيق سمات Material You الديناميكية في أندرويد 12 فما فوق',
    content: `package com.example.calculator.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = MD3PrimaryDark,
    onPrimary = MD3OnPrimaryDark,
    primaryContainer = MD3PrimaryContainerDark,
    onPrimaryContainer = MD3OnPrimaryContainerDark,
    secondaryContainer = MD3SecondaryContainerDark,
    onSecondaryContainer = MD3OnSecondaryContainerDark,
    tertiaryContainer = MD3TertiaryContainerDark,
    onTertiaryContainer = MD3OnTertiaryContainerDark
)

private val LightColorScheme = lightColorScheme(
    primary = MD3PrimaryLight,
    onPrimary = MD3OnPrimaryLight,
    primaryContainer = MD3PrimaryContainerLight,
    onPrimaryContainer = MD3OnPrimaryContainerLight,
    secondaryContainer = MD3SecondaryContainerLight,
    onSecondaryContainer = MD3OnSecondaryContainerLight,
    tertiaryContainer = MD3TertiaryContainerLight,
    onTertiaryContainer = MD3OnTertiaryContainerLight
)

@Composable
fun AndroidCalculatorTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/example/calculator/ui/theme/Type.kt',
    name: 'Type.kt',
    category: 'source',
    language: 'kotlin',
    description: 'إعدادات الخطوط والطباعة في التطبيق',
    content: `package com.example.calculator.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    )
)
`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    category: 'resource',
    language: 'xml',
    description: 'النصوص ومسميات العناصر باللغة العربية والإنجليزية',
    content: `<resources>
    <string name="app_name">آلة حاسبة أندرويد</string>
    <string name="calc_history">سجل العمليات الحسابية</string>
    <string name="clear_history">مسح السجل</string>
    <string name="no_history">لا توجد عمليات سابقة</string>
    <string name="error_divide_by_zero">لا يمكن القسمة على الصفر</string>
    <string name="error_invalid_expression">تعبير غير صالح</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'resource',
    language: 'xml',
    description: 'ألوان الموارد لنظام الأندرويد',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#00639B</color>
    <color name="primary_dark">#004A76</color>
    <color name="accent">#CEE5FF</color>
    <color name="background_light">#F8F9FA</color>
    <color name="background_dark">#121212</color>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    category: 'resource',
    language: 'xml',
    description: 'سمة النافذة وشريط الحالة في أندرويد',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AndroidCalculator" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@color/background_light</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
`,
  }
];
