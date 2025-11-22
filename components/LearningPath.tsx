
import React, { useState, useEffect } from 'react';
import { Sparkles, Book, CheckCircle2, Loader2, Play, Lock, ChevronLeft, Terminal, HelpCircle, Award, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Difficulty, LearningPath as LearningPathType, ModuleContent } from '../types';
import { generateLearningPath, generateModuleContent } from '../services/geminiService';
import { useAppState } from '../context/StateContext';
import { useLocation } from 'react-router-dom';

const LearningPath: React.FC = () => {
  const location = useLocation();
  const { activePath, setPath, updateModuleStatus, saveModuleContent, addXP } = useAppState();
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [loading, setLoading] = useState(false);
  
  // Lesson View State
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
      "Analyzing topic...",
      "Drafting tutorial content...",
      "Generating code examples...",
      "Creating knowledge check...",
      "Finalizing lesson..."
  ];

  useEffect(() => {
    if (location.state?.topic && !activePath) {
        setTopic(location.state.topic);
    }
  }, [location, activePath]);

  // Cycle loading messages
  useEffect(() => {
      let interval: any;
      if (contentLoading) {
          setLoadingStep(0);
          interval = setInterval(() => {
              setLoadingStep(prev => (prev + 1) % loadingMessages.length);
          }, 2000);
      }
      return () => clearInterval(interval);
  }, [contentLoading]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
             // Simulation for demo without key
             await new Promise(r => setTimeout(r, 2000));
             alert("Please check your API key configuration.");
        } else {
            const newPath = await generateLearningPath(topic, difficulty);
            if (newPath) {
                // Initialize status
                newPath.modules = newPath.modules.map((m, i) => ({
                    ...m,
                    status: i === 0 ? 'active' : 'locked'
                }));
                setPath(newPath);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const openModule = async (index: number) => {
      const module = activePath?.modules[index];
      if (!module || module.status === 'locked' || !activePath) return;

      setActiveModuleIndex(index);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
      setContentError(null);

      // If content missing, generate it
      if (!module.content) {
          setContentLoading(true);
          try {
             const content = await generateModuleContent(activePath.topic, module.title, activePath.difficulty);
             if (content) {
                 saveModuleContent(index, content);
             } else {
                 setContentError("Could not generate content. Please check your API key or internet connection.");
             }
          } catch(e) {
              console.error(e);
              setContentError("An unexpected error occurred during generation.");
          } finally {
              setContentLoading(false);
          }
      }
  };

  const handleCompleteModule = () => {
      if (activeModuleIndex === null) return;
      updateModuleStatus(activeModuleIndex, 'completed');
      setActiveModuleIndex(null); // Return to list
  };

  // --- Render: Create Path View ---
  if (!activePath) {
      return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600/20 rounded-xl mb-4 text-indigo-400">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Create Your Learning Path</h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Tell us what you want to master. Our AI will craft a personalized curriculum, breaking down complex topics into digestible modules.
                </p>
            </div>

            <div className="w-full max-w-lg bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">What do you want to learn?</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Generative Adversarial Networks, React, Quantum Computing..."
                            className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[Difficulty.Beginner, Difficulty.Intermediate, Difficulty.Advanced].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                                        difficulty === level 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Curriculum...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Path
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- Render: Lesson View ---
  if (activeModuleIndex !== null) {
      const module = activePath.modules[activeModuleIndex];
      const content = module.content;

      if (contentLoading) {
          return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                  <div className="relative mb-6">
                      <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                      <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 transition-all duration-300">{loadingMessages[loadingStep]}</h3>
                  <p className="text-slate-400">Writing custom content for "{module.title}"</p>
              </div>
          );
      }

      if (contentError || !content) {
          return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in max-w-md mx-auto text-center">
                  <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-4">
                      <AlertCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                  <p className="text-slate-400 mb-6">{contentError || "Content could not be loaded."}</p>
                  <div className="flex gap-4">
                      <button 
                          onClick={() => setActiveModuleIndex(null)}
                          className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                          Go Back
                      </button>
                      <button 
                          onClick={() => openModule(activeModuleIndex)}
                          className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2"
                      >
                          <RefreshCw className="w-4 h-4" /> Try Again
                      </button>
                  </div>
              </div>
          );
      }

      return (
          <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in pb-20">
              <button 
                onClick={() => setActiveModuleIndex(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
              >
                  <ChevronLeft className="w-4 h-4" /> Back to Curriculum
              </button>

              <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
                              Module {activeModuleIndex + 1}
                          </span>
                          <span className="text-slate-500 text-sm flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" /> {module.estimatedHours} min read
                          </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{module.title}</h1>
                      <p className="text-lg text-slate-300 leading-relaxed border-l-4 border-indigo-500 pl-4">{content.overview}</p>
                  </div>

                  <div className="p-8 space-y-12 bg-slate-900/20">
                      {/* Sections */}
                      {content.sections.map((section, idx) => (
                          <div key={idx} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-sm text-indigo-400 font-bold">
                                      {idx + 1}
                                  </span>
                                  {section.title}
                              </h2>
                              <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed bg-slate-800/20 p-6 rounded-xl border border-slate-800">
                                  {section.content.split('\n').map((p, i) => (
                                      <p key={i} className="mb-4 last:mb-0">{p}</p>
                                  ))}
                              </div>
                          </div>
                      ))}

                      {/* Code Example */}
                      {content.codeExample && (
                          <div className="bg-[#0d1117] border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-slide-up delay-200">
                              <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                                  <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                                      <Terminal className="w-4 h-4 text-indigo-400" />
                                      {content.codeExample.language}
                                  </div>
                                  <div className="flex gap-1.5">
                                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                  </div>
                              </div>
                              <div className="p-6 overflow-x-auto">
                                  <pre className="font-mono text-sm text-slate-300 leading-relaxed">
                                      <code>{content.codeExample.code}</code>
                                  </pre>
                              </div>
                              <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 text-sm text-slate-400 italic flex items-start gap-2">
                                  <span className="shrink-0">💡</span>
                                  <span>{content.codeExample.explanation}</span>
                              </div>
                          </div>
                      )}

                      {/* Quiz Section */}
                      {content.quiz && (
                          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 md:p-8 animate-slide-up delay-300">
                              <div className="flex items-center gap-3 mb-6">
                                  <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                                      <HelpCircle className="w-6 h-6 text-white" />
                                  </div>
                                  <h3 className="text-xl font-bold text-white">Knowledge Check</h3>
                              </div>
                              
                              <p className="text-lg text-white mb-6 font-medium">{content.quiz.question}</p>
                              
                              <div className="grid gap-3 mb-6">
                                  {content.quiz.options.map((option, idx) => {
                                      let btnClass = "bg-slate-800 border-slate-700 hover:border-indigo-500 text-slate-300";
                                      if (quizSubmitted) {
                                          if (idx === content.quiz?.correctAnswer) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-100 font-medium";
                                          else if (idx === quizSelectedOption) btnClass = "bg-red-500/20 border-red-500 text-red-100";
                                          else btnClass = "bg-slate-800 border-slate-700 text-slate-500 opacity-50";
                                      } else if (idx === quizSelectedOption) {
                                          btnClass = "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20";
                                      }

                                      return (
                                          <button
                                              key={idx}
                                              onClick={() => !quizSubmitted && setQuizSelectedOption(idx)}
                                              className={`w-full text-left p-4 rounded-xl border transition-all ${btnClass}`}
                                              disabled={quizSubmitted}
                                          >
                                              {option}
                                          </button>
                                      );
                                  })}
                              </div>

                              {!quizSubmitted ? (
                                  <button
                                      onClick={() => setQuizSubmitted(true)}
                                      disabled={quizSelectedOption === null}
                                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                      Submit Answer
                                  </button>
                              ) : (
                                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                      quizSelectedOption === content.quiz.correctAnswer 
                                      ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-200' 
                                      : 'bg-red-900/20 border-red-500/50 text-red-200'
                                  }`}>
                                      {quizSelectedOption === content.quiz.correctAnswer 
                                        ? <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        : <AlertCircle className="w-5 h-5 shrink-0" />
                                      }
                                      <div>
                                          <p className="font-bold mb-1">
                                              {quizSelectedOption === content.quiz.correctAnswer ? 'Correct!' : 'Incorrect'}
                                          </p>
                                          <p className="text-sm opacity-90">{content.quiz.explanation}</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-between items-center sticky bottom-0 z-10">
                      <div className="text-slate-400 text-sm hidden md:block">
                          Module {activeModuleIndex + 1} of {activePath.modules.length}
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                           <button 
                                onClick={() => setActiveModuleIndex(null)}
                                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                           >
                               Close
                           </button>
                           <button 
                                onClick={handleCompleteModule}
                                className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                           >
                               <CheckCircle2 className="w-5 h-5" />
                               Mark Complete
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- Render: Path Overview ---
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{activePath.topic}</h1>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase rounded-full border border-indigo-500/30">
                    {activePath.difficulty}
                </span>
            </div>
            <p className="text-slate-400">Your personalized curriculum. Complete modules to earn XP and unlock new topics.</p>
        </div>
        <button 
            onClick={() => { if(confirm('Generate a new path? Current progress will be lost.')) setPath(null as any); }}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors"
        >
            Abandon Path
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            {activePath.modules.map((module, idx) => (
                <div 
                    key={idx} 
                    className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                        module.status === 'active' 
                            ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-900/20 ring-1 ring-indigo-500/50' 
                        : module.status === 'completed'
                            ? 'bg-slate-800/50 border-emerald-500/30'
                            : 'bg-slate-900/50 border-slate-800 opacity-75'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                            module.status === 'completed' ? 'bg-emerald-500 border-emerald-400 text-white' :
                            module.status === 'active' ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse-subtle' :
                            'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                            {module.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                             module.status === 'active' ? <Play className="w-4 h-4 ml-0.5" /> : 
                             <Lock className="w-4 h-4" />}
                        </div>
                        
                        <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-2 ${module.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                                {module.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{module.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {module.topics.slice(0, 3).map(t => (
                                    <span key={t} className="text-xs px-2 py-1 bg-slate-900 rounded border border-slate-700 text-slate-500">
                                        {t}
                                    </span>
                                ))}
                                <span className="text-xs px-2 py-1 text-slate-500 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" /> {module.estimatedHours} min
                                </span>
                            </div>

                            {module.status !== 'locked' && (
                                <button 
                                    onClick={() => openModule(idx)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                                        module.status === 'completed'
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 hover:translate-x-1'
                                    }`}
                                >
                                    {module.status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Path Progress</h3>
                        <p className="text-xs text-slate-400">Keep going to earn badges!</p>
                    </div>
                </div>
                
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">Completion</span>
                    <span className="text-white font-bold">
                        {Math.round((activePath.modules.filter(m => m.status === 'completed').length / activePath.modules.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-1000"
                        style={{ width: `${(activePath.modules.filter(m => m.status === 'completed').length / activePath.modules.length) * 100}%` }}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Modules Completed: <span className="text-white">{activePath.modules.filter(m => m.status === 'completed').length}</span>/{activePath.modules.length}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                        <span>Modules Remaining: <span className="text-white">{activePath.modules.filter(m => m.status !== 'completed').length}</span></span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default LearningPath;
