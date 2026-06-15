// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SummaryDetail from './pages/SummaryDetail.jsx';
import ExamModule from './pages/ExamModule.jsx';
import StudentModule from './pages/StudentModule.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            {/* Global Futuristic Cyber Background (propagated to all pages) */}
            <div className="cyber-grid"></div>
            <div className="cyber-blob blob-purple"></div>
            <div className="cyber-blob blob-cyan"></div>
            <div className="cyber-blob blob-magenta"></div>

            {/* Global Drifting Tech Particles (background depth field) */}
            <div className="bg-particle color-magenta" style={{ top: '15%', left: '8%', animation: 'bgDrift-1 25s ease-in-out infinite', animationDelay: '0s' }}>+</div>
            <div className="bg-particle color-cyan" style={{ top: '35%', right: '12%', animation: 'bgDrift-2 30s ease-in-out infinite', animationDelay: '-4s' }}>◇</div>
            <div className="bg-particle" style={{ bottom: '25%', left: '14%', animation: 'bgDrift-3 28s ease-in-out infinite', animationDelay: '-8s' }}>△</div>
            <div className="bg-particle color-magenta" style={{ bottom: '40%', right: '25%', animation: 'bgDrift-1 32s ease-in-out infinite', animationDelay: '-12s' }}>·</div>
            <div className="bg-particle color-cyan" style={{ top: '65%', left: '28%', animation: 'bgDrift-2 26s ease-in-out infinite', animationDelay: '-16s' }}>+</div>
            <div className="bg-particle" style={{ top: '85%', right: '8%', animation: 'bgDrift-3 34s ease-in-out infinite', animationDelay: '-20s' }}>◇</div>
            <div className="bg-particle color-magenta" style={{ top: '45%', left: '88%', animation: 'bgDrift-1 24s ease-in-out infinite', animationDelay: '-6s' }}>△</div>
            <div className="bg-particle color-cyan" style={{ bottom: '12%', left: '48%', animation: 'bgDrift-2 29s ease-in-out infinite', animationDelay: '-10s' }}>·</div>
            <div className="bg-particle" style={{ bottom: '78%', right: '42%', animation: 'bgDrift-3 33s ease-in-out infinite', animationDelay: '-14s' }}>+</div>
            <div className="bg-particle color-cyan" style={{ top: '22%', left: '55%', animation: 'bgDrift-1 27s ease-in-out infinite', animationDelay: '-18s' }}>◇</div>

            <Routes>
              {/* Public Landing & Authentication Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Portal Student Routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/summary/:id" element={<SummaryDetail />} />
                <Route path="/exams" element={<ExamModule />} />
                <Route path="/profile" element={<StudentModule />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
