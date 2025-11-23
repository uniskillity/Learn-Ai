import React from 'react';
import { LayoutDashboard, BookOpen, Map, User, Cpu, Network, Trophy, Bookmark, GraduationCap, Briefcase, Award, FileText, Target, Mic, Box, Globe, CreditCard, Users } from 'lucide-react';
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
    <div className="h-screen w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20 overflow-y-auto no-scrollbar">
      <div className="p-6 flex items-center gap-3 sticky top-0 bg-[#0f172a] z-10">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cognosys</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-8">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-white border-l-4 border-indigo-500'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 px-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-orange-500/30 text-center">
                <p className="text-xs font-bold text-orange-400 mb-2">REMOVE ADS</p>
                <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded transition-colors">
                    Go Premium
                </button>
            </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;