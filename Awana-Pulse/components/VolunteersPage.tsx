import React, { useState, useMemo } from 'react';
import { Mail, Phone, Search, Filter, Plus, X, MoreHorizontal, Edit, Trash2, Shield, User, Download } from 'lucide-react';
import { Badge } from './ui';
import { cn } from '../lib/utils';

const VOLUNTEERS = [
  { id: 1, name: 'Sarah Miller', role: 'Director', email: 'sarah@awana.org', phone: '555-0123', status: 'Active', team: 'All' },
  { id: 2, name: 'Mike Ross', role: 'Game Director', email: 'mike@awana.org', phone: '555-0124', status: 'Active', team: 'Games' },
  { id: 3, name: 'Jessica Pearson', role: 'Secretary', email: 'jessica@awana.org', phone: '555-0125', status: 'On Leave', team: 'Admin' },
  { id: 4, name: 'Rachel Zane', role: 'Spark Leader', email: 'rachel@awana.org', phone: '555-0126', status: 'Active', team: 'Spark' },
  { id: 5, name: 'Harvey Specter', role: 'Flame Leader', email: 'harvey@awana.org', phone: '555-0127', status: 'Active', team: 'Flame' },
];

const AddVolunteerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Volunteer</h2>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" /></button>
                </div>
                <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                         <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" placeholder="e.g. John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Role</label>
                             <div className="relative">
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none appearance-none">
                                    <option>Leader</option>
                                    <option>Director</option>
                                    <option>Secretary</option>
                                    <option>Game Director</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                             </div>
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Team</label>
                              <div className="relative">
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none appearance-none">
                                    <option>All</option>
                                    <option>Cubby</option>
                                    <option>Spark</option>
                                    <option>Flame</option>
                                    <option>Torch</option>
                                    <option>Games</option>
                                    <option>Admin</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                             </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                         <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" placeholder="john@example.com" />
                    </div>
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Phone</label>
                         <input type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" placeholder="(555) 555-5555" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">Add Volunteer</button>
                    </div>
                </form>
             </div>
        </div>
    )
}

const VolunteersPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTeamFilter, setActiveTeamFilter] = useState('All');

  // --- Filter Logic ---
  const filteredVolunteers = useMemo(() => {
    return VOLUNTEERS.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              v.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = activeTeamFilter === 'All' || v.team === activeTeamFilter;
        return matchesSearch && matchesTeam;
    });
  }, [searchQuery, activeTeamFilter]);

  // --- Export Logic ---
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Role', 'Email', 'Phone', 'Status', 'Team'];
    const csvContent = [
        headers.join(','),
        ...filteredVolunteers.map(v => [
            v.id,
            `"${v.name}"`,
            `"${v.role}"`,
            v.email,
            v.phone,
            v.status,
            v.team
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `volunteers_list_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Volunteers</h2>
        <p className="text-muted-foreground">
          Manage your leadership team and assignments.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Staff Directory</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and manage active volunteers</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-start sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search staff..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600" 
                        />
                    </div>
                    
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 border rounded-xl transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-600 text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700'}`} 
                        title="Filter"
                    >
                        <Filter size={18} />
                    </button>
                    
                    <button 
                        onClick={handleExport}
                        className="p-2 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 transition-colors" title="Export"
                    >
                        <Download size={18} />
                    </button>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Volunteer
                    </button>
                </div>
            </div>

            {/* Expandable Filter Bar */}
            {showFilters && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {['All', 'Cubby', 'Spark', 'Flame', 'Torch', 'Games', 'Admin'].map(team => (
                        <button
                            key={team}
                            onClick={() => setActiveTeamFilter(team)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                activeTeamFilter === team 
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            {team}
                        </button>
                    ))}
                    <button 
                         onClick={() => { setSearchQuery(''); setActiveTeamFilter('All'); }}
                         className="ml-auto text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
                    >
                        <X size={12} /> Clear Filters
                    </button>
                </div>
            )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredVolunteers.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No volunteers found matching filters.
                    </td>
                </tr>
              ) : (
              filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                            {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-slate-900 dark:text-white font-semibold">{volunteer.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Shield size={14} className="text-slate-400" />
                        {volunteer.role}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        {volunteer.team}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                            <Mail size={12} /> {volunteer.email}
                        </div>
                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                            <Phone size={12} /> {volunteer.phone}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        volunteer.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${volunteer.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-center">
             <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">View All Staff</button>
        </div>
      </div>

      <AddVolunteerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default VolunteersPage;