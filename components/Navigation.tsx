import React from 'react';
import { 
  LayoutDashboard, Trophy, BookOpen, Bookmark, Map, 
  GraduationCap, Briefcase, Award, FileText, Target, 
  Mic, Box, Globe, User, CreditCard, Users, Cpu, Star
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
      ]
    },
    {
      title: "Learn",
      items: [
        { path: '/app/topics', label: 'Tutorials', icon: BookOpen },
        { path: '/app/resources', label: 'Bookmarks', icon: Bookmark },
        { path: '/app/path', label: 'Learning Paths', icon: Map },
      ]
    },
    {
      title: "Grow",
      items: [
        { path: '/app/courses', label: 'Courses', icon: GraduationCap },
        { path: '/app/career', label: 'Career Paths', icon: Briefcase },
        { path: '/app/certificates', label: 'Certificates', icon: Award },
      ]
    },
    {
      title: "Practice",
      items: [
        { path: '/app/assessments', label: 'Assessments', icon: FileText },
        { path: '/app/challenges', label: 'Challenges', icon: Target },
        { path: '/app/interview', label: 'Interview Prep', icon: Mic },
      ]
    },
    {
      title: "Build",
      items: [
        { path: '/app/spaces', label: 'Spaces', icon: Box },
        { path: '/app/domains', label: 'Domains', icon: Globe },
      ]
    },
    {
      title: "Profile",
      items: [
        { path: '/app/profile', label: 'Profile', icon: User },
        { path: '/app/billing', label: 'Billing & Plans', icon: CreditCard },
        { path: '/app/teachers', label: 'For Teachers', icon: Users },
      ]
    }
  ];

  return (
    <div className="h-screen w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20 overflow-y-auto custom-scrollbar">
      <div className="p-6 flex items-center gap-3 sticky top-0 bg-[#0f172a] z-10">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cognosys</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-8 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-indigo-600/10 text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${
                    isActive(item.path) ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        <div className="px-4 pt-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/20 text-center relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center gap-2 mb-3">
                   <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                   <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Premium</p>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-orange-900/20 relative z-10">
                    REMOVE ADS
                </button>
            </div>
        </div>
      </nav>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default Navigation;