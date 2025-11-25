import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { NotFound } from './pages/NotFound';
import { Theme } from './types';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load admin pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') return stored as Theme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
      }
    } catch (e) {
      console.warn('LocalStorage access blocked or unavailable:', e);
    }
    return Theme.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore write errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="text-slate-500">Carregando...</p>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-primary-500 selection:text-white">
              <Routes>
                <Route path="/admin" element={
                  <RequireAuth>
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-slate-500 dark:text-slate-400">Carregando painel...</p>
                        </div>
                      </div>
                    }>
                      <Admin />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/login" element={
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }>
                    <Login />
                  </Suspense>
                } />
                <Route path="*" element={
                  <>
                    <Header theme={theme} toggleTheme={toggleTheme} />
                    <main id="main-content" className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/dashboard" element={
                          <Suspense fallback={
                            <div className="min-h-screen flex items-center justify-center">
                              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          }>
                            <Dashboard />
                          </Suspense>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
