import React, { useState } from 'react';
import { generateTopicOverview } from '../services/geminiService';
import { TopicNode } from '../types';
import { ArrowLeft, Network, Sparkles, ChevronRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ROOT_TOPICS = [
  'Machine Learning', 'Deep Learning', 'Natural Language Processing', 
  'Computer Vision', 'Robotics', 'Reinforcement Learning', 
  'Generative AI', 'AI Ethics & Safety', 'Data Science', 'Expert Systems'
];

const TopicExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [currentTopic, setCurrentTopic] = useState<TopicNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicNode[]>([]);

  const handleTopicClick = async (topicName: string) => {
    setLoading(true);
    setError(null);
    try {
        const node = await generateTopicOverview(topicName);
        if (node) {
            if (currentTopic) {
                setHistory([...history, currentTopic]);
            }
            setCurrentTopic(node);
        } else {
            setError("Unable to load topic details. Please check your API key configuration and internet connection.");
        }
    } catch (e) {
        console.error(e);
        setError("An unexpected error occurred while exploring the topic.");
    } finally {
        setLoading(false);
    }
  };

  const handleCreatePath = () => {
      if (currentTopic) {
          navigate('/app/path', { state: { topic: currentTopic.name } });
      } else {
          navigate('/app/path');
      }
  }

  const handleBreadcrumbClick = (index: number) => {
      const nodeToRestore = history[index];
      const newHistory = history.slice(0, index);
      setHistory(newHistory);
      setCurrentTopic(nodeToRestore);
  };

  const resetExplorer = () => {
      setCurrentTopic(null);
      setHistory([]);
      setError(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Network className="text-indigo-500" />
            AI Topic Explorer
        </h1>
        <p className="text-slate-400 mt-2">
            Navigate the vast landscape of Artificial Intelligence. Click on any topic to explore deeper using Gemini.
        </p>
      </div>

      {/* Enhanced Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm bg-slate-800/30 p-2 rounded-xl border border-slate-700/50">
        <button 
            onClick={resetExplorer}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                !currentTopic 
                    ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
        >
            <Network className="w-4 h-4" />
            <span>Universe</span>
        </button>
        
        {history.map((node, i) => (
            <React.Fragment key={i}>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <button 
                    onClick={() => handleBreadcrumbClick(i)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 truncate max-w-[150px]"
                    title={node.name}
                >
                    {node.name}
                </button>
            </React.Fragment>
        ))}

        {currentTopic && (
            <>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium truncate max-w-[200px]" title={currentTopic.name}>
                    {currentTopic.name}
                </span>
            </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-2xl p-8 relative overflow-hidden flex flex-col shadow-inner">
        
        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 bg-slate-900/80 z-20 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-indigo-300 animate-pulse">Consulting the Neural Net...</p>
                </div>
            </div>
        )}

        {/* Error Overlay */}
        {error && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
                <div className="bg-slate-800 border border-red-500/50 rounded-xl p-6 max-w-md text-center shadow-2xl">
                    <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-400">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Exploration Failed</h3>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        )}

        {!currentTopic ? (
            // Root View
            <div className="animate-fade-in h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Major Disciplines</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                    {ROOT_TOPICS.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => handleTopicClick(topic)}
                            className="p-6 bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 rounded-xl text-left transition-all group relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-900/20"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">{topic}</h3>
                            <div className="flex items-center gap-2 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                Explore <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            // Detail View
            <div className="animate-slide-up h-full flex flex-col">
                <div className="mb-8 flex-shrink-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-4">{currentTopic.name}</h2>
                            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                                {currentTopic.description}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={handleCreatePath}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/30 hover:scale-105"
                            >
                                <BookOpen className="w-5 h-5" /> 
                                <span>Start Learning Path</span>
                            </button>
                        </div>
                    </div>
                    
                    {currentTopic.relatedFields && currentTopic.relatedFields.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            <span className="text-sm text-slate-500 py-1">Related Fields:</span>
                            {currentTopic.relatedFields.map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => handleTopicClick(f)}
                                    className="text-xs px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 rounded-full border border-slate-600 transition-colors"
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 sticky top-0 bg-slate-800/95 backdrop-blur py-2 z-10">
                        <Network className="w-5 h-5 text-indigo-400" />
                        Subtopics & Branches
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {currentTopic.subtopics.map((sub, idx) => (
                             <button
                                key={idx}
                                onClick={() => handleTopicClick(sub)}
                                className="p-4 bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 rounded-xl text-left transition-all flex justify-between items-center group"
                            >
                                <span className="text-slate-200 group-hover:text-white font-medium">{sub}</span>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 opacity-50 group-hover:opacity-100 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TopicExplorer;