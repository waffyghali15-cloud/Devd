import { RepoFile } from '../types';

export const FLUTTER_FILES: RepoFile[] = [
  {
    path: '.github/workflows/build.yml',
    name: 'build.yml',
    category: 'workflow',
    language: 'yaml',
    description: 'سير عمل GitHub Actions لبناء تطبيق Flutter APK وتوليده كـ Artifact تلقائياً',
    content: `name: Build Flutter Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Flutter APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Set up Flutter SDK
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.x'
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Run Tests
        run: flutter test

      - name: Build Android APK (Release)
        run: flutter build apk --release

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Flutter-Calculator-APK
          path: build/app/outputs/flutter-apk/app-release.apk
          if-no-files-found: error
          retention-days: 30
`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'config',
    language: 'gitignore',
    description: 'ملف الاستبعاد لمشاريع Flutter و Dart و Android',
    content: `# Miscellaneous
*.class
*.lock
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/

# Android related
**/android/**/gradle-wrapper.jar
**/android/.gradle
**/android/captures/
**/android/gradlew
**/android/gradlew.bat
**/android/local.properties
**/android/**/GeneratedPluginRegistrant.java

# Coverage
coverage/
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'doc',
    language: 'markdown',
    description: 'دليل مشروع Flutter وطريقة التجميع باللغتين العربية والإنجليزية',
    content: `# Flutter Material 3 Calculator (تطبيق آلة حاسبة فلاتر)

تطبيق آلة حاسبة احترافي مبني باستخدام إطار عمل **Flutter** ولغة **Dart** بتصميم **Material Design 3**.
المشروع جاهز ومُعد تماماً للرفع المباشر على **GitHub** مع تفعيل سير عمل **GitHub Actions** لبناء ملف **APK** تلقائياً عند كل عملية Push وتنزيله كـ Artifact.

---

## المميزات الأساسية
- ⚡ **أداء فائق وسرعة استجابة**: مبني بالكامل بأحدث إصدارات Flutter.
- ➗ **العمليات الحسابية الأربع**: جمع، طرح، ضرب، قسمة.
- 🛡️ **إدارة الأخطاء**: حماية كاملة من القسمة على الصفر والتعبيرات غير المكتملة.
- ⌫ **مسح فردي (Backspace) ومسح كامل (AC)**.
- 📜 **سجل الحسابات (History Tape)**: تخزين ومراجعة العمليات السابقة.
- 🎨 **تصميم Material 3 متناسق**: مع دعم الوضعين الفاتح والداكن.
- 🚀 **GitHub Actions CI/CD**: بناء وتصدير \`app-release.apk\` تلقائياً.

---

## خطوات الرفع على GitHub وبناء APK:
\`\`\`bash
git init
git add .
git commit -m "Initial commit: Flutter Calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
\`\`\`
بعد الرفع، انتقل لتبويب **Actions** على GitHub وحمل ملف **Flutter-Calculator-APK**.
`,
  },
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    language: 'yaml',
    description: 'ملف تبعيات مشروع Flutter وتحديد الحزم والخطوط',
    content: `name: flutter_calculator
description: "A complete Material 3 Calculator Android App built with Flutter."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'source',
    language: 'dart',
    description: 'نقطة انطلاق تطبيق Flutter وضبط السمة Material 3',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'calculator_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'آلة حاسبة أندرويد',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF00639B),
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF00639B),
        brightness: Brightness.dark,
      ),
      home: const CalculatorScreen(),
    );
  }
}
`,
  },
  {
    path: 'lib/calculator_engine.dart',
    name: 'calculator_engine.dart',
    category: 'source',
    language: 'dart',
    description: 'محرك العمليات الرياضية الدقيق المكتوب بلغة Dart',
    content: `class CalculatorResult {
  final bool isSuccess;
  final String result;
  final String? errorMessage;

  CalculatorResult({
    required this.isSuccess,
    required this.result,
    this.errorMessage,
  });
}

class CalculatorEngine {
  static CalculatorResult evaluate(String expression) {
    if (expression.trim().isEmpty) {
      return CalculatorResult(isSuccess: true, result: '0');
    }

    String sanitized = expression
        .replaceAll('×', '*')
        .replaceAll('÷', '/')
        .replaceAll('−', '-')
        .replaceAll(' ', '');

    // Check division by zero
    if (RegExp(r'/0(?![.0-9])|/0\.0+(?![1-9])').hasMatch(sanitized)) {
      return CalculatorResult(
        isSuccess: false,
        result: '0',
        errorMessage: 'لا يمكن القسمة على الصفر',
      );
    }

    try {
      // Evaluate percentages
      sanitized = sanitized.replaceAllMapped(
        RegExp(r'(\\d+(\\.\\d+)?)%'),
        (match) => '(\${match.group(1)}/100)',
      );

      final tokens = _tokenize(sanitized);
      final postfix = _infixToPostfix(tokens);
      final value = _evaluatePostfix(postfix);

      // Clean trailing zeros
      String formatted;
      if (value % 1 == 0) {
        formatted = value.toInt().toString();
      } else {
        formatted = value.toStringAsFixed(8).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '');
      }

      return CalculatorResult(isSuccess: true, result: formatted);
    } catch (e) {
      return CalculatorResult(
        isSuccess: false,
        result: '0',
        errorMessage: 'تعبير غير صالح',
      );
    }
  }

  static List<String> _tokenize(String expr) {
    final tokens = <String>[];
    int i = 0;
    while (i < expr.length) {
      final c = expr[i];
      if ('+*/()'.contains(c)) {
        tokens.add(c);
        i++;
      } else if (c == '-') {
        if (i == 0 || '+-*/('.contains(expr[i - 1])) {
          // Unary minus
          final sb = StringBuffer('-');
          i++;
          while (i < expr.length && ('0123456789.'.contains(expr[i]))) {
            sb.write(expr[i]);
            i++;
          }
          tokens.add(sb.toString());
        } else {
          tokens.add('-');
          i++;
        }
      } else if ('0123456789.'.contains(c)) {
        final sb = StringBuffer();
        while (i < expr.length && ('0123456789.'.contains(expr[i]))) {
          sb.write(expr[i]);
          i++;
        }
        tokens.add(sb.toString());
      } else {
        i++;
      }
    }
    return tokens;
  }

  static int _precedence(String op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
  }

  static List<String> _infixToPostfix(List<String> tokens) {
    final output = <String>[];
    final ops = <String>[];

    for (final token in tokens) {
      if (double.tryParse(token) != null) {
        output.add(token);
      } else if (token == '(') {
        ops.add(token);
      } else if (token == ')') {
        while (ops.isNotEmpty && ops.last != '(') {
          output.add(ops.removeLast());
        }
        if (ops.isNotEmpty && ops.last == '(') {
          ops.removeLast();
        }
      } else {
        while (ops.isNotEmpty && _precedence(ops.last) >= _precedence(token)) {
          output.add(ops.removeLast());
        }
        ops.add(token);
      }
    }

    while (ops.isNotEmpty) {
      output.add(ops.removeLast());
    }

    return output;
  }

  static double _evaluatePostfix(List<String> postfix) {
    final stack = <double>[];

    for (final token in postfix) {
      final num = double.tryParse(token);
      if (num != null) {
        stack.add(num);
      } else if (['+', '-', '*', '/'].contains(token)) {
        if (stack.length < 2) continue;
        final b = stack.removeLast();
        final a = stack.removeLast();
        switch (token) {
          case '+':
            stack.add(a + b);
            break;
          case '-':
            stack.add(a - b);
            break;
          case '*':
            stack.add(a * b);
            break;
          case '/':
            if (b == 0) throw Exception('Division by zero');
            stack.add(a / b);
            break;
        }
      }
    }

    return stack.isNotEmpty ? stack.last : 0.0;
  }
}
`,
  },
  {
    path: 'lib/calculator_screen.dart',
    name: 'calculator_screen.dart',
    category: 'source',
    language: 'dart',
    description: 'شاشة الآلة الحاسبة وأزرار التفاعل وسجل العمليات الحسابية في Flutter',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'calculator_engine.dart';

class HistoryEntry {
  final String expression;
  final String result;
  final String timestamp;

  HistoryEntry({
    required this.expression,
    required this.result,
    required this.timestamp,
  });
}

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  String _expression = '';
  String _result = '0';
  String? _errorMessage;
  final List<HistoryEntry> _history = [];

  void _onButtonPressed(String label) {
    HapticFeedback.lightImpact();
    setState(() {
      _errorMessage = null;

      switch (label) {
        case 'AC':
          _expression = '';
          _result = '0';
          _errorMessage = null;
          break;
        case '⌫':
          if (_expression.isNotEmpty) {
            _expression = _expression.substring(0, _expression.length - 1);
            if (_expression.isEmpty) {
              _result = '0';
            } else {
              final eval = CalculatorEngine.evaluate(_expression);
              if (eval.isSuccess) {
                _result = eval.result;
              }
            }
          }
          break;
        case '=':
          if (_expression.isNotEmpty) {
            final eval = CalculatorEngine.evaluate(_expression);
            if (eval.isSuccess) {
              final now = DateTime.now();
              final timeStr = '\${now.hour.toString().padLeft(2, '0')}:\${now.minute.toString().padLeft(2, '0')}:\${now.second.toString().padLeft(2, '0')}';
              _history.insert(0, HistoryEntry(
                expression: _expression,
                result: eval.result,
                timestamp: timeStr,
              ));
              _expression = eval.result;
              _result = eval.result;
            } else {
              _errorMessage = eval.errorMessage;
            }
          }
          break;
        case '±':
          if (_expression.isNotEmpty) {
            if (_expression.startsWith('-')) {
              _expression = _expression.substring(1);
            } else {
              _expression = '-\$_expression';
            }
          }
          break;
        case '%':
          if (_expression.isNotEmpty && !_expression.endsWith('%')) {
            _expression += '%';
            final eval = CalculatorEngine.evaluate(_expression);
            if (eval.isSuccess) {
              _result = eval.result;
            }
          }
          break;
        case '+':
        case '−':
        case '×':
        case '÷':
          if (_expression.isNotEmpty) {
            final last = _expression[_expression.length - 1];
            if (['+', '−', '×', '÷'].contains(last)) {
              _expression = _expression.substring(0, _expression.length - 1) + label;
            } else {
              _expression += label;
            }
          } else if (label == '−') {
            _expression = '-';
          }
          break;
        case '.':
          final tokens = _expression.split(RegExp(r'[+−×÷]'));
          final current = tokens.isNotEmpty ? tokens.last : '';
          if (!current.contains('.')) {
            _expression += current.isEmpty ? '0.' : '.';
          }
          break;
        default:
          _expression += label;
          final eval = CalculatorEngine.evaluate(_expression);
          if (eval.isSuccess) {
            _result = eval.result;
          }
          break;
      }
    });
  }

  void _showHistoryModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'سجل العمليات الحسابية',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_sweep, color: Colors.red),
                  onPressed: _history.isEmpty
                      ? null
                      : () {
                          setState(() => _history.clear());
                          Navigator.pop(context);
                        },
                ),
              ],
            ),
            const Divider(),
            if (_history.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 40.0),
                child: Center(
                  child: Text('لا توجد عمليات سابقة', style: TextStyle(color: Colors.grey)),
                ),
              )
            else
              ConstrainedBox(
                constraints: const BoxConstraints(maxHeight: 300),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: _history.length,
                  itemBuilder: (context, index) {
                    final item = _history[index];
                    return ListTile(
                      title: Text(item.expression, style: const TextStyle(fontSize: 16)),
                      subtitle: Text(item.timestamp, style: const TextStyle(fontSize: 12)),
                      trailing: Text('= \${item.result}',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          )),
                      onTap: () {
                        setState(() {
                          _expression = item.result;
                          _result = item.result;
                        });
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildButton(String text, {Color? bgColor, Color? textColor}) {
    final theme = Theme.of(context);
    final isSpecial = ['AC', '⌫', '%', '±'].contains(text);
    final isOperator = ['÷', '×', '−', '+'].contains(text);
    final isEqual = text == '=';

    Color bg = bgColor ??
        (isEqual
            ? theme.colorScheme.primary
            : isOperator
                ? theme.colorScheme.secondaryContainer
                : isSpecial
                    ? theme.colorScheme.tertiaryContainer
                    : theme.colorScheme.surfaceVariant);

    Color fg = textColor ??
        (isEqual
            ? theme.colorScheme.onPrimary
            : isOperator
                ? theme.colorScheme.onSecondaryContainer
                : isSpecial
                    ? theme.colorScheme.onTertiaryContainer
                    : theme.colorScheme.onSurface);

    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(5.0),
        child: AspectRatio(
          aspectRatio: 1.15,
          child: Material(
            color: bg,
            shape: const CircleBorder(),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: () => _onButtonPressed(text),
              child: Center(
                child: text == '⌫'
                    ? Icon(Icons.backspace_outlined, color: fg, size: 24)
                    : Text(
                        text,
                        style: TextStyle(
                          fontSize: text.length > 2 ? 18 : 24,
                          fontWeight: (isEqual || isOperator) ? FontWeight.bold : FontWeight.w500,
                          color: fg,
                        ),
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('آلة حاسبة أندرويد', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: _showHistoryModal,
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                alignment: Alignment.bottomRight,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      reverse: true,
                      child: Text(
                        _expression.isEmpty ? '0' : _expression,
                        style: TextStyle(
                          fontSize: 32,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (_errorMessage != null)
                      Text(
                        _errorMessage!,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.error,
                        ),
                      )
                    else
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        reverse: true,
                        child: Text(
                          _expression.isNotEmpty ? '= $_result' : '',
                          style: TextStyle(
                            fontSize: 44,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Row(children: [_buildButton('AC'), _buildButton('⌫'), _buildButton('%'), _buildButton('÷')]),
                  Row(children: [_buildButton('7'), _buildButton('8'), _buildButton('9'), _buildButton('×')]),
                  Row(children: [_buildButton('4'), _buildButton('5'), _buildButton('6'), _buildButton('−')]),
                  Row(children: [_buildButton('1'), _buildButton('2'), _buildButton('3'), _buildButton('+')]),
                  Row(children: [_buildButton('±'), _buildButton('0'), _buildButton('.'), _buildButton('=')]),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'android/app/build.gradle',
    name: 'build.gradle (android app)',
    category: 'config',
    language: 'groovy',
    description: 'تهيئة بناء أندرويد لتطبيق Flutter',
    content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0.0'
}

android {
    namespace "com.example.flutter_calculator"
    compileSdk flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "com.example.flutter_calculator"
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}

dependencies {}
`,
  },
  {
    path: 'android/build.gradle',
    name: 'build.gradle (android root)',
    category: 'config',
    language: 'groovy',
    description: 'إعدادات Gradle الجذرية لمجلد أندرويد في Flutter',
    content: `allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
`,
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml (Flutter)',
    category: 'source',
    language: 'xml',
    description: 'مانيفيست الأندرويد لتطبيق Flutter',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="آلة حاسبة أندرويد"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`,
  }
];
