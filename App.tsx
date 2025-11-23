import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LearningPath from './components/LearningPath';
import Resources from './components/Resources';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import TopicExplorer from './components/TopicExplorer';
import Leaderboard from './components/Leaderboard';
import { StateProvider } from './context/StateContext';
import { AlertCircle } from 'lucide-react';

// Layout component for authenticated sections
const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30 flex">
            <Navigation />
            <main className="ml-64 flex-1 min-h-screen overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const ComingSoon: React.FC<{title: string}> = ({title}) => (
    <div className="p-12 text-center animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-6 bg-slate-800 rounded-full mb-6 border border-slate-700 shadow-xl">
            <AlertCircle className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
            This feature is currently under development. Our engineers are working hard to bring {title.toLowerCase()} to you soon!
        </p>
        <button onClick={() => window.history.back()} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/20">
            Go Back
        </button>
    </div>
);

const App: React.FC = () => {
  return (
    <StateProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authenticated App Routes */}
          <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              
              <Route path="topics" element={<TopicExplorer />} />
              <Route path="resources" element={<Resources />} />
              <Route path="path" element={<LearningPath />} />
              
              <Route path="courses" element={<Navigate to="/app/path" replace />} />
              <Route path="career" element={<ComingSoon title="Career Paths" />} />
              <Route path="certificates" element={<ComingSoon title="Certificates" />} />
              
              <Route path="assessments" element={<ComingSoon title="Assessments" />} />
              <Route path="challenges" element={<ComingSoon title="Challenges" />} />
              <Route path="interview" element={<ComingSoon title="Interview Prep" />} />
              
              <Route path="spaces" element={<ComingSoon title="Spaces" />} />
              <Route path="domains" element={<ComingSoon title="Domains" />} />
              
              <Route path="profile" element={<Profile />} />
              <Route path="billing" element={<ComingSoon title="Billing & Plans" />} />
              <Route path="teachers" element={<ComingSoon title="For Teachers" />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StateProvider>
  );
};

export default App;