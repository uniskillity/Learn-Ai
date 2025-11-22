
import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LearningPath from './components/LearningPath';
import Resources from './components/Resources';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import TopicExplorer from './components/TopicExplorer';
import { StateProvider } from './context/StateContext';

// Layout component for authenticated sections
const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
            <Navigation />
            <main className="ml-64 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

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
              <Route path="topics" element={<TopicExplorer />} />
              <Route path="path" element={<LearningPath />} />
              <Route path="resources" element={<Resources />} />
              <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StateProvider>
  );
};

export default App;
