import React from 'react';
import { LayoutDashboard, BookOpen, Map, User, Cpu, Network } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app/dashboard') {
        return location.pathname === '/app/dashboard' || location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/topics', label: 'Topic Explorer', icon: Network },
    { path: '/app/path', label: 'Learning Paths', icon: Map },
    { path: '/app/resources', label: 'Resources', icon: BookOpen },
    { path: '/app/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cognosys AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
           <h4 className="text-sm font-semibold text-white mb-1">Pro Plan</h4>
           <p className="text-xs text-slate-400 mb-3">Get unlimited AI generations.</p>
           <button className="w-full py-2 text-xs font-bold text-indigo-100 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
             Upgrade Now
           </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;