import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Kid, Status, ClubGroup } from '../types';
import { GROUP_COLORS } from '../constants';
import { MoreHorizontal, Filter, Search, Download, Edit, Eye, Mail, Trash2, Star, CheckSquare, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { CreditClubberModal, ViewProfileModal, MessageModal } from './ActionModals';
import AddClubberModal from './AddClubberModal';
import { Backend } from '../services/backend';

interface RosterTableProps {
  kids: Kid[];
  onDataChange?: () => void;
}

type ModalType = 'credit' | 'profile' | 'edit' | 'message' | 'delete' | null;

const ITEMS_PER_PAGE = 10;

// --- Delete Modal (Local to avoid circular deps) ---
const DeleteConfirmModal = ({ isOpen, onClose, kid, onConfirm }: { isOpen: boolean; onClose: () => void; kid: Kid | null; onConfirm: () => void }) => {
    if (!isOpen || !kid) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-slate-700 p-6 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} />
                </div>
                <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Delete Clubber?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{kid.firstname}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors w-full">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all w-full">Delete</button>
                </div>
            </div>
        </div>
    )
}

const RosterTable: React.FC<RosterTableProps> = ({ kids, onDataChange }) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  // --- Filtering & Sorting State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('All');
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);

  // Fix the refresh function to use the onDataChange callback
  const refreshClubbers = async () => {
    try {
      if (onDataChange) {
        await onDataChange(); // Call the parent's refresh function
      }
    } catch (error) {
      console.error('Error refreshing clubbers:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Filter Logic ---
  const filteredKids = useMemo(() => {
    return kids.filter(kid => {
        const matchesSearch = kid.firstname.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = activeGroupFilter === 'All' || kid.group_name === activeGroupFilter;
        return matchesSearch && matchesGroup;
    });
  }, [kids, searchQuery, activeGroupFilter]);


  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeGroupFilter]);

  
  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredKids.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedKids = filteredKids.slice(startIndex, endIndex);


  // --- Export Logic ---
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Group', 'Points', 'Sections', 'Attendance %', 'Status', 'Last Attended'];
    const csvContent = [
        headers.join(','),
        ...filteredKids.map(kid => [
            kid.id,
            `"${kid.firstname} ${kid.lastname}"`,
            kid.group,
            kid.points,
            kid.sectionsCompleted,
            `${kid.attendanceRate}%`,
            kid.status,
            kid.lastAttended
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `clubber_roster_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
      if (!selectedKid) return;
      try {
          await Backend.deleteKid(selectedKid.id);
          if (onDataChange) onDataChange();
          closeModals();
      } catch (e) {
          console.error("Delete failed", e);
          alert("Could not delete clubber");
      }
  };

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case Status.ON_TRACK: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case Status.AHEAD: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case Status.NEEDS_HELP: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case Status.NEW: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300';
    }
  };

  const toggleAction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionId(openActionId === id ? null : id);
  };

  const handleActionClick = (kid: Kid, type: ModalType) => {
      setSelectedKid(kid);
      setActiveModal(type);
      setOpenActionId(null);
  };

  const closeModals = () => {
      setActiveModal(null);
      setSelectedKid(null);
  }

  return (
    <>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Table Header / Toolbar */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Clubber Roster</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {filteredKids.length > 0 
                            ? `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredKids.length)} of ${filteredKids.length} clubbers`
                            : 'No clubbers found'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-start sm:items-center">
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search clubbers..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 border rounded-xl transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-600 text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700'}`} 
                            title="Filter"
                        >
                            <Filter size={18} />
                        </button>

                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-lg shadow-slate-900/20"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Expandable Filter Bar */}
            {showFilters && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {['All', ...Object.values(ClubGroup)].map(group => (
                        <button
                            key={group}
                            onClick={() => setActiveGroupFilter(group)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                activeGroupFilter === group 
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {group}
                        </button>
                    ))}
                    <button 
                         onClick={() => { setSearchQuery(''); setActiveGroupFilter('All'); }}
                         className="ml-auto text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
                    >
                        <X size={12} /> Clear Filters
                    </button>
                </div>
            )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4">Clubber Info</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Last Attended</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {displayedKids.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            No clubbers found matching your search.
                        </td>
                    </tr>
                ) : (
                displayedKids.map((kid) => (
                <tr key={kid.id} className="group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleActionClick(kid, 'profile')}
                        title="View Profile History"
                    >
                        <div className="relative shrink-0">
                            <img src={kid.avatarUrl} alt={kid.firstname} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm transition-transform group-hover:scale-105" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${kid.attendanceRate > 80 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        </div>
                        <div className="min-w-0">
                            <span className="block font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{kid.firstname} {kid.lastname}</span>
                            <span className="block text-xs text-slate-500">ID: #{kid.id}</span>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full border border-transparent shadow-sm" style={{ color: '#fff', backgroundColor: GROUP_COLORS[kid.group_name] }}>
                        {kid.group_name}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium tabular-nums">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            {kid.lastAttended}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                    <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md border border-transparent/10 whitespace-nowrap", getStatusStyle(kid.status))}>
                        {kid.status}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>{kid.sectionsCompleted} sects</span>
                            <span>{Math.round((kid.sectionsCompleted / 20) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${kid.sectionsCompleted > 10 ? 'bg-blue-500' : 'bg-blue-400'}`} style={{ width: `${(kid.sectionsCompleted / 20) * 100}%` }}></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white tabular-nums bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg inline-block text-sm">
                            {kid.points.toLocaleString()}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                    <button 
                        onClick={(e) => toggleAction(kid.id, e)}
                        className={`p-2 rounded-lg transition-colors ${openActionId === kid.id ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700'}`}
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Action Menu Dropdown */}
                    {openActionId === kid.id && (
                        <div ref={actionMenuRef} className="absolute right-8 top-12 z-50 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="p-1">
                                <button 
                                    onClick={() => handleActionClick(kid, 'credit')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-left font-medium"
                                >
                                    <Star size={16} /> Credit Clubber
                                </button>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-0"></div>
                            <div className="p-1">
                                <button 
                                    onClick={() => handleActionClick(kid, 'profile')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                                >
                                    <Eye size={16} className="text-slate-400" /> View Profile
                                </button>
                                <button 
                                    onClick={() => handleActionClick(kid, 'edit')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                                >
                                    <Edit size={16} className="text-slate-400" /> Edit Details
                                </button>
                                <button 
                                    onClick={() => handleActionClick(kid, 'message')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                                >
                                    <Mail size={16} className="text-slate-400" /> Message Parents
                                </button>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-0"></div>
                            <div className="p-1">
                                <button 
                                    onClick={() => handleActionClick(kid, 'delete')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-left"
                                >
                                    <Trash2 size={16} /> Delete Clubber
                                </button>
                            </div>
                        </div>
                    )}
                    </td>
                </tr>
                )))}
            </tbody>
            </table>
        </div>
        
        {/* Pagination Controls */}
        {filteredKids.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredKids.length)} of {filteredKids.length} entries
                </span>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        // Logic to show a limited number of pages could be added here for very large lists
                        <button
                            key={page}
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
        
        {/* Render Modals */}
        <CreditClubberModal 
            isOpen={activeModal === 'credit'} 
            onClose={closeModals} 
            kid={selectedKid} 
            onCreditsAdded={refreshClubbers}
        />
        <ViewProfileModal 
            isOpen={activeModal === 'profile'} 
            onClose={closeModals} 
            kid={selectedKid} 
        />
        <MessageModal 
            isOpen={activeModal === 'message'} 
            onClose={closeModals} 
            kid={selectedKid} 
        />
        <DeleteConfirmModal 
            isOpen={activeModal === 'delete'} 
            onClose={closeModals} 
            kid={selectedKid}
            onConfirm={handleDelete}
        />
        
        <AddClubberModal 
            isOpen={activeModal === 'edit'} 
            onClose={closeModals} 
            kid={selectedKid}
            onSuccess={onDataChange}
        />
    </>
  );
};

export default RosterTable;