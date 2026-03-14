import React, { useState, useMemo } from 'react';
import { BookOpen, CheckCircle2, Award, Book, Star, Search, ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Kid, ClubGroup } from '../types';
import { GROUP_COLORS } from '../constants';
import { cn } from '../lib/utils';

interface ScripturePageProps {
  kids: Kid[];
}

const ITEMS_PER_PAGE = 10;

const ScripturePage: React.FC<ScripturePageProps> = ({ kids }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filter & Sort Logic ---
  const processedKids = useMemo(() => {
    let result = [...kids];

    // Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (k) =>
          `${k.firstname} ${k.lastname}`.toLowerCase().includes(lowerTerm) ||
          k.group_name.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Kid];
        let bValue: any = b[sortConfig.key as keyof Kid];

        // Handle specific keys if they aren't direct properties or need special handling
        if (sortConfig.key === 'progress') {
            aValue = a.sectionsCompleted;
            bValue = b.sectionsCompleted;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [kids, searchTerm, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(processedKids.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedKids = processedKids.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-2 text-slate-400 opacity-50 group-hover:opacity-100" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="ml-2 text-blue-600" /> : 
      <ArrowDown size={14} className="ml-2 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Scripture Tracking</h2>
        <p className="text-muted-foreground">
          Monitor handbook progress and verse memorization across all groups.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Handbook Stats - Colored Gradient Border Card */}
        <div className="col-span-1 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg">
            <div className="h-full rounded-[11px] bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800">
                            <Book className="h-6 w-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Handbook Stats</h3>
                            <p className="text-xs text-gray-500">Overall completion rates</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Spark
                                </span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">65%</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
                                <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Flame
                                </span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">42%</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Cubby
                                </span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">80%</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
                                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Achievements - Vibrant Card */}
        <div className="col-span-1 md:col-span-2 rounded-xl bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/20 border border-amber-200/60 dark:border-amber-800/50 p-6 shadow-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg text-white shadow-md">
                            <Award className="h-6 w-6"/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">Recent Awards</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300/80">Badges and ranks earned this week</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Total: 15 Awards
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    {[0,1,2,3,4].map((i) => {
                        const kid = kids[i] || { firstname: 'Clubber', lastname: '', group: ClubGroup.SPARK };
                        const firstName = (kid.firstname || 'Clubber').split(' ')[0];
                        return (
                        <div key={i} className="flex items-center space-x-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3 pr-5 hover:bg-white dark:hover:bg-black/40 hover:scale-105 transition-all shadow-sm cursor-default">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-white shadow-md border-2 border-white/50">
                                <Star className="h-5 w-5 fill-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Rank {i + 1}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{firstName}</p>
                            </div>
                        </div>
                    )})}
                </div>
             </div>
             <Award className="absolute -right-6 -bottom-6 h-40 w-40 text-amber-500/10 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
        </div>
      </div>
      
      {/* Detailed Progress Table - Custom Styled */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                 <CheckCircle2 className="text-emerald-500" size={20} />
                 Individual Progress
              </h3>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or group..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
          </div>
          
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500 font-bold tracking-wider">
                    <tr>
                        <th 
                            className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center">
                                Name
                                {getSortIcon('name')}
                            </div>
                        </th>
                        <th 
                            className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            onClick={() => handleSort('group')}
                        >
                            <div className="flex items-center">
                                Group
                                {getSortIcon('group')}
                            </div>
                        </th>
                        <th className="px-6 py-4">Current Handbook</th>
                        <th 
                            className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            onClick={() => handleSort('progress')}
                        >
                             <div className="flex items-center">
                                Section Progress
                                {getSortIcon('progress')}
                            </div>
                        </th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {displayedKids.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No clubbers found.
                            </td>
                        </tr>
                    ) : (
                    displayedKids.map(kid => (
                        <tr key={kid.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shadow-inner">
                                        {`${kid.firstname} ${kid.lastname}`.substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{kid.firstname} {kid.lastname}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm" style={{ backgroundColor: GROUP_COLORS[kid.group_name] }}>
                                    {kid.group_name}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-2 font-medium">
                                    <BookOpen size={16} className="text-blue-500" />
                                    Book {Math.floor(parseInt(kid.id) % 3) + 1}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-24 border border-slate-200 dark:border-slate-600">
                                        <div 
                                            className={`h-full rounded-full ${kid.sectionsCompleted > 10 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-slate-300 dark:bg-slate-500'}`} 
                                            style={{ width: `${Math.min(100, (kid.sectionsCompleted / 20) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">{Math.round((kid.sectionsCompleted / 20) * 100)}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {kid.sectionsCompleted > 10 ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Completed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        In Progress
                                    </span>
                                )}
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, processedKids.length)} of {processedKids.length} entries
                </span>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                     .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                     .map((page, i, arr) => (
                        <React.Fragment key={page}>
                            {i > 0 && arr[i-1] !== page - 1 && <span className="text-slate-400">...</span>}
                            <button
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                    currentPage === page
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ScripturePage;