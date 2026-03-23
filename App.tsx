import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BreakingAlert } from "./components/BreakingAlert";
import { Theme } from "./types";
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { Toaster } from "./components/ui/sonner";

const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const About = lazy(() =>
  import("./pages/About").then((m) => ({ default: m.About })),
);
const Courses = lazy(() =>
  import("./pages/Courses").then((m) => ({ default: m.Courses })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);
const News = lazy(() =>
  import("./pages/News").then((m) => ({ default: m.News })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Admin = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.Admin })),
);
const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login })),
);

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

const FullScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      {message ? (
        <p className="text-slate-500 dark:text-slate-400">{message}</p>
      ) : null}
    </div>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") return stored as Theme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? Theme.DARK
          : Theme.LIGHT;
      }
    } catch (e) {
      console.warn("LocalStorage access blocked or unavailable:", e);
    }
    return Theme.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // Ignore write errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  const renderLazyPage = (
    page: React.ReactNode,
    message = "Carregando página...",
  ) => <Suspense fallback={<FullScreenLoader message={message} />}>{page}</Suspense>;

  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
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
      return (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      );
    }

    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <Router>
            <ScrollToTop />
            <BreakingAlert />
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-primary-500 selection:text-white">
              <Routes>
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      {renderLazyPage(<Admin />, "Carregando painel...")}
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      {renderLazyPage(<Dashboard />, "Carregando dashboard...")}
                    </RequireAuth>
                  }
                />
                <Route
                  path="/login"
                  element={renderLazyPage(<Login />, "Carregando login...")}
                />
                <Route
                  path="*"
                  element={
                    <>
                      <Header theme={theme} toggleTheme={toggleTheme} />
                      <main id="main-content" className="flex-grow">
                        <Routes>
                          <Route path="/" element={renderLazyPage(<Home />)} />
                          <Route path="/about" element={renderLazyPage(<About />)} />
                          <Route
                            path="/courses"
                            element={renderLazyPage(<Courses />)}
                          />
                          <Route path="/news" element={renderLazyPage(<News />)} />
                          <Route
                            path="/contact"
                            element={renderLazyPage(<Contact />)}
                          />
                          <Route
                            path="*"
                            element={renderLazyPage(<NotFound />)}
                          />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
              <Toaster position="top-left" />
            </div>
          </Router>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
