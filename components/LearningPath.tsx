
import React, { useState, useEffect } from 'react';
import { Sparkles, Book, CheckCircle2, Loader2, Play, Lock, ChevronLeft, Terminal, HelpCircle, Award, ArrowRight, RefreshCw, AlertCircle, Code2, CheckSquare, ThumbsUp, ThumbsDown, ClipboardList } from 'lucide-react';
import { Difficulty, LearningPath as LearningPathType, ModuleContent, AssignmentFeedback } from '../types';
import { generateLearningPath, generateModuleContent, evaluateAssignment } from '../services/geminiService';
import { useAppState } from '../context/StateContext';
import { useLocation } from 'react-router-dom';

const LearningPath: React.FC = () => {
  const location = useLocation();
  const { activePath, setPath, updateModuleStatus, saveModuleContent, addXP } = useAppState();
  
  // Creation State
  const [topic, setTopic] = useState('');
  const [techStack, setTechStack] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [loading, setLoading] = useState(false);
  
  // Lesson View State
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  
  // Assignment State
  const [assignmentSubmission, setAssignmentSubmission] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState<AssignmentFeedback | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number | null}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
      "Analyzing topic structure...",
      "Drafting tutorial content...",
      "Generating PyTorch/TensorFlow examples...",
      "Creating assignments...",
      "Finalizing lesson..."
  ];

  const commonTechStacks = ["PyTorch", "TensorFlow", "Scikit-Learn", "Keras", "OpenAI API", "LangChain", "Hugging Face"];

  useEffect(() => {
    if (location.state?.topic && !activePath) {
        setTopic(location.state.topic);
    }
  }, [location, activePath]);

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
        const newPath = await generateLearningPath(topic, difficulty, techStack);
        if (newPath) {
            newPath.modules = newPath.modules.map((m, i) => ({
                ...m,
                status: i === 0 ? 'active' : 'locked'
            }));
            setPath(newPath);
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
      setQuizAnswers({});
      setQuizSubmitted(false);
      setAssignmentSubmission('');
      setAssignmentFeedback(null);
      setContentError(null);

      if (!module.content) {
          setContentLoading(true);
          try {
             const content = await generateModuleContent(
                 activePath.topic, 
                 module.title, 
                 activePath.difficulty,
                 activePath.techStack
             );
             if (content) {
                 saveModuleContent(index, content);
             } else {
                 setContentError("Could not generate content.");
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
      setActiveModuleIndex(null);
  };

  const handleAssignmentSubmit = async () => {
      if (!assignmentSubmission.trim() || !activePath || activeModuleIndex === null) return;
      const module = activePath.modules[activeModuleIndex];
      if (!module.content?.assignment) return;

      setEvaluating(true);
      try {
          const feedback = await evaluateAssignment(
              module.content.assignment.title,
              module.content.assignment.requirements,
              assignmentSubmission
          );
          setAssignmentFeedback(feedback);
      } catch (e) {
          console.error(e);
      } finally {
          setEvaluating(false);
      }
  };

  const handleQuizSelect = (qIdx: number, oIdx: number) => {
      if (quizSubmitted) return;
      setQuizAnswers(prev => ({...prev, [qIdx]: oIdx}));
  };

  const calculateQuizScore = (quizzes: any[]) => {
      let correct = 0;
      quizzes.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correctAnswer) correct++;
      });
      return correct;
  };

  const getTotalHours = () => activePath ? activePath.modules.reduce((acc, m) => acc + (m.estimatedHours || 0), 0) : 0;
  
  const getRemainingHours = () => {
      if(!activePath) return 0;
      return activePath.modules
        .filter(m => m.status !== 'completed')
        .reduce((acc, m) => acc + (m.estimatedHours || 0), 0);
  }

  // --- Render: Create Path View ---
  if (!activePath) {
      return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-600/10 rounded-2xl mb-6 shadow-xl shadow-indigo-900/10">
                    <Sparkles className="w-10 h-10 text-indigo-500" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Create Your Learning Path</h1>
                <p className="text-slate-400 max-w-lg mx-auto text-lg">
                    Tell us what you want to master. Our AI will craft a personalized curriculum including tutorials, assignments, and quizzes.
                </p>
            </div>

            <div className="w-full max-w-xl bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Topic</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Reinforcement Learning, GANs..."
                            className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Tech Stack (Optional)</label>
                        <input 
                            type="text" 
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            placeholder="e.g. PyTorch, TensorFlow, JAX"
                            className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-3 transition-all placeholder:text-slate-600"
                        />
                        <div className="flex flex-wrap gap-2">
                            {commonTechStacks.map(ts => (
                                <button 
                                    key={ts}
                                    onClick={() => setTechStack(ts)}
                                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${techStack === ts ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'}`}
                                >
                                    {ts}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Experience Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[Difficulty.Beginner, Difficulty.Intermediate, Difficulty.Advanced].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-3 px-3 rounded-xl text-sm font-bold border transition-all ${
                                        difficulty === level 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 transform scale-105' 
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
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
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Designing Course...
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
                  <div className="relative mb-8">
                      <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
                      <div className="relative bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl">
                          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                      </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 transition-all duration-300">{loadingMessages[loadingStep]}</h3>
                  <p className="text-slate-400">Building custom curriculum for "{module.title}"</p>
              </div>
          );
      }

      if (contentError || !content) {
          return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in max-w-md mx-auto text-center">
                  <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-4 border border-red-500/20">
                      <AlertCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                  <p className="text-slate-400 mb-6">{contentError || "Content could not be loaded."}</p>
                  <button 
                      onClick={() => openModule(activeModuleIndex)}
                      className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2 mx-auto"
                  >
                      <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
              </div>
          );
      }

      return (
          <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in pb-20">
              <button 
                onClick={() => setActiveModuleIndex(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-medium"
              >
                  <ChevronLeft className="w-4 h-4" /> Back to Curriculum
              </button>

              <div className="bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="p-8 md:p-10 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
                              Module {activeModuleIndex + 1}
                          </span>
                          {activePath.techStack && (
                              <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">
                                  {activePath.techStack}
                              </span>
                          )}
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">{module.title}</h1>
                      <div className="text-lg text-slate-300 leading-relaxed border-l-4 border-indigo-500 pl-6 py-1">{content.overview}</div>
                  </div>

                  <div className="p-8 md:p-10 space-y-16 bg-slate-900/20">
                      {/* Sections */}
                      {content.sections.map((section, idx) => (
                          <div key={idx} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-lg text-indigo-400 font-bold shadow-lg">
                                      {idx + 1}
                                  </span>
                                  {section.title}
                              </h2>
                              <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed bg-slate-800/20 p-8 rounded-2xl border border-slate-800 shadow-inner">
                                  {section.content.split('\n').map((p, i) => (
                                      <p key={i} className="mb-4 last:mb-0">{p}</p>
                                  ))}
                              </div>
                          </div>
                      ))}

                      {/* Code Example */}
                      {content.codeExample && (
                          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-slide-up delay-200 ring-1 ring-white/5">
                              <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
                                  <div className="flex items-center gap-3 text-slate-300 font-mono text-sm font-bold">
                                      <Terminal className="w-5 h-5 text-indigo-400" />
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
                              <div className="px-6 py-4 bg-indigo-500/5 border-t border-slate-700 text-sm text-slate-400 flex items-start gap-3">
                                  <span className="shrink-0 mt-0.5">💡</span>
                                  <span className="italic">{content.codeExample.explanation}</span>
                              </div>
                          </div>
                      )}

                      {/* Practical Assignment with AI Feedback */}
                      {content.assignment && (
                          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 md:p-10 animate-slide-up delay-250 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Code2 className="w-40 h-40 text-indigo-500" />
                              </div>
                              <div className="flex items-center gap-4 mb-6 relative z-10">
                                  <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 shadow-lg shadow-indigo-900/20">
                                      <Code2 className="w-8 h-8" />
                                  </div>
                                  <div>
                                      <h3 className="text-2xl font-bold text-white">Practical Assignment</h3>
                                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-bold rounded border border-slate-700">
                                          {content.assignment.difficulty}
                                      </span>
                                  </div>
                              </div>
                              <div className="relative z-10">
                                  <h4 className="text-xl font-bold text-white mb-3">{content.assignment.title}</h4>
                                  <p className="text-slate-300 mb-8 text-lg">{content.assignment.description}</p>
                                  
                                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 mb-8 backdrop-blur-sm">
                                      <h5 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                                          <CheckSquare className="w-4 h-4" /> Requirements
                                      </h5>
                                      <ul className="space-y-3">
                                          {content.assignment.requirements.map((req, i) => (
                                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                                                  <span>{req}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>

                                  <div className="space-y-4">
                                      <label className="block text-sm font-bold text-slate-300 uppercase tracking-wide">Your Solution</label>
                                      <textarea 
                                          value={assignmentSubmission}
                                          onChange={(e) => setAssignmentSubmission(e.target.value)}
                                          placeholder="Paste your code or explanation here..."
                                          className="w-full h-56 bg-slate-950/80 font-mono text-sm text-slate-300 p-6 rounded-2xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-inner"
                                      />
                                      
                                      <div className="flex justify-end">
                                          <button 
                                            onClick={handleAssignmentSubmit}
                                            disabled={evaluating || !assignmentSubmission.trim()}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                                          >
                                              {evaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardList className="w-5 h-5" />}
                                              {evaluating ? 'Evaluating...' : 'Submit for Review'}
                                          </button>
                                      </div>
                                  </div>

                                  {assignmentFeedback && (
                                      <div className={`mt-8 p-8 rounded-2xl border ${
                                          assignmentFeedback.status === 'Pass' 
                                          ? 'bg-emerald-900/20 border-emerald-500/30' 
                                          : 'bg-orange-900/20 border-orange-500/30'
                                      } animate-fade-in`}>
                                          <div className="flex items-center gap-4 mb-4">
                                              <div className={`p-3 rounded-full ${
                                                  assignmentFeedback.status === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                              }`}>
                                                  {assignmentFeedback.status === 'Pass' ? <ThumbsUp className="w-6 h-6" /> : <ThumbsDown className="w-6 h-6" />}
                                              </div>
                                              <h3 className={`text-xl font-bold ${
                                                  assignmentFeedback.status === 'Pass' ? 'text-emerald-400' : 'text-orange-400'
                                              }`}>
                                                  {assignmentFeedback.status === 'Pass' ? 'Excellent Work!' : 'Needs Improvement'}
                                              </h3>
                                          </div>
                                          
                                          <p className="text-slate-300 mb-6 leading-relaxed">{assignmentFeedback.feedback}</p>
                                          
                                          <div className="grid md:grid-cols-2 gap-6">
                                              {assignmentFeedback.strengths.length > 0 && (
                                                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                                                      <h6 className="text-emerald-400 font-bold text-xs mb-3 uppercase tracking-wide">Strengths</h6>
                                                      <ul className="space-y-2 text-sm text-slate-400">
                                                          {assignmentFeedback.strengths.map((s, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> {s}</li>)}
                                                      </ul>
                                                  </div>
                                              )}
                                              {assignmentFeedback.improvements.length > 0 && (
                                                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                                                      <h6 className="text-orange-400 font-bold text-xs mb-3 uppercase tracking-wide">To Improve</h6>
                                                      <ul className="space-y-2 text-sm text-slate-400">
                                                          {assignmentFeedback.improvements.map((s, i) => <li key={i} className="flex gap-2"><AlertCircle className="w-4 h-4 text-orange-500 shrink-0"/> {s}</li>)}
                                                      </ul>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}

                      {/* Quiz Section */}
                      {content.quizzes && content.quizzes.length > 0 && (
                          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 md:p-10 animate-slide-up delay-300">
                              <div className="flex items-center gap-4 mb-8">
                                  <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
                                      <HelpCircle className="w-8 h-8" />
                                  </div>
                                  <div>
                                      <h3 className="text-2xl font-bold text-white">Knowledge Check</h3>
                                      <p className="text-slate-400 text-sm">Test your understanding of the concepts.</p>
                                  </div>
                              </div>
                              
                              <div className="space-y-10">
                                  {content.quizzes.map((quiz, qIdx) => (
                                      <div key={qIdx} className="border-b border-slate-700 pb-10 last:border-0 last:pb-0">
                                          <p className="text-xl text-white mb-6 font-medium leading-snug">
                                              <span className="text-slate-500 mr-3 text-lg font-bold">{qIdx + 1}.</span>
                                              {quiz.question}
                                          </p>
                                          <div className="grid gap-3">
                                              {quiz.options.map((option, oIdx) => {
                                                  const isSelected = quizAnswers[qIdx] === oIdx;
                                                  const isCorrect = quiz.correctAnswer === oIdx;
                                                  
                                                  let btnClass = "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750";
                                                  
                                                  if (quizSubmitted) {
                                                      if (isCorrect) btnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                                                      else if (isSelected) btnClass = "bg-red-500/10 border-red-500 text-red-400";
                                                      else btnClass = "opacity-50 bg-slate-800 border-slate-800";
                                                  } else if (isSelected) {
                                                      btnClass = "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20";
                                                  }

                                                  return (
                                                      <button
                                                          key={oIdx}
                                                          onClick={() => handleQuizSelect(qIdx, oIdx)}
                                                          disabled={quizSubmitted}
                                                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all ${btnClass}`}
                                                      >
                                                          {option}
                                                      </button>
                                                  );
                                              })}
                                          </div>
                                          {quizSubmitted && (
                                              <div className="mt-4 text-sm text-slate-300 bg-slate-900/80 p-5 rounded-xl border border-slate-700/50 flex gap-3 items-start">
                                                  <span className="shrink-0 mt-0.5">💡</span>
                                                  <span><span className="font-bold text-indigo-400">Explanation:</span> {quiz.explanation}</span>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>

                              <div className="mt-10 pt-8 border-t border-slate-700 flex items-center justify-between">
                                  {!quizSubmitted ? (
                                      <button
                                          onClick={() => setQuizSubmitted(true)}
                                          disabled={Object.keys(quizAnswers).length !== content.quizzes.length}
                                          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto shadow-lg shadow-indigo-900/20 text-lg"
                                      >
                                          Submit Quiz
                                      </button>
                                  ) : (
                                      <div className="flex items-center justify-between w-full bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                                          <div>
                                              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Your Score</p>
                                              <p className="text-3xl font-black text-white">
                                                  {calculateQuizScore(content.quizzes)} / {content.quizzes.length}
                                              </p>
                                          </div>
                                          {calculateQuizScore(content.quizzes) === content.quizzes.length && (
                                              <div className="flex items-center gap-3 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                                                  <Award className="w-6 h-6" />
                                                  Perfect Score!
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 md:p-8 border-t border-slate-700 bg-slate-800 flex justify-between items-center sticky bottom-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                      <div className="text-slate-400 text-sm hidden md:block font-medium">
                          Module {activeModuleIndex + 1} of {activePath.modules.length}
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                           <button 
                                onClick={() => setActiveModuleIndex(null)}
                                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                           >
                               Close
                           </button>
                           <button 
                                onClick={handleCompleteModule}
                                className="flex-1 md:flex-none px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tight">{activePath.topic}</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase rounded-full border border-indigo-500/30">
                        {activePath.difficulty}
                    </span>
                    {activePath.techStack && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase rounded-full border border-purple-500/30">
                            {activePath.techStack}
                        </span>
                    )}
                </div>
            </div>
            <p className="text-slate-400 text-lg">Your personalized curriculum. Complete modules to earn XP.</p>
        </div>
        <button 
            onClick={() => { if(confirm('Generate a new path? Current progress will be lost.')) setPath(null as any); }}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors font-medium underline decoration-slate-700 hover:decoration-red-400 underline-offset-4"
        >
            Abandon Path
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            {activePath.modules.map((module, idx) => (
                <div 
                    key={idx} 
                    className={`relative p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 group ${
                        module.status === 'active' 
                            ? 'bg-slate-800 border-indigo-500 shadow-xl shadow-indigo-900/20 z-10 scale-[1.02]' 
                        : module.status === 'completed'
                            ? 'bg-slate-800/50 border-emerald-500/30'
                            : 'bg-slate-900/50 border-slate-800/50 opacity-75'
                    }`}
                >
                    <div className="flex items-start gap-5">
                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            module.status === 'completed' ? 'bg-emerald-500 border-emerald-400 text-white' :
                            module.status === 'active' ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse-subtle' :
                            'bg-slate-800 border-slate-700 text-slate-600'
                        }`}>
                            {module.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                             module.status === 'active' ? <Play className="w-4 h-4 ml-0.5 fill-white" /> : 
                             <Lock className="w-4 h-4" />}
                        </div>
                        
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${module.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                                {module.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-5 leading-relaxed font-medium">{module.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-5">
                                {module.topics.slice(0, 3).map(t => (
                                    <span key={t} className="text-xs px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-slate-500 font-medium">
                                        {t}
                                    </span>
                                ))}
                                <span className="text-xs px-2.5 py-1 text-slate-500 flex items-center gap-1 font-medium bg-slate-900 rounded-lg border border-slate-700">
                                    <ClockIcon className="w-3 h-3" /> {module.estimatedHours}h
                                </span>
                            </div>

                            {module.status !== 'locked' && (
                                <button 
                                    onClick={() => openModule(idx)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
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
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sticky top-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl border border-yellow-500/20">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Path Progress</h3>
                        <p className="text-xs text-slate-400 font-medium">Keep going to earn badges!</p>
                    </div>
                </div>
                
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Completion</span>
                    <span className="text-white font-bold">
                        {Math.round((activePath.modules.filter(m => m.status === 'completed').length / activePath.modules.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 mb-8 overflow-hidden border border-slate-700/50">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                        style={{ width: `${(activePath.modules.filter(m => m.status === 'completed').length / activePath.modules.length) * 100}%` }}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Modules Done</span>
                        </div>
                        <span className="text-white font-bold">{activePath.modules.filter(m => m.status === 'completed').length}/{activePath.modules.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                             <ClockIcon className="w-5 h-5 text-blue-500" />
                             <span>Total Duration</span>
                        </div>
                        <span className="text-white font-bold">{getTotalHours()} hrs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                             <Play className="w-5 h-5 text-orange-500" />
                             <span>Remaining</span>
                        </div>
                        <span className="text-white font-bold">{getRemainingHours()} hrs</span>
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