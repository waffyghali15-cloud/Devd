import React, { useState, useEffect, useRef } from 'react';
import { 
  History, 
  Delete, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { evaluateExpression } from '../utils/calculatorLogic';
import { CalculationHistoryItem } from '../types';

interface AndroidSimulatorProps {
  onOpenRepo: () => void;
  onOpenGuide: () => void;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({ onOpenRepo, onOpenGuide }) => {
  const [expression, setExpression] = useState<string>('');
  const [liveResult, setLiveResult] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<'pixel-blue' | 'pixel-dark' | 'emerald' | 'amber' | 'amoled'>('pixel-dark');
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  const displayRef = useRef<HTMLDivElement>(null);

  // Update real status bar clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Audio tone synthesizer for authentic Android click sound
  const playClickSound = (type: 'num' | 'op' | 'eq' | 'clear') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freq = type === 'eq' ? 587.33 : type === 'clear' ? 330 : type === 'op' ? 440 : 523.25;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio context errors if blocked by browser
    }
  };

  const handleInput = (token: string) => {
    setErrorMessage(null);

    if (token === 'AC') {
      playClickSound('clear');
      setExpression('');
      setLiveResult('0');
      setErrorMessage(null);
      return;
    }

    if (token === '⌫') {
      playClickSound('clear');
      if (expression.length > 0) {
        // Remove multi-character scientific functions or single char
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        if (!newExpr) {
          setLiveResult('0');
        } else {
          const evalRes = evaluateExpression(newExpr, true);
          if (evalRes.success) {
            setLiveResult(evalRes.result);
          }
        }
      }
      return;
    }

    if (token === '=') {
      playClickSound('eq');
      if (!expression) return;
      const evalRes = evaluateExpression(expression, true);
      if (evalRes.success) {
        const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newEntry: CalculationHistoryItem = {
          id: String(Date.now()),
          expression: expression,
          result: evalRes.result,
          timestamp: timeNow,
        };
        setHistory((prev) => [newEntry, ...prev.slice(0, 40)]);
        setExpression(evalRes.result);
        setLiveResult(evalRes.result);
        setErrorMessage(null);
      } else {
        setErrorMessage(evalRes.error || 'خطأ في التعبير');
      }
      return;
    }

    if (token === '±') {
      playClickSound('op');
      if (!expression) {
        setExpression('-');
        return;
      }
      if (expression.startsWith('-')) {
        setExpression(expression.substring(1));
      } else {
        setExpression('-' + expression);
      }
      return;
    }

    if (['+', '−', '×', '÷'].includes(token)) {
      playClickSound('op');
      if (expression) {
        const last = expression.slice(-1);
        if (['+', '−', '×', '÷'].includes(last)) {
          setExpression(expression.slice(0, -1) + token);
        } else {
          setExpression(expression + token);
        }
      } else if (token === '−') {
        setExpression('-');
      }
      return;
    }

    if (token === '%') {
      playClickSound('op');
      if (expression && !expression.endsWith('%')) {
        const newExpr = expression + '%';
        setExpression(newExpr);
        const evalRes = evaluateExpression(newExpr, true);
        if (evalRes.success) setLiveResult(evalRes.result);
      }
      return;
    }

    if (token === '.') {
      playClickSound('num');
      const parts = expression.split(/[+\−×÷]/);
      const currentToken = parts[parts.length - 1] || '';
      if (!currentToken.includes('.')) {
        const next = expression + (currentToken.length === 0 ? '0.' : '.');
        setExpression(next);
      }
      return;
    }

    // Default numeric/function input
    playClickSound('num');
    const updated = expression + token;
    setExpression(updated);

    const evalRes = evaluateExpression(updated, true);
    if (evalRes.success) {
      setLiveResult(evalRes.result);
    }
  };

  const copyCurrentResult = () => {
    const val = errorMessage ? expression : liveResult;
    navigator.clipboard.writeText(val);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  // Theme styling map
  const themeClasses = {
    'pixel-dark': {
      bg: 'bg-neutral-950 text-neutral-100',
      phoneBody: 'bg-[#181a1d] border-neutral-700 shadow-2xl',
      displayBg: 'bg-neutral-900/60',
      numBtn: 'bg-neutral-800/80 hover:bg-neutral-700 active:bg-neutral-600 text-white',
      opBtn: 'bg-blue-950 hover:bg-blue-900 active:bg-blue-800 text-blue-300',
      fnBtn: 'bg-neutral-700/70 hover:bg-neutral-600 text-neutral-200',
      eqBtn: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md shadow-blue-900/30',
      accentText: 'text-blue-400',
    },
    'pixel-blue': {
      bg: 'bg-slate-900 text-slate-100',
      phoneBody: 'bg-[#0f172a] border-sky-900/50 shadow-2xl',
      displayBg: 'bg-sky-950/40',
      numBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
      opBtn: 'bg-sky-900/80 hover:bg-sky-800 text-sky-300',
      fnBtn: 'bg-slate-700/60 hover:bg-slate-600 text-slate-200',
      eqBtn: 'bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white shadow-md shadow-sky-950/50',
      accentText: 'text-sky-400',
    },
    'emerald': {
      bg: 'bg-zinc-950 text-zinc-100',
      phoneBody: 'bg-[#0a1f18] border-emerald-900/50 shadow-2xl',
      displayBg: 'bg-emerald-950/40',
      numBtn: 'bg-zinc-800 hover:bg-zinc-700 text-emerald-50',
      opBtn: 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300',
      fnBtn: 'bg-zinc-700/60 hover:bg-zinc-600 text-emerald-200',
      eqBtn: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md shadow-emerald-950/50',
      accentText: 'text-emerald-400',
    },
    'amber': {
      bg: 'bg-stone-950 text-stone-100',
      phoneBody: 'bg-[#221811] border-amber-900/40 shadow-2xl',
      displayBg: 'bg-amber-950/30',
      numBtn: 'bg-stone-800 hover:bg-stone-700 text-amber-50',
      opBtn: 'bg-amber-950/80 hover:bg-amber-900 text-amber-300',
      fnBtn: 'bg-stone-700/60 hover:bg-stone-600 text-amber-200',
      eqBtn: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-950/50',
      accentText: 'text-amber-400',
    },
    'amoled': {
      bg: 'bg-black text-white',
      phoneBody: 'bg-black border-neutral-800 shadow-2xl',
      displayBg: 'bg-neutral-950',
      numBtn: 'bg-neutral-900 hover:bg-neutral-800 text-white',
      opBtn: 'bg-neutral-800 hover:bg-neutral-700 text-indigo-300',
      fnBtn: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300',
      eqBtn: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md',
      accentText: 'text-indigo-400',
    },
  }[selectedTheme];

  return (
    <div id="android-simulator-container" className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-6xl mx-auto py-4">
      {/* Phone Hardware Mockup */}
      <div 
        id="phone-chassis"
        className={`relative w-full max-w-[390px] h-[780px] rounded-[50px] p-4 ${themeClasses.phoneBody} border-[8px] flex flex-col justify-between select-none transition-all duration-300 ring-1 ring-white/10`}
      >
        {/* Top Punch Hole & Speaker */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          <div className="w-12 h-1 bg-neutral-700/70 rounded-full" />
          <div className="w-4 h-4 bg-black rounded-full border border-neutral-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-950 rounded-full" />
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="pt-2 px-4 flex items-center justify-between text-xs text-neutral-400 font-medium z-20">
          <span className="tracking-wide">{currentTime}</span>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* In-App Header */}
        <div className="px-2 py-2 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              %
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-tight">آلة حاسبة أندرويد</h1>
              <p className="text-[10px] text-neutral-400">Material Design 3</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>
            <button
              id="btn-history-toggle"
              onClick={() => setIsHistoryOpen(true)}
              title="سجل الحسابات"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 transition-colors relative"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div 
          ref={displayRef}
          id="calc-display-area"
          className={`flex-1 mx-1 my-1 p-4 rounded-3xl ${themeClasses.displayBg} flex flex-col justify-end items-end overflow-hidden transition-colors border border-white/5 relative`}
        >
          {/* Scientific Mode Toggle Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <button
              id="btn-toggle-scientific"
              onClick={() => setIsScientific(!isScientific)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                isScientific ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/10 text-neutral-300 hover:bg-white/15'
              }`}
            >
              {isScientific ? 'وضع علمي 📐' : 'علمي (Sci)'}
            </button>

            {(expression || liveResult !== '0') && (
              <button
                id="btn-copy-result"
                onClick={copyCurrentResult}
                className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20 transition-all"
                title="نسخ النتيجة"
              >
                {copiedResult ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResult ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            )}
          </div>

          {/* Active Expression View */}
          <div className="w-full text-right overflow-x-auto scrollbar-none py-1">
            <span className="text-2xl lg:text-3xl font-light text-neutral-300 tracking-wide font-mono break-all dir-ltr inline-block">
              {expression || '0'}
            </span>
          </div>

          {/* Live Result or Error */}
          <div className="w-full text-right overflow-hidden mt-1">
            {errorMessage ? (
              <div className="text-red-400 font-bold text-base md:text-lg animate-pulse py-1">
                ⚠️ {errorMessage}
              </div>
            ) : (
              <div className={`text-4xl lg:text-5xl font-bold ${themeClasses.accentText} tracking-tight font-mono break-all dir-ltr`}>
                {expression ? `= ${liveResult}` : ''}
              </div>
            )}
          </div>
        </div>

        {/* Scientific Secondary Keypad Row (Collapsible) */}
        {isScientific && (
          <div className="grid grid-cols-5 gap-1.5 px-1 py-1 mb-1 animate-fadeIn">
            {['sin', 'cos', 'tan', '√', '^'].map((fn) => (
              <button
                key={fn}
                onClick={() => handleInput(fn === '√' ? '√(' : fn === '^' ? '^' : `${fn}(`)}
                className="h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-medium active:scale-95 transition-all"
              >
                {fn}
              </button>
            ))}
            {['(', ')', 'ln', 'log', 'π'].map((fn) => (
              <button
                key={fn}
                onClick={() => handleInput(fn === 'ln' ? 'ln(' : fn === 'log' ? 'log(' : fn)}
                className="h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-medium active:scale-95 transition-all"
              >
                {fn}
              </button>
            ))}
          </div>
        )}

        {/* Primary Keypad Grid */}
        <div id="calc-keypad" className="grid grid-cols-4 gap-2.5 p-1">
          {/* Row 1 */}
          <button
            id="btn-ac"
            onClick={() => handleInput('AC')}
            className={`h-14 rounded-full ${themeClasses.fnBtn} font-bold text-lg text-amber-300 active:scale-95 transition-all flex items-center justify-center`}
          >
            AC
          </button>
          <button
            id="btn-backspace"
            onClick={() => handleInput('⌫')}
            className={`h-14 rounded-full ${themeClasses.fnBtn} font-bold text-lg active:scale-95 transition-all flex items-center justify-center`}
            title="حذف حرف واحد (Backspace)"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            id="btn-percent"
            onClick={() => handleInput('%')}
            className={`h-14 rounded-full ${themeClasses.fnBtn} font-bold text-lg active:scale-95 transition-all flex items-center justify-center`}
          >
            %
          </button>
          <button
            id="btn-divide"
            onClick={() => handleInput('÷')}
            className={`h-14 rounded-full ${themeClasses.opBtn} font-bold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            id="btn-7"
            onClick={() => handleInput('7')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            7
          </button>
          <button
            id="btn-8"
            onClick={() => handleInput('8')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            8
          </button>
          <button
            id="btn-9"
            onClick={() => handleInput('9')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            9
          </button>
          <button
            id="btn-multiply"
            onClick={() => handleInput('×')}
            className={`h-14 rounded-full ${themeClasses.opBtn} font-bold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            id="btn-4"
            onClick={() => handleInput('4')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            4
          </button>
          <button
            id="btn-5"
            onClick={() => handleInput('5')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            5
          </button>
          <button
            id="btn-6"
            onClick={() => handleInput('6')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            6
          </button>
          <button
            id="btn-subtract"
            onClick={() => handleInput('−')}
            className={`h-14 rounded-full ${themeClasses.opBtn} font-bold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            −
          </button>

          {/* Row 4 */}
          <button
            id="btn-1"
            onClick={() => handleInput('1')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            1
          </button>
          <button
            id="btn-2"
            onClick={() => handleInput('2')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            2
          </button>
          <button
            id="btn-3"
            onClick={() => handleInput('3')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            3
          </button>
          <button
            id="btn-add"
            onClick={() => handleInput('+')}
            className={`h-14 rounded-full ${themeClasses.opBtn} font-bold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            id="btn-negate"
            onClick={() => handleInput('±')}
            className={`h-14 rounded-full ${themeClasses.fnBtn} font-semibold text-xl active:scale-95 transition-all flex items-center justify-center`}
          >
            ±
          </button>
          <button
            id="btn-0"
            onClick={() => handleInput('0')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            0
          </button>
          <button
            id="btn-dot"
            onClick={() => handleInput('.')}
            className={`h-14 rounded-full ${themeClasses.numBtn} font-bold text-2xl active:scale-95 transition-all flex items-center justify-center`}
          >
            .
          </button>
          <button
            id="btn-equals"
            onClick={() => handleInput('=')}
            className={`h-14 rounded-full ${themeClasses.eqBtn} font-bold text-3xl active:scale-95 transition-all flex items-center justify-center`}
          >
            =
          </button>
        </div>

        {/* Android Navigation Gesture Pill */}
        <div className="pb-1 pt-2 flex justify-center">
          <div className="w-32 h-1 bg-neutral-600 rounded-full" />
        </div>

        {/* History Slide-Up Sheet Modal inside phone */}
        {isHistoryOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 rounded-[42px] flex flex-col justify-end p-2 animate-fadeIn">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 max-h-[75%] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-white font-bold">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>سجل العمليات الحسابية</span>
                </div>
                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="مسح السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg text-xs"
                  >
                    إغلاق ✕
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 py-2 space-y-2 max-h-[360px] scrollbar-thin">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-neutral-500 text-sm">
                    لا توجد عمليات حسابية سابقة
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setExpression(item.result);
                        setLiveResult(item.result);
                        setIsHistoryOpen(false);
                      }}
                      className="p-3 bg-neutral-800/60 hover:bg-neutral-800 rounded-2xl cursor-pointer border border-neutral-700/40 transition-all group"
                    >
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span className="font-mono">{item.expression}</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <div className="text-lg font-bold text-blue-400 font-mono mt-1 group-hover:text-blue-300">
                        = {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Companion Controls & Highlights */}
      <div className="w-full lg:w-96 flex flex-col gap-5">
        {/* Info Card */}
        <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm shadow-xl text-neutral-200">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">محاكي أندرويد الحي</h2>
              <p className="text-xs text-neutral-400">Android Material 3 Engine</p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            هذا المحاكي يعمل بنفس الخوارزمية البرمجية الدقيقة (Shunting-yard Algorithm) المكتوبة في ملفات Kotlin و Flutter للمشروع، ويدعم:
          </p>

          <ul className="mt-3 space-y-1.5 text-xs text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>العمليات الأساسية الأربع (+, −, ×, ÷) بدقة متناهية</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>إدارة الأخطاء وحظر القسمة على الصفر</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>زر الحذف الفردي (Backspace) ومسح الشاشة (AC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>سجل العمليات الحسابية لحفظ النتائج السابقة</span>
            </li>
          </ul>
        </div>

        {/* Theme Picker */}
        <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-300">ألوان Material You الديناميكية</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'pixel-dark', name: 'Dark Pixel', color: 'bg-blue-600' },
              { id: 'pixel-blue', name: 'Ocean Sky', color: 'bg-sky-500' },
              { id: 'emerald', name: 'Forest', color: 'bg-emerald-500' },
              { id: 'amber', name: 'Amber Glow', color: 'bg-amber-500' },
              { id: 'amoled', name: 'AMOLED Pure', color: 'bg-indigo-600' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id as typeof selectedTheme)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                  selectedTheme === t.id
                    ? 'border-white bg-white/10 shadow-sm'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${t.color}`} />
                <span className="text-[10px] text-neutral-300">{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-goto-repo"
            onClick={onOpenRepo}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all"
          >
            <span>📁 استعراض وتنزيل ملفات المستودع (GitHub Code)</span>
          </button>
          
          <button
            id="btn-goto-guide"
            onClick={onOpenGuide}
            className="w-full py-3.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 font-semibold text-sm flex items-center justify-center gap-2 border border-neutral-700/70 transition-all"
          >
            <span>🚀 دليل رفع المستودع وبناء APK خطوة بخطوة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
