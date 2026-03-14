import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, BookOpen, Gamepad2, Clock, User, Mail, GraduationCap, Crown, Sparkles, Shirt, X, Search, ChevronRight, PenTool, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input } from './ui';
import { Kid, ClubGroup } from '../types';
import { ViewProfileModal } from './ActionModals';
import { Backend } from '../services/backend';

interface LeaderboardPageProps {
  kids: Kid[];
}

interface ScoreTotals {
  [key: string]: {
    total_dressing_credits: number;
    total_attendance_credit: number;
    total_punctuality_credit: number;
    total_handbook_credit: number;
    total_assignment_credit: number;
    total_invitation_credit: number;
    total_academic_credit: number;
    total_game_time_credit: number;
  };
}

interface CategoryRanking {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  text: string;
  iconColor: string;
  scoreKey: string;
  rankings: Array<{
    rank: number;
    kid: Kid;
    score: number;
  }>;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ kids }) => {
  const [isFullLeaderboardOpen, setIsFullLeaderboardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [scoreTotals, setScoreTotals] = useState<ScoreTotals>({});
  const [selectedCategory, setSelectedCategory] = useState<CategoryRanking | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [fullboardGroupFilter, setFullboardGroupFilter] = useState<string>('all');
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('all');

  // Get unique groups for filter dropdowns
  const uniqueGroups = Array.from(new Set(kids.map(k => k.group_name))).filter(Boolean).sort();

  // Filter functions for each table
  const filterKids = (kidsToFilter: Kid[], groupFilter: string): Kid[] => {
    let filtered = kidsToFilter;
    if (groupFilter !== 'all') {
      filtered = filtered.filter(k => k.group_name === groupFilter);
    }
    return filtered;
  };

  const filterAndSearchKids = (kidsToFilter: Kid[], search: string, groupFilter: string): Kid[] => {
    let filtered = kidsToFilter;
    
    if (groupFilter !== 'all') {
      filtered = filtered.filter(k => k.group_name === groupFilter);
    }
    
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(k => 
        `${k.firstname} ${k.lastname}`.toLowerCase().includes(searchLower) ||
        k.group_name?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    const fetchScoreTotals = async () => {
      const totals = await Backend.getClubbersScoreTotals();
      const scoreMap: ScoreTotals = {};
      totals.forEach((item: any) => {
        scoreMap[item.clubber_id] = {
          total_dressing_credits: item.total_dressing_credits || 0,
          total_attendance_credit: item.total_attendance_credit || 0,
          total_punctuality_credit: item.total_punctuality_credit || 0,
          total_handbook_credit: item.total_handbook_credit || 0,
          total_assignment_credit: item.total_assignment_credit || 0,
          total_invitation_credit: item.total_invitation_credit || 0,
          total_academic_credit: item.total_academic_credit || 0,
          total_game_time_credit: item.total_game_time_credit || 0,
        };
      });
      setScoreTotals(scoreMap);
    };

    fetchScoreTotals();
  }, []);

  // Sort kids by points for the leaderboard
  const sortedKids = [...kids].sort((a, b) => b.points - a.points);
  const top3 = sortedKids.slice(0, 3);
  const runnersUp = sortedKids.slice(3);
  const previewRunnersUp = runnersUp.slice(0, 5); // Show top 5 runners up on the dashboard

  // Build category rankings based on score totals
  const getCategoryRankings = (scoreKey: string): Array<{ rank: number; kid: Kid; score: number }> => {
    return kids
      .map(kid => ({
        kid,
        score: scoreTotals[kid.id]?.[scoreKey as keyof ScoreTotals[string]] || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        rank: index + 1,
        kid: item.kid,
        score: item.score,
      }));
  };

  // Mock Categories for display
  const CATEGORIES: CategoryRanking[] = [
    { 
      id: 'handbook', 
      label: 'Bible Scholar', 
      subtitle: 'Most Verses', 
      icon: BookOpen, 
      color: 'from-blue-500 to-indigo-600', 
      text: 'text-blue-50', 
      iconColor: 'text-blue-200',
      scoreKey: 'total_handbook_credit',
      rankings: getCategoryRankings('total_handbook_credit')
    },
    { 
      id: 'games', 
      label: 'Game MVP', 
      subtitle: 'Highest Game Score', 
      icon: Gamepad2, 
      color: 'from-purple-500 to-fuchsia-600', 
      text: 'text-purple-50', 
      iconColor: 'text-purple-200',
      scoreKey: 'total_game_time_credit',
      rankings: getCategoryRankings('total_game_time_credit')
    },
    { 
      id: 'uniform', 
      label: 'Sharp Dressed', 
      subtitle: 'Uniform Inspection', 
      icon: Shirt, 
      color: 'from-rose-500 to-pink-600', 
      text: 'text-rose-50', 
      iconColor: 'text-rose-200',
      scoreKey: 'total_dressing_credits',
      rankings: getCategoryRankings('total_dressing_credits')
    },
    { 
      id: 'attendance', 
      label: 'Perfect Presence', 
      subtitle: '100% Attendance', 
      icon: Clock, 
      color: 'from-emerald-500 to-teal-600', 
      text: 'text-emerald-50', 
      iconColor: 'text-emerald-200',
      scoreKey: 'total_attendance_credit',
      rankings: getCategoryRankings('total_attendance_credit')
    },
    { 
      id: 'punctuality', 
      label: 'Early Bird', 
      subtitle: 'Always On Time', 
      icon: Clock, 
      color: 'from-teal-500 to-green-600', 
      text: 'text-teal-50', 
      iconColor: 'text-teal-200',
      scoreKey: 'total_punctuality_credit',
      rankings: getCategoryRankings('total_punctuality_credit')
    },
    { 
      id: 'invite', 
      label: 'Evangelist', 
      subtitle: 'Most Visitors', 
      icon: Mail, 
      color: 'from-amber-500 to-orange-600', 
      text: 'text-amber-50', 
      iconColor: 'text-amber-200',
      scoreKey: 'total_invitation_credit',
      rankings: getCategoryRankings('total_invitation_credit')
    },
    { 
      id: 'assignment', 
      label: 'Task Master', 
      subtitle: 'Homework Hero', 
      icon: PenTool, 
      color: 'from-violet-500 to-purple-600', 
      text: 'text-violet-50', 
      iconColor: 'text-violet-200',
      scoreKey: 'total_assignment_credit',
      rankings: getCategoryRankings('total_assignment_credit')
    },
    { 
      id: 'academic', 
      label: 'Brainiac', 
      subtitle: 'Book Completion', 
      icon: GraduationCap, 
      color: 'from-cyan-500 to-sky-600', 
      text: 'text-cyan-50', 
      iconColor: 'text-cyan-200',
      scoreKey: 'total_academic_credit',
      rankings: getCategoryRankings('total_academic_credit')
    },
  ];

  // Filter for the modal
  const filteredKids = sortedKids.filter(kid => 
    `${kid.firstname} ${kid.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kid.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
      const headers = ['Rank', 'Name', 'Group', 'Points', 'ID'];
      const csvContent = [
          headers.join(','),
          ...filteredKids.map(kid => {
               const rank = sortedKids.findIndex(k => k.id === kid.id) + 1;
               return [
                  rank,
                  `"${kid.firstname} ${kid.lastname}"`,
                  kid.group_name,
                  kid.points,
                  kid.id
              ].join(',')
          })
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `leaderboard_${new Date().toISOString().split('T')[0]}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  return (
    <div className="space-y-10 pb-10">
       <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Leaderboard</h2>
        <p className="text-muted-foreground">
          Celebrate the achievements and hard work of our clubbers.
        </p>
      </div>

      {/* --- TOP 3 PODIUM --- */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl -z-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-6 items-end max-w-5xl mx-auto px-4">
            
            {/* 2nd Place */}
            <div className="order-2 md:order-1 relative group cursor-pointer" onClick={() => setSelectedKid(top3[1])}>
                <div className="absolute inset-x-4 top-10 bottom-0 bg-slate-200 dark:bg-slate-700 rounded-t-3xl shadow-xl transform translate-y-4"></div>
                <div className="relative bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl shadow-2xl border-t-4 border-slate-400 text-center transform transition-transform group-hover:-translate-y-2">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-slate-700">2</div>
                    <div className="mb-4 relative inline-block">
                        <img src={top3[1]?.avatarUrl} alt="2nd" className="w-20 h-20 rounded-full border-4 border-slate-400 shadow-md object-cover" />
                        <Medal className="absolute -bottom-2 -right-2 w-8 h-8 text-slate-500 drop-shadow-md" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">{top3[1] ? `${top3[1].firstname} ${top3[1].lastname}` : ''}</h3>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{top3[1]?.points.toLocaleString()} pts</p>
                    <div className="mt-4 h-16 w-full bg-slate-400/10 rounded-lg flex flex-col justify-center">
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Runner Up</span>
                    </div>
                </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 relative z-10 group cursor-pointer" onClick={() => setSelectedKid(top3[0])}>
                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 dark:opacity-10 rounded-full"></div>
                <div className="relative bg-gradient-to-b from-yellow-100 to-amber-200 dark:from-amber-900/80 dark:to-yellow-900/80 p-8 rounded-2xl shadow-2xl border-t-4 border-yellow-400 text-center transform scale-110 transition-transform group-hover:scale-115">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <Crown className="w-12 h-12 text-yellow-500 fill-yellow-400 drop-shadow-lg animate-bounce" />
                     </div>
                     <div className="mt-6 mb-4 relative inline-block">
                        <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse opacity-50 blur-md"></div>
                        <img src={top3[0]?.avatarUrl} alt="1st" className="relative w-28 h-28 rounded-full border-4 border-yellow-400 shadow-xl object-cover" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                            CHAMPION
                        </div>
                    </div>
                    <h3 className="font-bold text-2xl text-yellow-900 dark:text-yellow-100 mt-2">{top3[0] ? `${top3[0].firstname} ${top3[0].lastname}` : ''}</h3>
                    <p className="text-yellow-800 dark:text-yellow-200 font-bold text-xl">{top3[0]?.points.toLocaleString()} pts</p>
                    <div className="mt-6 flex justify-center gap-2">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 border-0 text-white"><Star size={12} className="mr-1 fill-white"/> All Star</Badge>
                    </div>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 relative group cursor-pointer" onClick={() => setSelectedKid(top3[2])}>
                 <div className="absolute inset-x-4 top-10 bottom-0 bg-orange-200 dark:bg-orange-900/30 rounded-t-3xl shadow-xl transform translate-y-4"></div>
                 <div className="relative bg-gradient-to-b from-orange-50 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 p-6 rounded-2xl shadow-2xl border-t-4 border-orange-400 text-center transform transition-transform group-hover:-translate-y-2">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-orange-900">3</div>
                    <div className="mb-4 relative inline-block">
                        <img src={top3[2]?.avatarUrl} alt="3rd" className="w-20 h-20 rounded-full border-4 border-orange-400 shadow-md object-cover" />
                        <Medal className="absolute -bottom-2 -right-2 w-8 h-8 text-orange-500 drop-shadow-md" />
                    </div>
                    <h3 className="font-bold text-xl text-orange-900 dark:text-orange-100">{top3[2] ? `${top3[2].firstname} ${top3[2].lastname}` : ''}</h3>
                    <p className="text-orange-800 dark:text-orange-200 font-medium">{top3[2]?.points.toLocaleString()} pts</p>
                    <div className="mt-4 h-16 w-full bg-orange-400/10 rounded-lg flex flex-col justify-center">
                        <span className="text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">Bronze</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- CATEGORY CHAMPIONS --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 px-1">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Sparkles size={20} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Category Champions</h3>
                <p className="text-sm text-gray-500">Top performers in specific credit areas</p>
             </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const winner = cat.rankings[0];
              return (
                <div key={cat.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.color} p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`} onClick={() => setSelectedCategory(cat)}>
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity transform group-hover:scale-110">
                        <cat.icon size={48} className="text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm">
                                <cat.icon size={18} className="text-white" />
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm leading-tight text-white`}>{cat.label}</h4>
                                <p className={`text-[10px] ${cat.text} opacity-90`}>{cat.subtitle}</p>
                            </div>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-3 bg-black/10 rounded-xl p-2 backdrop-blur-sm">
                            <img src={winner?.kid.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white/50 shrink-0" alt={winner ? `${winner.kid.firstname} ${winner.kid.lastname}` : ''} />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{winner?.kid.firstname}</p>
                                <p className="text-[10px] text-white/80 font-mono">+{winner?.score || 0} pts</p>
                            </div>
                        </div>
                    </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* --- RANKING TABLE PREVIEW --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        
          {/* Header */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Overall Standings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Performance rankings (Top 5 Runners-up)</p>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">{kids.length} Active Clubbers</Badge>
          </div>

          {/* Filter */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2">
            <select 
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm"
            >
              <option value="all">All Groups</option>
              {uniqueGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                          <th className="px-6 py-4 text-center w-[80px]">Rank</th>
                          <th className="px-6 py-4">Clubber</th>
                          <th className="px-6 py-4">Group</th>
                          <th className="px-6 py-4 text-right">Total Points</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filterKids(previewRunnersUp, groupFilter).length > 0 ? (
                        filterKids(previewRunnersUp, groupFilter).map((kid) => {
                          const actualRank = runnersUp.indexOf(kid) + 4;
                          return (
                          <tr key={kid.id} className="group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => setSelectedKid(kid)}>
                              <td className="px-6 py-4 text-center font-mono text-muted-foreground font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {actualRank}
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className="relative shrink-0">
                                        <img src={kid.avatarUrl} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm transition-transform group-hover:scale-105" />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 bg-slate-400`}></div>
                                      </div>
                                      <div>
                                        <span className="block font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{kid.firstname} {kid.lastname}</span>
                                        <span className="block text-xs text-slate-500">ID: #{String(kid.id).padStart(3, '0')}</span>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 group-hover:border-blue-200 transition-colors">
                                    {kid.group_name}
                                  </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="font-bold text-slate-900 dark:text-white tabular-nums bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg inline-block text-sm">
                                    {kid.points.toLocaleString()}
                                  </div>
                              </td>
                          </tr>
                          );
                        })
                      ) : (
                          <tr>
                              <td colSpan={4} className="text-center py-6 text-muted-foreground">No runners-up yet.</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-center">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setIsFullLeaderboardOpen(true)}>
                View Full Leaderboard <ChevronRight size={16} />
            </Button>
          </div>
      </div>

      {/* --- FULL LEADERBOARD MODAL --- */}
      {isFullLeaderboardOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Trophy size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Full Leaderboard</h2>
                            <p className="text-sm text-blue-100">Official ranking of all clubbers</p>
                        </div>
                    </div>
                    <button onClick={() => setIsFullLeaderboardOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"><X size={20} /></button>
                </div>
                
                <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex gap-2 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                            placeholder="Search clubber name..." 
                            className="pl-9 bg-white dark:bg-slate-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                      value={fullboardGroupFilter}
                      onChange={(e) => setFullboardGroupFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm"
                    >
                      <option value="all">All Groups</option>
                      {uniqueGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                     <button 
                        onClick={handleExport}
                        className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800" 
                        title="Export CSV"
                    >
                        <Download size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-0">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-slate-800 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="w-[80px] text-center font-bold">Rank</TableHead>
                                <TableHead className="font-bold">Clubber</TableHead>
                                <TableHead className="font-bold">Group</TableHead>
                                <TableHead className="text-right font-bold pr-8">Total Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterAndSearchKids(sortedKids, searchTerm, fullboardGroupFilter).map((kid) => {
                                // Find actual rank in sorted array
                                const actualRank = sortedKids.findIndex(k => k.id === kid.id) + 1;
                                const isPodium = actualRank <= 3;
                                
                                return (
                                <TableRow key={kid.id} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${isPodium ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`} onClick={() => setSelectedKid(kid)}>
                                    <TableCell className="text-center">
                                        <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                            actualRank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                            actualRank === 2 ? 'bg-slate-300 text-slate-800' :
                                            actualRank === 3 ? 'bg-orange-300 text-orange-900' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                            {actualRank}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <img src={kid.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-blue-300 transition-colors" />
                                                {isPodium && (
                                                    <Crown size={12} className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                                                )}
                                            </div>
                                            <div>
                                                <span className={`block font-semibold ${isPodium ? 'text-gray-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{kid.firstname} {kid.lastname}</span>
                                                <span className="text-xs text-muted-foreground">ID: #{String(kid.id).padStart(3, '0')}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-white dark:bg-slate-900 group-hover:border-blue-200 transition-colors">
                                            {kid.group_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <span className={`font-bold tabular-nums text-lg ${isPodium ? 'text-yellow-700 dark:text-yellow-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {kid.points.toLocaleString()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            {filterAndSearchKids(sortedKids, searchTerm, fullboardGroupFilter).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        {searchTerm || fullboardGroupFilter !== 'all' 
                                          ? `No clubbers found matching your filters` 
                                          : 'No clubbers yet'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
                    <Button onClick={() => setIsFullLeaderboardOpen(false)}>Close Leaderboard</Button>
                </div>
            </div>
        </div>
      )}

      {/* Detail Modal */}
      <ViewProfileModal 
            isOpen={!!selectedKid} 
            onClose={() => setSelectedKid(null)} 
            kid={selectedKid || undefined} 
      />

      {/* Category Rankings Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <selectedCategory.icon size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{selectedCategory.label}</h2>
                            <p className="text-sm text-blue-100">{selectedCategory.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"><X size={20} /></button>
                </div>

                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2">
                  <select 
                    value={categoryGroupFilter}
                    onChange={(e) => setCategoryGroupFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm"
                  >
                    <option value="all">All Groups</option>
                    {uniqueGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-1 p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                                <th className="px-6 py-4 text-center w-[80px]">Rank</th>
                                <th className="px-6 py-4">Clubber</th>
                                <th className="px-6 py-4">Group</th>
                                <th className="px-6 py-4 text-right pr-8">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {selectedCategory && filterKids(selectedCategory.rankings.map(r => r.kid), categoryGroupFilter).length > 0 ? (
                              selectedCategory.rankings
                                .filter(item => categoryGroupFilter === 'all' || item.kid.group_name === categoryGroupFilter)
                                .map((item, index) => (
                                <tr key={item.kid.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedKid(item.kid); setSelectedCategory(null); }}>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                            item.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                            item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                                            item.rank === 3 ? 'bg-orange-300 text-orange-900' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                            {item.rank}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <img src={item.kid.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-blue-300 transition-colors" />
                                                {item.rank <= 3 && (
                                                    <Crown size={12} className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                                                )}
                                            </div>
                                            <div>
                                                <span className={`block font-semibold text-slate-700 dark:text-slate-200`}>{item.kid.firstname} {item.kid.lastname}</span>
                                                <span className="text-xs text-muted-foreground">ID: #{String(item.kid.id).padStart(3, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="bg-white dark:bg-slate-900 group-hover:border-blue-200 transition-colors">
                                            {item.kid.group_name}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-8">
                                        <span className={`font-bold tabular-nums text-lg text-slate-700 dark:text-slate-200`}>
                                            {item.score}
                                        </span>
                                    </td>
                                </tr>
                              ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-muted-foreground">
                                        No scores recorded yet for this category
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
                    <Button onClick={() => setSelectedCategory(null)}>Close</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;