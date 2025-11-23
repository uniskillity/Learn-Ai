import React from 'react';
import { useAppState } from '../context/StateContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Trophy, BookOpen, ChevronRight, Zap, Target, 
  FileText, Award, Box, Code2, Database, Shield, Layout,
  Circle, CheckCircle2, Lock
} from 'lucide-react';

const StreakWidget = ({ streak }: { streak: number }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay(); // 0 is Sunday
  // Adjust to make Mon=0
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-500/20 rounded-full">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">Current Streak</p>
            <h3 className="text-2xl font-bold text-white">{streak} days</h3>
        </div>
      </div>
      <div className="flex gap-2 md:gap-4">
        {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    i === todayIdx 
                    ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/50 scale-110' 
                    : i < todayIdx
                    ? 'bg-orange-500/20 border-orange-500/30 text-orange-500'
                    : 'bg-slate-700 border-slate-600 text-slate-500'
                }`}>
                    <Flame className={`w-4 h-4 ${i <= todayIdx ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-xs font-bold ${i === todayIdx ? 'text-white' : 'text-slate-500'}`}>{d}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ path, navigate }: { path: any, navigate: any }) => {
  if (!path) return null;

  const completed = path.modules.filter((m: any) => m.status === 'completed').length;
  const total = path.modules.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 group hover:border-indigo-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
         <div className="flex gap-4">
             <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center border border-indigo-500/30">
                 <Code2 className="w-7 h-7 text-indigo-400" />
             </div>
             <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Course</p>
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     {path.topic}
                     <span className="px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-bold rounded uppercase">New</span>
                 </h3>
             </div>
         </div>
         <button 
            onClick={() => navigate('/app/path')}
            className="text-indigo-400 text-sm font-bold hover:text-white transition-colors"
         >
             Continue
         </button>
      </div>

      <div className="w-full bg-slate-900 h-2 rounded-full mb-6">
          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 text-white">
              <div className="w-4 h-4 rounded-full border-2 border-indigo-500 bg-indigo-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              Lessons
          </div>
          <div className="flex items-center gap-2 hover:text-slate-200 cursor-pointer"><Circle className="w-4 h-4" /> Exercises</div>
          <div className="flex items-center gap-2 hover:text-slate-200 cursor-pointer"><Circle className="w-4 h-4" /> Challenges</div>
          <div className="flex items-center gap-2 hover:text-slate-200 cursor-pointer"><Circle className="w-4 h-4" /> Assessment</div>
          <div className="flex items-center gap-2 hover:text-slate-200 cursor-pointer"><Circle className="w-4 h-4" /> Exam</div>
      </div>
    </div>
  );
};

const TutorialCard = ({ title, icon: Icon, progress, color }: { title: string, icon: any, progress: number, color: string }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-750 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${color}`} />
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Tutorial</p>
                    <h4 className="font-bold text-white text-lg">{title}</h4>
                </div>
            </div>
            <button className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">
                Start <ChevronRight className="w-3 h-3" />
            </button>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2">
            <div className="bg-slate-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-xs text-slate-500 mt-1">{progress}%</p>
    </div>
);

const RightPanel = ({ user }: { user: any }) => (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {/* User Profile Mini */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-slate-600" />
                <div className="overflow-hidden">
                    <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                    <p className="text-xs text-indigo-400 cursor-pointer hover:underline">Open profile &gt;</p>
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-center gap-2">
                <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                    <Zap className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-slate-400">XP</p>
                    <p className="font-bold text-white">{user.xp.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-400">
                    <Trophy className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-slate-400">Rank</p>
                    <p className="font-bold text-white">#142</p>
                </div>
            </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20">
            Upgrade to Plus
        </button>

        {/* Activity Score */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h4 className="font-bold text-white mb-4">Activity Score</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
                {[
                    { label: 'Lessons', val: 12, icon: BookOpen },
                    { label: 'Exercises', val: 8, icon: Code2 },
                    { label: 'Quizzes', val: 5, icon: FileText },
                    { label: 'Challenges', val: 2, icon: Target },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center mb-2 text-slate-400">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">{item.val}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Progress</h4>
                <select className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 outline-none">
                    <option>Recent</option>
                    <option>All Time</option>
                </select>
            </div>
            
            <div className="space-y-4">
                <div className="text-center py-6 border-2 border-dashed border-slate-700 rounded-lg">
                     <p className="text-slate-500 text-sm mb-2">Start a tutorial to see your progress here</p>
                     <div className="w-8 h-8 bg-slate-700 rounded-full mx-auto flex items-center justify-center">
                         <Target className="w-4 h-4 text-slate-400" />
                     </div>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  const { user, activePath, addXP } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col lg:flex-row gap-8">
      
      {/* Main Column */}
      <div className="flex-1 min-w-0">
        
        {/* Ad Banner (Simulated) */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl p-1 mb-6 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            <div className="bg-white/10 absolute inset-0 group-hover:bg-white/20 transition-colors"></div>
            <div className="flex flex-col items-center text-slate-900 py-3">
                 <span className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Advertisement</span>
                 <h3 className="font-black text-2xl tracking-tighter italic">PEGASUS <span className="font-normal">AIRLINES</span></h3>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
                <div className="bg-white/50 p-0.5 rounded text-[10px]">i</div>
                <div className="bg-white/50 p-0.5 rounded text-[10px]">x</div>
            </div>
        </div>
        <div className="text-center mb-8">
            <button className="text-xs text-slate-500 font-bold hover:text-slate-300">REMOVE ADS</button>
        </div>

        {/* Streak */}
        <StreakWidget streak={user.streak} />

        {/* Welcome Leaderboard Banner */}
        <div className="bg-[#1e293b] rounded-2xl p-8 mb-8 text-center relative overflow-hidden border border-slate-700">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.15),transparent_70%)]"></div>
             <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Welcome! 👋</h2>
             <p className="text-slate-400 mb-6 relative z-10">Cognosys has introduced a <span className="text-indigo-400 underline decoration-indigo-500/50">new Leaderboard!</span><br/>Click button below to get 50XP and join others today!</p>
             
             <div className="bg-slate-900/50 rounded-xl p-4 max-w-md mx-auto flex items-center gap-4 border border-slate-700 relative z-10 backdrop-blur-sm">
                 <img src={user.avatarUrl} alt="You" className="w-10 h-10 rounded-full" />
                 <div className="flex-1 text-left">
                     <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">You</span>
                     <button 
                        onClick={() => addXP(50)}
                        className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
                     >
                         Click here and claim your spot NOW!
                     </button>
                 </div>
                 <span className="font-bold text-slate-400">0 XP</span>
             </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Courses</h3>
                <button onClick={() => navigate('/app/topics')} className="text-indigo-400 text-sm font-bold hover:underline">View all</button>
            </div>
            
            {activePath ? (
                <CourseCard path={activePath} navigate={navigate} />
            ) : (
                <div className="bg-slate-800 border border-slate-700 border-dashed rounded-xl p-8 text-center">
                    <p className="text-slate-400 mb-4">You haven't started any courses yet.</p>
                    <button onClick={() => navigate('/app/topics')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500">Browse Topics</button>
                </div>
            )}
            
            {/* Example Mock Course if active path is different or to fill space */}
            {!activePath || activePath.topic !== 'Machine Learning' ? (
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 opacity-75 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate('/app/topics')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500">
                             <Database className="w-6 h-6" />
                        </div>
                        <div>
                             <h3 className="font-bold text-white text-lg">Machine Learning Basics</h3>
                             <p className="text-xs text-slate-400">Recommended for you</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Circle className="w-3 h-3"/> Lessons</span>
                        <span className="flex items-center gap-1"><Circle className="w-3 h-3"/> Quiz</span>
                    </div>
                 </div>
            ) : null}
        </div>

        {/* Recommended Tutorials */}
        <div className="mb-8">
             <h3 className="text-xl font-bold text-white mb-4">Recommended Tutorials</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <TutorialCard title="Deep Learning" icon={Layout} progress={0} color="text-blue-400" />
                 <TutorialCard title="AI Ethics" icon={Shield} progress={0} color="text-purple-400" />
             </div>
             
             <div className="mt-4 bg-[#1e293b] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center border border-slate-700">
                 <div className="mb-4 md:mb-0">
                     <h4 className="font-bold text-white">40+ tutorials to boost your skills</h4>
                     <p className="text-slate-400 text-sm">From Python to Advanced NLP</p>
                 </div>
                 <button onClick={() => navigate('/app/topics')} className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1">
                     Explore more <ChevronRight className="w-4 h-4" />
                 </button>
             </div>
        </div>

        {/* Spaces & Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 text-center">
                 <h4 className="font-bold text-white mb-6 text-left">Spaces</h4>
                 <div className="mb-6 inline-flex p-4 bg-slate-800 rounded-xl">
                     <Box className="w-8 h-8 text-emerald-500" />
                 </div>
                 <h5 className="font-bold text-white mb-2">You have no spaces yet</h5>
                 <p className="text-slate-400 text-sm mb-6">Create one and start coding!</p>
                 <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-emerald-900/20">
                     Create space
                 </button>
            </div>

            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 text-center">
                 <h4 className="font-bold text-white mb-6 text-left">Certificates</h4>
                 <div className="mb-6 inline-flex p-4 bg-slate-800 rounded-xl">
                     <Award className="w-8 h-8 text-emerald-500" />
                 </div>
                 <h5 className="font-bold text-white mb-2">Get certified!</h5>
                 <p className="text-slate-400 text-sm mb-6">Pass an exam and receive your certificate</p>
                 <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-emerald-900/20">
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