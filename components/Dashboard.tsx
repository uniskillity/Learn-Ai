
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Clock, Flame, Trophy, TrendingUp, ArrowRight, BookOpen } from 'lucide-react';
import { useAppState } from '../context/StateContext';
import { useNavigate } from 'react-router-dom';

const activityData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 70 },
];

const skillData = [
  { subject: 'Python', A: 120, fullMark: 150 },
  { subject: 'Math', A: 98, fullMark: 150 },
  { subject: 'ML Theory', A: 130, fullMark: 150 },
  { subject: 'NLP', A: 99, fullMark: 150 },
  { subject: 'Vision', A: 85, fullMark: 150 },
  { subject: 'Ethics', A: 65, fullMark: 150 },
];

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, activePath } = useAppState();
  const navigate = useNavigate();

  const completedModules = activePath ? activePath.modules.filter(m => m.status === 'completed').length : 0;
  const totalModules = activePath ? activePath.modules.length : 0;
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name} 👋</h1>
            <p className="text-slate-400">You've learned for <span className="text-indigo-400 font-bold">32 hours</span> this week. Keep it up!</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-slate-500">Current Level</p>
            <p className="text-xl font-bold text-indigo-400">Grandmaster AI Architect</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total XP" value={user.xp} icon={Trophy} color="bg-yellow-500/20 text-yellow-500" />
        <StatCard label="Day Streak" value={user.streak} icon={Flame} color="bg-orange-500/20 text-orange-500" />
        <StatCard label="Hours Learned" value="142" icon={Clock} color="bg-blue-500/20 text-blue-500" />
        <StatCard label="Modules Done" value={completedModules} icon={TrendingUp} color="bg-emerald-500/20 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Learning Activity</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Skill Breakdown</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#6366f1" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Active Course */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Current Learning Path</h3>
            {activePath && (
                <button 
                    onClick={() => navigate('/app/path')}
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
            )}
         </div>
         
         {activePath ? (
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white">{activePath.topic}</h4>
                            <p className="text-sm text-slate-400">{activePath.difficulty} Level</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <span className="text-2xl font-bold text-white">{progress}%</span>
                         <p className="text-xs text-slate-500">Completed</p>
                    </div>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                    <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                
                <p className="text-slate-400 text-sm">
                    {completedModules} of {totalModules} modules completed. Next up: 
                    <span className="text-indigo-300 font-medium ml-1">
                        {activePath.modules.find(m => m.status !== 'completed')?.title || 'Completed!'}
                    </span>
                </p>
            </div>
         ) : (
             <div className="text-center py-10 bg-slate-700/10 rounded-xl border border-dashed border-slate-700">
                 <p className="text-slate-400 mb-4">No active learning path.</p>
                 <button 
                    onClick={() => navigate('/app/path')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500"
                >
                    Create New Path
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

export default Dashboard;
