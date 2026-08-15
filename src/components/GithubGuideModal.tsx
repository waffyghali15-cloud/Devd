import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Package, 
  Github,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface GithubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export const GithubGuideModal: React.FC<GithubGuideModalProps> = ({ isOpen, onClose, onDownloadZip }) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string>('android-calculator');
  const [githubUser, setGithubUser] = useState<string>('YOUR_USERNAME');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitCommandString = `git init
git add .
git commit -m "Initial commit: Android Material 3 Calculator"
git branch -M main
git remote add origin https://github.com/${githubUser}/${repoName}.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 md:p-8 my-8 text-neutral-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Github className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">دليل الرفع على GitHub وبناء APK تلقائياً</h2>
            <p className="text-xs text-neutral-400">
              خطوات سريعة لرفع المشروع على حسابك والحصول على ملف APK جاهز للتثبيت على أي هاتف أندرويد
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {/* Step 1: Download & Extract */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="flex items-center gap-2.5 mb-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">1</span>
              <span>تنزيل وفك ضغط ملفات المشروع</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              قم بتنزيل حزمة المشروع الكاملة المجهزة مسبقاً بجميع ملفات التكوين والكود المصدري وسير عمل GitHub Actions.
            </p>
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل ملفات المشروع (ZIP)</span>
            </button>
          </div>

          {/* Step 2: Create Repo on GitHub */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="flex items-center gap-2.5 mb-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">2</span>
              <span>إنشاء مستودع جديد على GitHub</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              ادخل على حسابك في GitHub وأنشئ مستودعاً جديداً فارغاً (New Repository) بدون إضافة README أو .gitignore (لأنها متوفرة بالفعل في المشروع).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">اسم المستخدم (GitHub Username):</label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono"
                  placeholder="YOUR_USERNAME"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">اسم المستودع (Repo Name):</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono"
                  placeholder="android-calculator"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Run Git Commands */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">3</span>
                <span>رفع الكود عبر سطر الأوامر (Git Terminal)</span>
              </div>
              <button
                onClick={() => copyToClipboard(gitCommandString, 'git-all')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
              >
                {copiedStep === 'git-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep === 'git-all' ? 'تم النسخ' : 'نسخ الأوامر'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-400 mb-2">
              افتح موجه الأوامر (Terminal) داخل مجلد المشروع المستخرج وشغّل هذه الأوامر بالترتيب:
            </p>
            <div className="p-3 rounded-xl bg-black border border-neutral-800 font-mono text-xs text-emerald-400 dir-ltr text-left overflow-x-auto">
              <pre>{gitCommandString}</pre>
            </div>
          </div>

          {/* Step 4: Download the APK from GitHub Actions */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
            <div className="flex items-center gap-2.5 mb-2 font-bold text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>الخطوة 4: تحميل ملف APK النهائي من تبويب Actions</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              بمجرد تنفيذ أمر <code className="px-1 py-0.5 rounded bg-black font-mono text-emerald-400">git push</code>، سيبدأ سير العمل في ملف <code className="px-1 py-0.5 rounded bg-black font-mono text-emerald-400">.github/workflows/build.yml</code> بالعمل فوراً على خوادم GitHub المجانية.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <p>1. افتح صفحة المستودع واضغط على تبويب <strong>Actions</strong>.</p>
              <p>2. ستجد تشغيل المهمة باسم <strong>Build & Assemble APK</strong> قيد التنفيذ (باللون الأصفر ثم الأخضر عند الانتهاء).</p>
              <p>3. اضغط على تشغيل الـ Workflow ومرر لأسفل الصفحة لقسم <strong>Artifacts</strong>.</p>
              <p>4. ستجد ملف <strong>Android-Calculator-APK</strong> جاهزاً للتنزيل والتثبيت مباشرة على أي هاتف أندرويد!</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all"
          >
            فهمت، إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
