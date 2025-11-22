
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Bookmark, Download, Check } from 'lucide-react';
import { ResourceItem, ResourceType } from '../types';
import { generateResources } from '../services/geminiService';
import { useAppState } from '../context/StateContext';

const mockResources: ResourceItem[] = [
    { id: '1', title: 'Attention Is All You Need', author: 'Vaswani et al.', type: ResourceType.Paper, url: 'https://arxiv.org/abs/1706.03762', description: 'The seminal paper introducing the Transformer architecture.', tags: ['NLP', 'Deep Learning'] },
    { id: '2', title: 'Deep Learning Book', author: 'Ian Goodfellow', type: ResourceType.Book, url: 'https://www.deeplearningbook.org/', description: 'Comprehensive textbook on deep learning fundamentals.', tags: ['Theory', 'Math'] },
    { id: '3', title: 'Hugging Face Transformers', author: 'Hugging Face', type: ResourceType.Tool, url: 'https://huggingface.co/', description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.', tags: ['Library', 'NLP'] },
    { id: '4', title: 'Fast.ai Practical Deep Learning', author: 'Jeremy Howard', type: ResourceType.Course, url: 'https://course.fast.ai/', description: 'Top-down approach to deep learning for coders.', tags: ['Practical', 'PyTorch'] },
    { id: '5', title: 'YOLOv8 Documentation', author: 'Ultralytics', type: ResourceType.Tool, url: 'https://docs.ultralytics.com/', description: 'Real-time object detection framework.', tags: ['Vision', 'CNN'] },
];

const Resources: React.FC = () => {
  const { toggleBookmark, isBookmarked, bookmarks } = useAppState();
  const [resources, setResources] = useState<ResourceItem[]>(mockResources);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ResourceType | 'All' | 'Saved'>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAISearch = async () => {
    if (!search) return;
    setIsGenerating(true);
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Simulate result for demo
        } else {
            const newResources = await generateResources(search);
            if (newResources.length > 0) {
                // Add IDs if missing
                const readyResources = newResources.map((r, i) => ({ ...r, id: r.id || `gen-${Date.now()}-${i}` }));
                setResources(prev => [...readyResources, ...prev]);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const displayedResources = activeFilter === 'Saved' ? bookmarks : resources;

  const filteredResources = displayedResources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || activeFilter === 'Saved' || r.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resource Library</h1>
            <p className="text-slate-400">Curated papers, books, and tools for your journey.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleAISearch}
                disabled={isGenerating || !search}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
            >
                {isGenerating ? 'Searching...' : 'Ask AI to Find More'}
            </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input 
                type="text" 
                placeholder="Search titles, authors, or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Saved', ...Object.values(ResourceType)].map(type => (
                <button 
                    key={type}
                    onClick={() => setActiveFilter(type as ResourceType | 'All' | 'Saved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        activeFilter === type 
                        ? 'bg-white text-slate-900' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
            const saved = isBookmarked(resource.id);
            return (
                <div key={resource.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all group flex flex-col h-full hover:shadow-lg hover:shadow-indigo-900/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            resource.type === ResourceType.Paper ? 'bg-purple-500/10 text-purple-400' :
                            resource.type === ResourceType.Book ? 'bg-amber-500/10 text-amber-400' :
                            resource.type === ResourceType.Tool ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                        }`}>
                            {resource.type}
                        </div>
                        <button 
                            onClick={() => toggleBookmark(resource)}
                            className={`transition-colors p-1 rounded hover:bg-slate-700 ${saved ? 'text-indigo-400' : 'text-slate-600 hover:text-white'}`}
                        >
                            <Bookmark className={`w-5 h-5 ${saved ? 'fill-indigo-400' : ''}`} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{resource.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{resource.author}</p>
                    <p className="text-slate-300 text-sm mb-4 flex-1 line-clamp-3">{resource.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {resource.tags.map(tag => (
                            <span key={tag} className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">#{tag}</span>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Read <ExternalLink className="w-4 h-4" />
                        </a>
                        {resource.type === ResourceType.Paper && (
                            <button className="p-2 bg-slate-800 border border-slate-600 text-slate-400 hover:text-white rounded-lg">
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-20">
            <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
                <Filter className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
            <p className="text-slate-400">
                {activeFilter === 'Saved' ? "You haven't saved any resources yet." : "Try adjusting your filters or ask AI to generate new ones."}
            </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
