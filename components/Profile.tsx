
import React from 'react';
import { useAppState } from '../context/StateContext';
import { Mail, MapPin, Link as LinkIcon, Github, Twitter, Camera, Trophy } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAppState();

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="relative mb-20">
        <div className="h-48 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl w-full overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="relative">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover bg-slate-800"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-slate-800 rounded-full border border-slate-700 text-white hover:bg-slate-700 transition-colors">
                    <Camera className="w-4 h-4" />
                </button>
            </div>
            <div className="ml-6 mb-4">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-indigo-400 font-medium">{user.role}</p>
            </div>
        </div>
        <div className="absolute bottom-4 right-8 flex gap-3">
             <button className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 font-medium hover:bg-slate-700 transition-colors">Edit Profile</button>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors">Share Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">About</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{user.bio}</p>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>alex.dev@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <LinkIcon className="w-4 h-4" />
                        <a href="#" className="text-indigo-400 hover:underline">alex-ai.dev</a>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 flex gap-4">
                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5"/></a>
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                 <h3 className="text-white font-semibold mb-4">Interests</h3>
                 <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">
                            {interest}
                        </span>
                    ))}
                 </div>
            </div>
        </div>

        {/* Right Column: Activity & Badges */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-semibold">Recent Achievements</h3>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {['Fast Learner', 'Code Ninja', 'Math Whiz'].map((badge, i) => (
                         <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-slate-800 border border-slate-600 shadow-lg ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-emerald-400' : 'text-purple-400'}`}>
                                <Trophy className="w-6 h-6" />
                            </div>
                            <span className="text-white text-sm font-medium">{badge}</span>
                            <span className="text-xs text-slate-500 mt-1">Earned 2d ago</span>
                         </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Contribution Graph</h3>
                <div className="flex gap-1">
                    {Array.from({length: 52}).map((_, colIndex) => (
                         <div key={colIndex} className="flex flex-col gap-1">
                             {Array.from({length: 7}).map((_, rowIndex) => (
                                 <div 
                                    key={rowIndex} 
                                    className={`w-3 h-3 rounded-sm ${
                                        Math.random() > 0.7 ? 'bg-indigo-500' : 
                                        Math.random() > 0.85 ? 'bg-indigo-700' : 
                                        'bg-slate-700/50'
                                    }`} 
                                />
                             ))}
                         </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
