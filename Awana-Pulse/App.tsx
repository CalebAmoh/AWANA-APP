import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import RosterTable from './components/RosterTable';
import AddClubberModal from './components/AddClubberModal';
import ClubbersPage from './components/ClubbersPage';
import ScripturePage from './components/ScripturePage';
import GamesPage from './components/GamesPage';
import LeaderboardPage from './components/LeaderboardPage';
import SettingsPage from './components/SettingsPage';
import VolunteersPage from './components/VolunteersPage';
import LoginPage from './components/LoginPage';
import { AttendanceChart, GroupDistributionChart } from './components/Charts';
import { MOCK_METRICS, MOCK_ALERTS } from './constants';
import { Kid, Status } from './types';
import { Backend } from './services/backend';
import { Bell, Plus, Sparkles, ChevronDown, Menu, Moon, Sun, PieChart, Loader2 } from 'lucide-react';
import { getCoachingInsights } from './services/geminiService';
import { Button, Card, CardHeader, CardTitle, CardContent } from './components/ui';
import { cn } from './lib/utils';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [insightText, setInsightText] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddClubberModalOpen, setIsAddClubberModalOpen] = useState(false);
  
  // Data State
  const [kids, setKids] = useState<Kid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = Backend.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Persist activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Initial Data Fetch
  useEffect(() => {
    if (isAuthenticated) {
        fetchKids();
    }
  }, [isAuthenticated]);

  const fetchKids = async () => {
    setIsLoading(true);
    try {
      const data = await Backend.getKids();
      console.log("Fetched kids:", data);
      setKids(data);
    } catch (error) {
      console.error("Failed to fetch kids", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    setShowAIInsights(true);
    const text = await getCoachingInsights(kids);
    setInsightText(text);
    setLoadingInsight(false);
  };

  const handleLogin = () => {
      setIsAuthenticated(true);
      setActiveTab('dashboard'); // Reset to dashboard on login
  };

  const handleLogout = () => {
      Backend.logout();
      setIsAuthenticated(false);
      setKids([]); // Clear sensitive data
  };

  // Metrics derived from real data
  const realMetrics = [
    { ...MOCK_METRICS[0], value: kids.length },
    { ...MOCK_METRICS[1], value: kids.filter(k => k.status === Status.NEEDS_HELP).length },
    { ...MOCK_METRICS[2] },
    { ...MOCK_METRICS[3], value: kids.reduce((acc, k) => acc + k.sectionsCompleted, 0) },
  ];
  // const realMetrics = [
  //   { value: kids.length },
  //   { value: kids.filter(k => k.status === Status.NEEDS_HELP).length },
  //   { ...MOCK_METRICS[2] },
  //   { ...MOCK_METRICS[3], value: kids.reduce((acc, k) => acc + k.sectionsCompleted, 0) },
  // ];

  // --- RENDERING LOGIC ---

  // 1. Show loader while checking localStorage
  if (isAuthChecking) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      );
  }

  // 2. Show Login Page if not authenticated
  if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
  }

  // 3. Show loading spinner if authenticated but fetching data
  if (isLoading && kids.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Loading AwanaPulse...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Welcome */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Overview of club performance and activities.</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {realMetrics.map((metric, index) => (
                <StatCard key={index} metric={metric} />
              ))}
            </div>

            {/* Middle Section: Charts & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Attendance */}
              <div className="lg:col-span-1 h-full">
                  <Card className="h-full flex flex-col border-slate-200 dark:border-transparent shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white dark:bg-slate-800">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                          <CardTitle className="text-base font-bold flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-emerald-500"/> Attendance
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-slate-500">
                             Month <ChevronDown className="ml-1 h-3 w-3"/>
                          </Button>
                      </div>
                      <CardContent className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-800">
                          <AttendanceChart isDarkMode={isDarkMode} />
                      </CardContent>
                  </Card>
              </div>

              {/* Chart 2: Points/Distribution */}
              <div className="lg:col-span-1 h-full">
                   <Card className="h-full flex flex-col border-slate-200 dark:border-transparent shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white dark:bg-slate-800">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                           <CardTitle className="text-base font-bold flex items-center gap-2">
                             <PieChart className="w-4 h-4 text-blue-500"/> Groups
                           </CardTitle>
                      </div>
                      <CardContent className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-800">
                        <GroupDistributionChart isDarkMode={isDarkMode} />
                      </CardContent>
                  </Card>
              </div>

              {/* Alerts / Tasks */}
              <div className="lg:col-span-1 h-full">
                  <Card className="h-full flex flex-col border-slate-200 dark:border-transparent shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white dark:bg-slate-800">
                       <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                          <CardTitle className="text-base font-bold">Recent Alerts</CardTitle>
                          <span className="flex h-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 px-2 text-xs font-bold text-red-600 dark:text-red-400">2 New</span>
                      </div>
                      
                      <CardContent className="flex-1 flex flex-col gap-4 p-6 bg-white dark:bg-slate-800">
                          {MOCK_ALERTS.map(alert => (
                              <div key={alert.id} className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                                  <div className="flex justify-between items-start">
                                      <h4 className="text-sm font-semibold group-hover:text-blue-600 transition-colors">{alert.title}</h4>
                                      <span className={cn(
                                          "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md font-bold",
                                          alert.severity === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                      )}>
                                          {alert.severity}
                                      </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                              </div>
                          ))}
                          <Button variant="ghost" className="mt-auto w-full text-xs text-muted-foreground hover:text-primary border border-dashed border-slate-200 dark:border-slate-700">
                              View All Alerts →
                          </Button>
                      </CardContent>
                  </Card>
              </div>
            </div>

            {/* Bottom Section: Roster */}
            <RosterTable kids={kids} onDataChange={fetchKids} />
          </div>
        );
      case 'clubbers':
        return <ClubbersPage kids={kids} onDataChange={fetchKids} />;
      case 'scripture':
        return <ScripturePage kids={kids} />;
      case 'games':
        return <GamesPage />;
      case 'leaderboard':
        return <LeaderboardPage kids={kids} />;
      case 'settings':
        return <SettingsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} onLogout={handleLogout} />;
      case 'volunteers':
        return <VolunteersPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans transition-colors duration-300">
      <AddClubberModal 
        isOpen={isAddClubberModalOpen} 
        onClose={() => setIsAddClubberModalOpen(false)} 
        onSuccess={fetchKids}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
           <div className="absolute left-0 top-0 h-full w-64 shadow-2xl" onClick={e => e.stopPropagation()}>
             <Sidebar 
               activeTab={activeTab} 
               setActiveTab={(tab) => {
                 setActiveTab(tab);
                 setMobileMenuOpen(false);
               }}
               isMobile={true}
               onLogout={handleLogout}
             />
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Welcome Back, Sarah</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button 
                variant="secondary"
                onClick={handleGenerateInsight}
                className="hidden md:flex gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
            >
                <Sparkles className="h-4 w-4" />
                <span className="hidden xl:inline">Ask AI Coach</span>
                <span className="inline xl:hidden">AI Coach</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
            </Button>
            
            <Button onClick={() => setIsAddClubberModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Add Clubber</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
            
          {/* AI Insight Modal/Panel */}
          {showAIInsights && (
             <div className="mb-8 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 relative shadow-sm">
                 <Button variant="ghost" size="sm" onClick={() => setShowAIInsights(false)} className="absolute top-2 right-2 h-8 w-8 p-0">
                     <span className="sr-only">Close</span>
                     ×
                 </Button>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-indigo-900 dark:text-indigo-300">AI Coach Insights</h3>
                        {loadingInsight ? (
                            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                <span className="text-sm">Analyzing roster performance...</span>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {insightText}
                            </div>
                        )}
                    </div>
                 </div>
             </div>
          )}

          {renderContent()}

        </div>
      </main>
    </div>
  );
};

export default App;