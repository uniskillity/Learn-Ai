import React from 'react';
import { useAppState } from '../context/StateContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Trophy, BookOpen, ChevronRight, Zap, Target, 
  FileText, Code2, Box, Award, Circle, Database, Layout, Shield, Info, X, Map
} from 'lucide-react';

const StreakWidget = ({ streak }: { streak: number }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay(); 
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 bg-orange-500/5 rounded-full blur-3xl translate-x-10 -translate-y-10 pointer-events-none"></div>
      
      <div className="flex items-center gap-5 relative z-10">
        <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/20">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse-slow" />
        </div>
        <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Current Streak</p>
            <h3 className="text-3xl font-black text-white">{streak} <span className="text-lg font-bold text-slate-500">days</span></h3>
        </div>
      </div>
      
      <div className="flex gap-2 sm:gap-3 relative z-10">
        {days.map((d, i) => {
            const isActive = i <= todayIdx;
            const isToday = i === todayIdx;
            return (
                <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isToday 
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30 scale-110' 
                        : isActive
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                        : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}>
                        <Flame className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-slate-600'}`}>{d}</span>
                </div>
            );
        })}
      </div>
    </div>
  );
};

const CourseCard = ({ title, active, navigate }: { title: string, active?: boolean, navigate: any }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4 group hover:border-indigo-500/50 transition-all relative overflow-hidden cursor-pointer" onClick={() => navigate('/app/path', { state: { topic: title } })}>
      <div className="flex justify-between items-start mb-4">
         <div className="flex gap-4">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${title.includes('HTML') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                 <Code2 className="w-7 h-7" />
             </div>
             <div>
                 <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Course</p>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded uppercase">New</span>
                 </div>
                 <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                     {title}
                 </h3>
             </div>
         </div>
         <button className="text-xs font-bold bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
             Start
         </button>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition-colors"><Circle className="w-3 h-3 text-slate-600" /> Lessons</div>
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition-colors"><Circle className="w-3 h-3 text-slate-600" /> Exercises</div>
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition-colors"><Circle className="w-3 h-3 text-slate-600" /> Challenges</div>
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition-colors"><Circle className="w-3 h-3 text-slate-600" /> Assessment</div>
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer transition-colors"><Circle className="w-3 h-3 text-slate-600" /> Exam</div>
      </div>
    </div>
  );
};

const TutorialCard = ({ title, icon: Icon, progress, color, onClick }: { title: string, icon: any, progress: number, color: string, onClick: () => void }) => (
    <div onClick={onClick} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:bg-slate-750 hover:border-slate-600 transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-${color.split('-')[1]}-500/30 transition-colors`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tutorial</p>
                    <h4 className="font-bold text-white text-base group-hover:text-slate-200 transition-colors">{title}</h4>
                </div>
            </div>
            <div className="text-slate-500 group-hover:text-white transition-colors">
                <span className="text-xs font-bold bg-slate-900 px-2 py-1 rounded-lg">Start ›</span>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs font-bold text-slate-500">{progress}%</span>
        </div>
    </div>
);

const RightPanel = ({ user }: { user: any }) => (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {/* User Profile Mini */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-600" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                    <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                    <p className="text-xs text-indigo-400 font-medium cursor-pointer hover:underline">Open profile ›</p>
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center justify-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Zap className="w-5 h-5 fill-blue-500/20" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">XP</p>
                    <p className="font-black text-white text-lg">{user.xp}</p>
                </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center justify-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Box className="w-5 h-5 fill-emerald-500/20" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Gems</p>
                    <p className="font-black text-white text-lg">100</p>
                </div>
            </div>
        </div>

        <button className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/20 border border-indigo-500/20 flex items-center justify-center gap-2 group">
            <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            Upgrade to Plus
        </button>

        {/* Activity Score */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                Activity Score
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
                {[
                    { label: 'Lessons', val: 0, icon: BookOpen },
                    { label: 'Exercises', val: 0, icon: Code2 },
                    { label: 'Quizzes', val: 0, icon: FileText },
                    { label: 'Challenges', val: 0, icon: Target },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center group cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-2 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">{item.val}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Progress</h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-lg cursor-pointer hover:text-white">
                    Recent
                    <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/20">
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                     <Target className="w-6 h-6 text-slate-500" />
                 </div>
                 <p className="text-slate-400 text-xs font-medium">Start a tutorial to see your progress here</p>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  const { user, activePath, addXP } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col lg:flex-row gap-8 pb-20">
      
      {/* Main Column */}
      <div className="flex-1 min-w-0">
        
        {/* Ad Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl mb-8 relative overflow-hidden group cursor-pointer shadow-lg shadow-orange-900/20">
            <div className="bg-white/10 absolute inset-0 group-hover:bg-white/20 transition-colors"></div>
            <div className="flex flex-col items-center text-slate-900 py-6 px-8 w-full text-center">
                 <div className="flex justify-between w-full mb-1 absolute top-2 px-4">
                     <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Advertisement</span>
                     <div className="flex gap-1">
                        <div className="bg-black/10 w-4 h-4 rounded flex items-center justify-center text-[10px] hover:bg-black/20"><Info className="w-2.5 h-2.5" /></div>
                        <div className="bg-black/10 w-4 h-4 rounded flex items-center justify-center text-[10px] hover:bg-black/20"><X className="w-2.5 h-2.5" /></div>
                     </div>
                 </div>
                 <h3 className="font-black text-3xl tracking-tighter italic mt-2">PEGASUS <span className="font-normal">AIRLINES</span></h3>
            </div>
            <div className="bg-slate-900 py-1.5 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hover:text-white transition-colors">REMOVE ADS</span>
            </div>
        </div>

        {/* Streak */}
        <StreakWidget streak={user.streak} />

        {/* Welcome Leaderboard Banner */}
        <div className="bg-[#1e293b] rounded-2xl p-8 mb-8 text-center relative overflow-hidden border border-slate-700 shadow-xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.1),transparent_70%)]"></div>
             
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold text-white mb-3">Welcome! 👋</h2>
                 <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                    Cognosys has introduced a <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">new Leaderboard!</span><br/>
                    Click button below to get 50XP and join others today!
                 </p>
                 
                 {/* Leaderboard Preview */}
                 <div className="max-w-md mx-auto mb-6 space-y-2">
                     <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 opacity-60 scale-95">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                             <span className="text-slate-400 text-sm font-bold">ChillCat19</span>
                         </div>
                         <span className="text-slate-500 font-mono text-xs">1,800 XP</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-indigo-500/50 shadow-lg relative overflow-hidden">
                         <div className="absolute inset-0 bg-indigo-500/5"></div>
                         <div className="flex items-center gap-3 relative z-10">
                             <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                             <div>
                                 <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 mr-2">YOU</span>
                                 <button onClick={() => addXP(50)} className="text-white text-sm font-bold bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                                     Click here and claim your spot NOW!
                                 </button>
                             </div>
                         </div>
                         <span className="text-slate-400 font-mono text-sm relative z-10">0 XP</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 opacity-60 scale-95">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                             <span className="text-slate-400 text-sm font-bold">AussieMike</span>
                         </div>
                         <span className="text-slate-500 font-mono text-xs">1,500 XP</span>
                     </div>
                 </div>
             </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Courses
                </h3>
                <button onClick={() => navigate('/app/topics')} className="text-indigo-400 text-sm font-bold hover:text-indigo-300 hover:underline">View all</button>
            </div>
            
            {activePath ? (
               // If path exists, show generic course card adapted from the prompt style
               <CourseCard title={activePath.topic} active navigate={navigate} />
            ) : (
               <>
                   <CourseCard title="HTML" navigate={navigate} />
                   <CourseCard title="JavaScript" navigate={navigate} />
               </>
            )}
        </div>

        {/* Recommended Tutorials */}
        <div className="mb-8">
             <h3 className="text-xl font-bold text-white mb-6">Recommended Tutorials</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <TutorialCard 
                    title="CSS" 
                    icon={Layout} 
                    progress={0} 
                    color="text-blue-400" 
                    onClick={() => navigate('/app/topics')} 
                 />
                 <TutorialCard 
                    title="SQL" 
                    icon={Database} 
                    progress={0} 
                    color="text-emerald-400" 
                    onClick={() => navigate('/app/topics')}
                 />
             </div>
             
             <div className="mt-4 bg-[#1e293b] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group" onClick={() => navigate('/app/topics')}>
                 <div className="mb-4 md:mb-0">
                     <h4 className="font-bold text-white text-lg">40+ tutorials to boost your skills</h4>
                     <p className="text-slate-400 text-sm font-medium">Explore more <span className="text-emerald-400">↗</span></p>
                 </div>
             </div>
        </div>

        {/* Spaces & Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500/30 transition-all group">
                 <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-white text-left">Spaces</h4>
                 </div>
                 <div className="mb-6 inline-flex p-4 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                     <Code2 className="w-8 h-8 text-emerald-500" />
                 </div>
                 <h5 className="font-bold text-white mb-2 text-lg">You have no spaces yet</h5>
                 <p className="text-slate-400 text-sm mb-8">Create one and start coding!</p>
                 <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 w-full">
                     Create space
                 </button>
            </div>

            <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500/30 transition-all group">
                 <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-white text-left">Certificates</h4>
                 </div>
                 <div className="mb-6 inline-flex p-4 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                     <Award className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h5 className="font-bold text-white mb-2 text-lg">Get certified!</h5>
                 <p className="text-slate-400 text-sm mb-8">Pass an exam and receive your certificate</p>
                 <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 w-full">
                     Explore certificates
                 </button>
            </div>
        </div>
      </div>

      {/* Right Sidebar (Desktop) */}
      <RightPanel user={user} />

    </div>
  );
};

export default Dashboard;