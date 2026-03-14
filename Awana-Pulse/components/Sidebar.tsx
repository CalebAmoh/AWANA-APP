import React from 'react';
import { LayoutGrid, Users, BookOpen, Gamepad2, Trophy, Settings, LogOut, HeartHandshake } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile = false, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'clubbers', label: 'Clubbers', icon: Users },
    { id: 'scripture', label: 'Scripture', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <aside 
        className={`w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex-col transition-all duration-300 ${
            isMobile ? 'h-full flex' : 'hidden md:flex sticky top-0 h-screen'
        }`}
    >
      {/* Logo Area - Fixed at top */}
      <div className="p-8 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/20">
            A
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AwanaPulse</span>
        </div>
      </div>

      {/* Main Menu - Scrollable Area */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
        
        <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'settings' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                <Settings size={20} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
                Settings
            </button>
            <button 
                onClick={() => setActiveTab('volunteers')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'volunteers' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                <HeartHandshake size={20} strokeWidth={activeTab === 'volunteers' ? 2.5 : 2} />
                Volunteers
            </button>
        </div>
      </nav>

      {/* User Profile (Bottom) - Fixed at bottom */}
      <div className="p-4 border-t border-slate-800 flex-shrink-0 bg-slate-900 pb-8 md:pb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors group">
          <img
            src="https://picsum.photos/100/100?random=99"
            alt="Director"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Sarah Miller</p>
            <p className="text-xs text-slate-400 truncate">Director</p>
          </div>
          <button onClick={onLogout} title="Sign Out">
            <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;