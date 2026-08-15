import React, { useState } from 'react';
import { 
  Smartphone, 
  FolderGit2, 
  BookOpenCheck, 
  Download, 
  Github, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';
import { AndroidSimulator } from './components/AndroidSimulator';
import { RepoExplorer } from './components/RepoExplorer';
import { GithubGuideModal } from './components/GithubGuideModal';
import { ANDROID_KOTLIN_FILES } from './data/androidKotlinProject';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'repo' | 'guide'>('simulator');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleDownloadFullZip = async () => {
    try {
      setIsDownloadingZip(true);
      const zip = new JSZip();
      
      ANDROID_KOTLIN_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'android-calculator-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to download project zip', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-neutral-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased" dir="rtl">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#12151a]/95 backdrop-blur-md border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">
                  تطبيق آلة حاسبة أندرويد
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Android Native + GitHub Actions
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                مشروع جاهز ومكتمل 100% للرفع المباشر وبناء ملف الـ APK
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-neutral-900 p-1 rounded-2xl border border-neutral-800">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>المحاكي التفاعلي</span>
            </button>
            <button
              id="tab-repo"
              onClick={() => setActiveTab('repo')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'repo'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>ملفات المستودع (Code)</span>
            </button>
            <button
              id="tab-guide"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-all"
            >
              <BookOpenCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">دليل الرفع وبناء الـ APK</span>
            </button>
          </nav>

          {/* Download Full Project ZIP */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="btn-header-download"
              onClick={handleDownloadFullZip}
              disabled={isDownloadingZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'جارٍ التحميل...' : 'تحميل المشروع (ZIP)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quality Badges Banner */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">بدون أي اختصارات</p>
              <p className="text-[10px] text-neutral-400">كود برمجي متكامل 100%</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">سير عمل GitHub Actions</p>
              <p className="text-[10px] text-neutral-400">بناء وتوليد APK تلقائياً</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">إدارة ذكية للأخطاء</p>
              <p className="text-[10px] text-neutral-400">حماية من القسمة على صفر</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Material Design 3</p>
              <p className="text-[10px] text-neutral-400">أندرويد أصيل + سجل حسابات</p>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'simulator' ? (
          <AndroidSimulator
            onOpenRepo={() => setActiveTab('repo')}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        ) : (
          <RepoExplorer />
        )}
      </main>

      {/* GitHub Setup Guide Modal */}
      <GithubGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onDownloadZip={handleDownloadFullZip}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-neutral-800/80 text-center text-xs text-neutral-500 bg-[#0a0c0f]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 تطبيق آلة حاسبة أندرويد — مصمم ومُعد للرفع المباشر على GitHub وبناء APK عبر GitHub Actions</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Kotlin & Jetpack Compose</span>
            <span>•</span>
            <span>Flutter & Dart</span>
            <span>•</span>
            <span>Material You 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
