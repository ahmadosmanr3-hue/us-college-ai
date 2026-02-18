import React, { useState, useCallback, useEffect } from 'react';
import { AppState, StudySession } from './types';
import { generateStudyContent, generateAppIcon } from './services/gemini';
import { Loading } from './components/Loading';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { 
  Upload, BrainCircuit, FileText, Sparkles, ChevronRight, AlertCircle, 
  Sun, Moon, X, Heart, ExternalLink, Phone, 
  Mail, Quote, Target, Zap, GraduationCap 
} from 'lucide-react';

// Rebuilt Support Modal for perfect mobile scrolling
const SupportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
      
      {/* Fixed Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Heart size={20} fill="currentColor" fillOpacity={0.2} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">The Vision & Aim</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 shrink-0"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
        
        {/* Main Aim Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Our Purpose</h4>
          </div>
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 relative">
            <Quote className="absolute -top-3 -left-1 text-indigo-200 dark:text-indigo-800 opacity-40" size={40} />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-sm sm:text-base relative z-10">
              "My main aim with <strong>US College AI</strong> is to simplify education. I'm Ahmad Osman, and I believe students shouldn't spend all their time just 'reading'—they should be 'learning' and 'testing'. This tool turns static PDFs into active challenges. My goal is to help every student achieve their highest potential through smarter study habits."
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/40 text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">— Ahmad Osman</span>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">Support Development</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Developing and hosting AI features is expensive. If this project helps you, consider a small donation to keep the servers running.
          </p>
          
          <div className="space-y-4">
            {/* FIB Transfer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-indigo-500 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                  <Phone size={14} />
                </div>
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Donate via FIB (Iraq)</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <code className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wider">07509712149</code>
                <span className="hidden xs:block text-[10px] font-bold py-1 px-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full uppercase shrink-0">Fast Transfer</span>
              </div>
            </div>

            {/* Email Contact */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Mail size={14} />
                </div>
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Questions & Feedback</span>
              </div>
              <a href="mailto:ahmadosmanr3@gmail.com" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all block">
                ahmadosmanr3@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* Social Link */}
        <section className="pb-4">
          <a 
            href="https://www.tiktok.com/@ahmadteachestech?is_from_webapp=1&sender_device=pc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            Follow on TikTok
            <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        </section>
      </div>
      
      {/* Fixed Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 shrink-0">
        <button 
          onClick={onClose}
          className="w-full py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [session, setSession] = useState<StudySession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appIcon, setAppIcon] = useState<string | null>(localStorage.getItem('appIcon'));
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedTutorial') !== 'true';
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state]);

  useEffect(() => {
    if (!appIcon) {
      const fetchIcon = async () => {
        try {
          const icon = await generateAppIcon();
          if (icon) {
            setAppIcon(icon);
            localStorage.setItem('appIcon', icon);
          }
        } catch (e) {
          console.error("AI Icon generation failed", e);
        }
      };
      fetchIcon();
    }
  }, [appIcon]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a PDF file.");
      return;
    }

    setError(null);
    setState(AppState.PROCESSING);
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const content = await generateStudyContent(base64);
          setSession(content);
          setState(AppState.DASHBOARD);
        } catch (err: any) {
          setError(err.message || "Could not analyze the document.");
          setState(AppState.IDLE);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An error occurred during upload.");
      setState(AppState.IDLE);
    }
  }, []);

  const reset = () => {
    setState(AppState.IDLE);
    setSession(null);
    setError(null);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasCompletedTutorial', 'true');
  };

  const renderContent = () => {
    switch (state) {
      case AppState.PROCESSING: return <Loading />;
      case AppState.FLASHCARDS: return session ? <FlashcardView cards={session.flashcards} onBack={() => setState(AppState.DASHBOARD)} /> : null;
      case AppState.QUIZ: return session ? <QuizView questions={session.quiz} onBack={() => setState(AppState.DASHBOARD)} /> : null;
      case AppState.DASHBOARD: return session ? (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
          <header className="mb-12 text-center md:text-left">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider">Analysis Complete</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 leading-tight">
              Study Plan: <span className="text-indigo-600 dark:text-indigo-400">{session.topic}</span>
            </h1>
          </header>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <button onClick={() => setState(AppState.FLASHCARDS)} className="group bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shrink-0">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Flashcards</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Master definitions and core concepts through repetition.</p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">Start Learning <ChevronRight size={18} /></div>
            </button>
            <button onClick={() => setState(AppState.QUIZ)} className="group bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shrink-0">
                <FileText size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Test your retention with AI-generated assessments.</p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">Take Quiz <ChevronRight size={18} /></div>
            </button>
          </div>
          <button onClick={reset} className="mt-12 block mx-auto text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-medium uppercase tracking-widest">Upload new notes</button>
        </div>
      ) : null;
      default: return (
        <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-[10px] sm:text-xs mb-6 animate-pulse uppercase tracking-widest"><Sparkles size={14} /> AI Powered Learning</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Turn Notes into <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Knowledge.</span></h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">The smartest way to study. Upload any PDF and let our AI create the perfect study guide for you instantly.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-400 transition-all group relative">
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-600 text-white rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center mb-6 shadow-2xl overflow-hidden ring-4 ring-indigo-50 dark:ring-slate-700 transition-transform group-hover:scale-110">
                {appIcon ? (
                  <img src={appIcon} alt="US COLLEGE AI" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={32} />
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Drop your PDF here</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documents up to 20MB supported</p>
            </div>
          </div>
          
          {error && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 flex gap-4 items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center text-rose-600"><AlertCircle size={20} /></div>
                <p className="text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600"><X size={20} /></button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 overflow-x-hidden">
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-300">
            <button onClick={completeTutorial} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Welcome to the Future</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">We transform your static notes into dynamic learning tools. Simple, fast, and powerful.</p>
              <button onClick={completeTutorial} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">Start Studying</button>
            </div>
          </div>
        </div>
      )}
      
      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}
      
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink" onClick={reset}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-indigo-500/20 overflow-hidden shrink-0">
            {appIcon ? <img src={appIcon} alt="Logo" className="w-full h-full object-cover" /> : "U"}
          </div>
          {/* Logo text hides on very small screens to make room for the Support button */}
          <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden min-[480px]:block truncate">US COLLEGE AI</span>
        </div>
        
        <div className="flex gap-2 sm:gap-3 items-center shrink-0 ml-auto">
          <button onClick={toggleDarkMode} className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:ring-2 hover:ring-indigo-500/50 transition-all shrink-0">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={() => setShowSupportModal(true)} 
            className="flex items-center gap-2 bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-rose-700 transition-all active:scale-95 shrink-0"
          >
            <Heart size={14} fill="white" />
            <span className="hidden xs:inline">Support Me</span>
            <span className="xs:hidden">Support</span>
          </button>
        </div>
      </nav>
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="py-8 px-6 text-center border-t border-gray-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase tracking-widest font-bold shrink-0">
        <p>© 2024 US COLLEGE AI. Crafted by Ahmad Osman.</p>
      </footer>
    </div>
  );
};

export default App;