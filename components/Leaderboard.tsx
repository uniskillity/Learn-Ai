import React from 'react';
import { Trophy, Medal, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const Leaderboard: React.FC = () => {
  const { user } = useAppState();

  const mockUsers = [
    { name: 'ChillCat19', xp: 1850, change: 'up' },
    { name: 'AussieMike', xp: 1620, change: 'down' },
    { name: 'CodeWizard', xp: 1540, change: 'same' },
    { name: 'Sarah_Dev', xp: 1490, change: 'up' },
    { name: 'QuantumBit', xp: 1300, change: 'down' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-slate-400">Compete with the community and earn your spot at the top!</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4 drop-shadow-lg" />
             <h2 className="text-2xl font-bold text-white relative z-10">Weekly Champions</h2>
             <p className="text-indigo-200 text-sm relative z-10">Reset in 2 days</p>
        </div>

        <div className="p-2 md:p-6">
            <div className="space-y-2">
                {/* Top 3 Header */}
                <div className="flex items-end justify-center gap-4 mb-8 pt-6">
                     <div className="flex flex-col items-center">
                         <div className="w-16 h-16 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center mb-2 relative">
                            <span className="text-2xl">🥈</span>
                            <div className="absolute -bottom-2 bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">2</div>
                         </div>
                         <span className="text-slate-300 text-sm font-bold">AussieMike</span>
                         <span className="text-indigo-400 text-xs font-bold">1620 XP</span>
                     </div>
                     <div className="flex flex-col items-center -mt-8">
                         <div className="w-20 h-20 rounded-full border-4 border-yellow-500 bg-slate-800 flex items-center justify-center mb-2 relative shadow-lg shadow-yellow-500/20">
                            <span className="text-4xl">👑</span>
                            <div className="absolute -bottom-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">1</div>
                         </div>
                         <span className="text-white text-base font-bold">ChillCat19</span>
                         <span className="text-yellow-400 text-sm font-bold">1850 XP</span>
                     </div>
                     <div className="flex flex-col items-center">
                         <div className="w-16 h-16 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center mb-2 relative">
                            <span className="text-2xl">🥉</span>
                            <div className="absolute -bottom-2 bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">3</div>
                         </div>
                         <span className="text-slate-300 text-sm font-bold">CodeWiz</span>
                         <span className="text-indigo-400 text-xs font-bold">1540 XP</span>
                     </div>
                </div>

                {/* List */}
                <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {mockUsers.map((u, i) => (
                        <div key={i} className="flex items-center p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                            <div className="w-8 text-center font-bold text-slate-500 mr-4">{i + 1}</div>
                            <div className="flex-1 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                                    {u.name[0]}
                                </div>
                                <span className="font-bold text-white">{u.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-indigo-400">{u.xp} XP</span>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                                    {u.change === 'up' && <ChevronUp className="w-3 h-3 text-emerald-500" />}
                                    {u.change === 'down' && <ChevronDown className="w-3 h-3 text-red-500" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* User Row */}
                    <div className="flex items-center p-4 bg-indigo-500/10 border-t border-indigo-500/30">
                            <div className="w-8 text-center font-bold text-indigo-400 mr-4">142</div>
                            <div className="flex-1 flex items-center gap-3">
                                <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                                <div>
                                    <span className="font-bold text-white">{user.name}</span>
                                    <span className="ml-2 text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">YOU</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white">{user.xp} XP</span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;