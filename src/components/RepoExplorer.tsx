import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FolderTree, 
  Terminal, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Workflow,
  Settings,
  BookOpen
} from 'lucide-react';
import { RepoFile, ProjectType } from '../types';
import { ANDROID_KOTLIN_FILES } from '../data/androidKotlinProject';
import { FLUTTER_FILES } from '../data/flutterProject';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

interface RepoExplorerProps {
  initialProjectType?: ProjectType;
}

export const RepoExplorer: React.FC<RepoExplorerProps> = ({ initialProjectType = 'kotlin' }) => {
  const [projectType, setProjectType] = useState<ProjectType>(initialProjectType);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('.github/workflows/build.yml');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const files = useMemo(() => {
    return projectType === 'kotlin' ? ANDROID_KOTLIN_FILES : FLUTTER_FILES;
  }, [projectType]);

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [files, searchQuery, selectedCategory]);

  const selectedFile = useMemo(() => {
    return files.find((f) => f.path === selectedFilePath) || files[0];
  }, [files, selectedFilePath]);

  const copyCode = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const downloadProjectZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = projectType === 'kotlin' ? 'android-material3-calculator-repo.zip' : 'flutter-material3-calculator-repo.zip';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workflow': return <Workflow className="w-4 h-4 text-emerald-400" />;
      case 'config': return <Settings className="w-4 h-4 text-amber-400" />;
      case 'doc': return <BookOpen className="w-4 h-4 text-sky-400" />;
      default: return <FileCode className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div id="repo-explorer" className="w-full flex flex-col gap-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>مستودع الكود المصدري الكامل</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% جاهز للبناء
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              جميع الملفات مكتوبة بالكامل بدون اختصارات أو تعليقات ناقصة، وجاهزة للتجميع عبر GitHub Actions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Framework Switcher */}
          <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
            <button
              onClick={() => {
                setProjectType('kotlin');
                setSelectedFilePath('.github/workflows/build.yml');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                projectType === 'kotlin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Kotlin (Jetpack Compose)
            </button>
            <button
              onClick={() => {
                setProjectType('flutter');
                setSelectedFilePath('.github/workflows/build.yml');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                projectType === 'flutter'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Flutter (Dart)
            </button>
          </div>

          {/* Download Complete ZIP Button */}
          <button
            id="btn-download-zip"
            onClick={downloadProjectZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'جارٍ تجميع الملفات...' : 'تنزيل المشروع كاملاً (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: File Tree on left + Code Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Tree Navigation (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في ملفات المشروع..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 pb-1 border-b border-neutral-800 text-[11px]">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'workflow', label: 'GitHub CI' },
              { id: 'source', label: 'الكود (Source)' },
              { id: 'config', label: 'الإعدادات (Gradle)' },
              { id: 'doc', label: 'README' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="flex flex-col gap-1.5 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredFiles.map((file) => {
              const isSelected = selectedFilePath === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-2xl text-right transition-all border ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/40 text-white'
                      : 'bg-neutral-950/40 hover:bg-neutral-800/60 border-neutral-800/60 text-neutral-300'
                  }`}
                >
                  <div className="mt-0.5">{getCategoryIcon(file.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold font-mono truncate dir-ltr text-left block w-full">
                        {file.path}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active File Code Viewer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl">
          {/* File Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-neutral-900/80 border-b border-neutral-800">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-white dir-ltr truncate">
                {selectedFile.path}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 uppercase font-mono">
                {selectedFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-file-content"
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="نسخ محتوى الملف بالكامل"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'تم النسخ بنجاح!' : 'نسخ الكود'}</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="px-5 py-2 bg-neutral-900/40 border-b border-neutral-800/60 text-xs text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{selectedFile.description}</span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="relative overflow-x-auto max-h-[550px] p-4 text-xs font-mono bg-neutral-950 scrollbar-thin dir-ltr text-left">
            <pre className="text-neutral-200 leading-relaxed tab-4 whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
