
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, StudySession } from './types';
import { generateStudyContent, generateAppIcon } from './services/gemini';
import { Loading } from './components/Loading';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { Upload, BrainCircuit, FileText, Sparkles, ChevronRight, AlertCircle, Sun, Moon, X, Info, GraduationCap, Zap, MousePointer2, Heart, ExternalLink, Phone, Mail } from 'lucide-react';

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

  // Onboarding state
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedTutorial') !== 'true';
  });
  const [tutorialStep, setTutorialStep] = useState(0);

  // Handle app icon generation on initial load
  useEffect(() => {
    if (!appIcon) {
      const fetchIcon = async () => {
        const icon = await generateAppIcon();
        if (icon) {
          setAppIcon(icon);
          localStorage.setItem('appIcon', icon);
        }
      };
      fetchIcon();
    }
  }, [appIcon]);

  // Handle dark mode class application
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
      setError("The file you selected is not a PDF. Please upload a document ending in .pdf.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("This file is too large (over 20MB). Please try a smaller PDF for faster processing.");
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
          setError(err.message || "We encountered an issue while analyzing your document.");
          setState(AppState.IDLE);
        }
      };
      reader.onerror = () => {
        setError("Failed to read the file from your device. Check your file permissions.");
        setState(AppState.IDLE);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An unexpected system error occurred. Please refresh and try again.");
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

  const SupportModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 p-6">
          <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400">
            <Heart size={32} fill="currentColor" fillOpacity={0.2} />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Support the Project</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            US College AI is built to help students succeed. If you find it useful, your support helps keep the project alive!
          </p>

          <div className="w-full space-y-3">
            {/* Donation Card */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                  <Phone size={14} />
                </div>
                <span className="font-bold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Donate via FIB</span>
              </div>
              <code className="text-lg font-black text-indigo-950 dark:text-indigo-100 tracking-wider">07509712149</code>
            </div>

            {/* Email Contact */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Mail size={14} />
                </div>
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Contact & Feedback</span>
              </div>
              <a href="mailto:ahmadosmanr3@gmail.com" className="text-sm font-medium text-emerald-950 dark:text-emerald-100 hover:underline break-all">
                ahmadosmanr3@gmail.com
              </a>
            </div>

            {/* TikTok Link */}
            <a 
              href="https://www.tiktok.com/@ahmadteachestech?is_from_webapp=1&sender_device=pc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              Follow on TikTok
              <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <button 
            onClick={() => setShowSupportModal(false)}
            className="mt-6 text-sm font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );

  const OnboardingTutorial = () => {
    const steps = [
      {
        icon: <GraduationCap className="text-indigo-600" size={32} />,
        title: "Welcome to US College AI",
        description: "Your ultimate study companion. We use cutting-edge AI to transform your static PDF notes into dynamic learning experiences."
      },
      {
        icon: <Zap className="text-amber-500" size={32} />,
        title: "Instant Study Material",
        description: "Our AI extracts key definitions for flashcards and generates comprehensive quizzes to test your mastery automatically."
      },
      {
        icon: <MousePointer2 className="text-emerald-500" size={32} />,
        title: "Ready to start?",
        description: "Simply drag and drop your PDF textbook or lecture notes into the designated area below to begin your session."
      }
    ];

    const step = steps[tutorialStep];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 right-0 p-6">
            <button onClick={completeTutorial} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {step.description}
            </p>

            <div className="flex items-center gap-2 mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === tutorialStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => tutorialStep < steps.length - 1 ? setTutorialStep(s => s + 1) : completeTutorial()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              {tutorialStep === steps.length - 1 ? "Let's Go!" : "Next Step"}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ErrorDisplay = ({ message, onDismiss }: { message: string, onDismiss: () => void }) => (
    <div className="mt-8 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={onDismiss}
            className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 transition-colors"
            aria-label="Dismiss error"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">Upload Issue</h3>
            <p className="text-rose-700 dark:text-rose-300 text-sm leading-relaxed mb-4">
              {message}
            </p>
            
            <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/30">
              <div className="flex items-center gap-2 mb-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Info size={14} />
                <span>Troubleshooting Tips</span>
              </div>
              <ul className="text-xs text-rose-600/80 dark:text-rose-400/80 space-y-1 list-disc list-inside">
                <li>Ensure the PDF is not password-protected.</li>
                <li>Check your internet connection stability.</li>
                <li>Try a PDF with more text-based content.</li>
                <li>Max file size allowed is 20MB.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (state) {
      case AppState.PROCESSING: return <Loading />;
      case AppState.FLASHCARDS: return session ? <FlashcardView cards={session.flashcards} onBack={() => setState(AppState.DASHBOARD)} /> : null;
      case AppState.QUIZ: return session ? <QuizView questions={session.quiz} onBack={() => setState(AppState.DASHBOARD)} /> : null;
      case AppState.DASHBOARD: return session ? (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
          <header className="mb-12 text-center md:text-left">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4 leading-tight">
              Study Plan: <span className="text-indigo-600 dark:text-indigo-400">{session.topic}</span>
            </h1>
          </header>
          <div className="grid md:grid-cols-2 gap-8">
            <button onClick={() => setState(AppState.FLASHCARDS)} className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Flashcards</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Active recall practice for definitions and core concepts.</p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold">Start Learning <ChevronRight size={18} /></div>
            </button>
            <button onClick={() => setState(AppState.QUIZ)} className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Mode</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Test your knowledge with an AI-generated assessment.</p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">Take Quiz <ChevronRight size={18} /></div>
            </button>
          </div>
          <button onClick={reset} className="mt-12 block mx-auto text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">Upload a different document</button>
        </div>
      ) : null;
      default: return (
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-sm mb-6 animate-pulse"><Sparkles size={16} /> Powered by Gemini 3</div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Turn Notes into <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Knowledge.</span></h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Upload your PDF and get interactive learning materials in seconds.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-400 transition-all group relative">
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl overflow-hidden ring-4 ring-indigo-50 dark:ring-slate-700">
                {appIcon ? (
                  <img src={appIcon} alt="US COLLEGE AI" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={32} />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Drop your PDF here</h2>
              <p className="text-gray-500 dark:text-gray-400">PDF documents up to 20MB</p>
            </div>
          </div>
          
          {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {showTutorial && <OnboardingTutorial />}
      {showSupportModal && <SupportModal />}
      
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 overflow-hidden">
            {appIcon ? (
              <img src={appIcon} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              "U"
            )}
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">US COLLEGE AI</span>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:ring-2 hover:ring-indigo-500/50 transition-all" aria-label="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setShowSupportModal(true)}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all"
          >
            <Heart size={16} />
            Support Me
          </button>
        </div>
      </nav>
      <main className="pb-20">{renderContent()}</main>
    </div>
  );
};

export default App;