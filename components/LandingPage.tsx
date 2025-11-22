import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Globe, Zap, ArrowRight, BookOpen, BarChart } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cognosys AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#topics" className="text-slate-300 hover:text-white transition-colors">Topics</a>
            <Link to="/app/dashboard" className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium transition-colors">
                Log In
            </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Gemini 2.5 Flash</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400 leading-tight animate-slide-up">
            Master the Universe of <br /> Artificial Intelligence
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto animate-slide-up delay-100">
            Your personalized gateway to learning AI. Create custom curriculums, explore endless topics, and track your journey to mastery.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <Link to="/app/dashboard" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#topics" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg border border-slate-700 transition-all">
                Explore Topics
            </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative z-10 bg-slate-900/50 border-y border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Everything you need to learn AI</h2>
                <p className="text-slate-400">Tools designed to accelerate your learning process.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={Globe} 
                    title="Global AI Topic Explorer" 
                    desc="Dive deep into any AI field. From Neural Networks to Ethics, explore the entire landscape." 
                />
                <FeatureCard 
                    icon={BookOpen} 
                    title="Custom Learning Paths" 
                    desc="Tell us what you want to learn, and we'll generate a structured curriculum just for you." 
                />
                <FeatureCard 
                    icon={BarChart} 
                    title="Progress Tracking" 
                    desc="Visualize your growth with detailed analytics, XP tracking, and skill radar charts." 
                />
            </div>
        </div>
      </div>

      {/* Topics Section */}
      <div id="topics" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Explore AI Disciplines</h2>
                <p className="text-slate-400">Start your journey in any of these major fields.</p>
            </div>
            <Link to="/app/topics" className="text-indigo-400 font-medium hover:text-indigo-300 flex items-center gap-1">
                View all topics <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Robotics', 'Generative AI', 'Reinforcement Learning', 'AI Ethics'].map((topic) => (
                <Link key={topic} to="/app/topics" className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/20 transition-all group">
                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{topic}</h3>
                </Link>
            ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                    <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Cognosys AI</span>
            </div>
            <p className="text-slate-500 text-sm">© 2024 Cognosys AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
        <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6 text-indigo-400">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default LandingPage;