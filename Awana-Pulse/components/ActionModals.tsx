import React, { useState, useMemo, useEffect } from 'react';
import { X, Save, Send, Trash2, User, Star, Trophy, Clock, BookOpen, PenTool, Mail, GraduationCap, Gamepad2, Calendar, Shirt, UserPlus, CheckCircle2, MapPin, Phone, AlertCircle, Heart, School, Activity } from 'lucide-react';
import { Button, Input, Label, Textarea, Badge } from './ui';
import { Kid } from '../types';
import { Backend } from '../services/backend';

// --- Credit Modal ---
export const CreditClubberModal = ({ isOpen, onClose, kid, onCreditsAdded }: { isOpen: boolean; onClose: () => void; kid?: Kid; onCreditsAdded?: () => void }) => {
  const [credits, setCredits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  
  if (!isOpen || !kid) return null;
  
  const fields = [
      { label: 'Dressing Credit', icon: User, placeholder: 'Enter dressing credit', key: 'dressing' },
      { label: 'Attendance Credit', icon: Clock, placeholder: 'Credit class involvement', key: 'attendance' },
      { label: 'Punctuality Credit', icon: Clock, placeholder: 'Punctuality Credit', key: 'punctuality' },
      { label: 'Handbook Credit', icon: BookOpen, placeholder: 'Handbook Credit', key: 'handbook' },
      { label: 'Assignment Credit', icon: PenTool, placeholder: 'Assignment Credit', key: 'assignment' },
      { label: 'Invitation Credit', icon: Mail, placeholder: 'Inviting new clubbers', key: 'invitation' },
      { label: 'Academic Credit', icon: GraduationCap, placeholder: 'Academic Credit', key: 'academic' },
      { label: 'Game time Credit', icon: Gamepad2, placeholder: 'Game time Credit', key: 'gametime' },
  ];

  const handleInputChange = (key: string, value: string) => {
    setCredits({
      ...credits,
      [key]: value ? parseInt(value, 10) : 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use the Backend service to save credits
      const result = await Backend.saveCredits(kid.id, credits);
      
      if (result.success) {
        alert(result.message);
        // Reload clubbers data
        await Backend.getKids();
        onClose();
        // Call the callback to refresh data in parent component
        if (onCreditsAdded) {
          onCreditsAdded();
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving credits:', error);
      alert('Error saving credits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Credit Clubber</h2>
                <p className="text-sm text-gray-500">Scoring performance for <span className="font-semibold text-blue-600">{kid.firstname} {kid.lastname}</span></p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"><X size={20} /></button>
        </div>
        
        <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar" onSubmit={handleSubmit}>
           {fields.map(({ label, icon: Icon, placeholder, key }) => (
               <div key={key} className="space-y-2 group">
                   <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group-focus-within:text-blue-600 transition-colors">
                       <Icon size={14} className="text-gray-400 group-focus-within:text-blue-500" />
                       {label}
                   </Label>
                   <Input 
                        placeholder={placeholder} 
                        type="number" 
                        value={credits[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors" 
                   />
               </div>
           ))}
        </form>
        
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-end gap-3 sticky bottom-0 z-10">
             <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
             <Button type="submit" onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50">
                <Star size={16} className="fill-blue-400 text-blue-100" /> {loading ? 'Saving...' : 'Save Scores'}
             </Button>
        </div>
      </div>
    </div>
  );
};

// --- Message Modal ---
export const MessageModal = ({ isOpen, onClose, kid }: { isOpen: boolean; onClose: () => void; kid?: Kid }) => {
    if (!isOpen || !kid) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-lg font-bold">Message Parents</h2>
                <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <Label>To</Label>
                    <Input value={`Parents of ${kid.firstname}`} disabled className="bg-gray-100 dark:bg-slate-800 text-gray-500" />
                </div>
                <div>
                    <Label>Subject</Label>
                    <Input placeholder="Regarding attendance..." className="bg-white dark:bg-slate-900" />
                </div>
                <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Type your message here..." rows={4} className="bg-white dark:bg-slate-900" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="gap-2" onClick={onClose}><Send size={16} /> Send Message</Button>
                </div>
            </div>
        </div>
      </div>
    );
};

// --- View Profile Modal ---
const getMockHistory = (kid: Kid) => {
    const history = [];
    const categories = ['Attendance', 'Uniform', 'Handbook', 'Game', 'Visitor', 'Theme Night'];
    
    // Generate deterministic random data based on kid ID
    let seed = kid.id.toString().charCodeAt(0);
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7 + Math.floor(random() * 3)); // roughly weekly
      const cat = categories[Math.floor(random() * categories.length)];
      let points = 0;
      let desc = '';
      let icon = Star;
      let color = 'text-gray-500';
      
      switch(cat) {
          case 'Attendance': 
              points = 50; 
              desc = 'Weekly Club Attendance'; 
              icon = Clock;
              color = 'text-emerald-500';
              break;
          case 'Uniform': 
              points = 25; 
              desc = 'Full Uniform Worn'; 
              icon = Shirt;
              color = 'text-blue-500';
              break;
          case 'Handbook': 
              points = 100; 
              desc = `Completed Section ${Math.floor(random()*3) + 1}.${Math.floor(random()*5) + 1}`; 
              icon = BookOpen;
              color = 'text-purple-500';
              break;
          case 'Game': 
              points = 30; 
              desc = 'Team Win Bonus'; 
              icon = Gamepad2;
              color = 'text-orange-500';
              break;
          case 'Visitor': 
              points = 50; 
              desc = 'Brought a friend'; 
              icon = UserPlus;
              color = 'text-pink-500';
              break;
          case 'Theme Night': 
              points = 50; 
              desc = 'Special Event Participation'; 
              icon = Star;
              color = 'text-yellow-500';
              break;
      }
  
      history.push({
          id: i,
          date: date.toLocaleDateString(),
          category: cat,
          description: desc,
          points: points,
          icon,
          color
      });
    }
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const ViewProfileModal = ({ isOpen, onClose, kid }: { isOpen: boolean; onClose: () => void; kid?: Kid }) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'details'>('activity');
    
    // Hooks must be called unconditionally. 
    // We calculate personalDetails unconditionally, but handle missing kid gracefully.
    const personalDetails = useMemo(() => {
         if (!kid) return {
             gender: '', dob: '', age: 0, parentName: '', phone: '', email: '', address: '', allergies: '', school: '', emergencyContact: ''
         };

         const seed = kid.id.toString().charCodeAt(0) || 0;
         const gender = seed % 2 === 0 ? 'Male' : 'Female';
         const phone = `(555) ${100 + (seed % 900)}-${1000 + (seed * 5 % 9000)}`;
         
         const currentYear = new Date().getFullYear();
         let age = 10;
         if (kid.group_name === 'Cubby') age = 4;
         else if (kid.group_name === 'Spark') age = 6;
         else if (kid.group_name === 'Flame') age = 9;
         else if (kid.group_name === 'Torch') age = 12;
         
         const birthYear = currentYear - age;
         const dob = `Oct 15, ${birthYear}`;

         const lastName = kid.lastname;

         return {
             gender,
             dob,
             age,
             parentName: `Mr. & Mrs. ${lastName}`,
             phone,
             email: `parents.${lastName.toLowerCase()}@example.com`,
             address: `${100 + (seed % 500)} Maple Avenue, Springfield`,
             allergies: seed % 3 === 0 ? 'Peanuts, Shellfish' : 'None',
             school: 'Lincoln Elementary',
             emergencyContact: `Grandma ${lastName} - (555) 999-8888`
         };
    }, [kid]);

    if (!isOpen || !kid) return null;

    const history = getMockHistory(kid);
    const totalHistoryPoints = history.reduce((acc, curr) => acc + curr.points, 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"><X size={20} /></button>
                    <div className="absolute -bottom-12 left-4 md:left-8 flex items-end">
                        <img src={kid.avatarUrl} alt={`${kid.firstname} ${kid.lastname}`} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-md object-cover bg-white shrink-0" />
                        <div className="mb-12 ml-4">
                            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md truncate max-w-[200px] md:max-w-xs">{kid.firstname} {kid.lastname}</h2>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">{kid.group_name}</Badge>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mt-14 px-6 border-b border-gray-100 dark:border-slate-800 flex gap-6 shrink-0">
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'activity' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Activity & Stats
                        {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'details' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Personal Details
                        {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-slate-900/30">
                    
                    {activeTab === 'activity' ? (
                        <div className="p-6 md:p-8">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                                <div className="p-3 md:p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-sm">
                                    <span className="block text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{kid.points.toLocaleString()}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Points</span>
                                </div>
                                <div className="p-3 md:p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-sm">
                                    <span className="block text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{kid.attendanceRate}%</span>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
                                </div>
                                <div className="p-3 md:p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-sm">
                                    <span className="block text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{kid.sectionsCompleted}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Sections</span>
                                </div>
                            </div>

                            {/* History Table */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-blue-500" />
                                    Points History Breakdown
                                </h3>
                                <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left min-w-[500px]">
                                            <thead className="bg-gray-50 dark:bg-slate-800 text-xs uppercase text-gray-500 font-bold tracking-wider border-b border-gray-100 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Category</th>
                                                    <th className="px-4 py-3">Description</th>
                                                    <th className="px-4 py-3 text-right">Points</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                                {history.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.date}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                                <item.icon size={16} className={item.color} />
                                                                {item.category}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 min-w-[150px]">{item.description}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">+{item.points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
                            {/* Personal Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info Card */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                                        <User size={16} className="text-blue-500" /> Basic Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-gray-500 dark:text-slate-400">Gender</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{personalDetails.gender}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-gray-500 dark:text-slate-400">Date of Birth</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{personalDetails.dob} ({personalDetails.age} yrs)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-gray-500 dark:text-slate-400">School</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{personalDetails.school}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Family Contact Card */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                                        <Phone size={16} className="text-green-500" /> Family & Contact
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 block">Parents/Guardians</span>
                                            <span className="font-medium text-gray-900 dark:text-white block">{personalDetails.parentName}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 block">Phone Number</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400 block">{personalDetails.phone}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 block">Email</span>
                                            <span className="font-medium text-gray-900 dark:text-white block">{personalDetails.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Card */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                     <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                                        <MapPin size={16} className="text-purple-500" /> Address
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-slate-300">
                                        {personalDetails.address}
                                    </p>
                                </div>

                                {/* Medical Card */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                     <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                                        <Activity size={16} className="text-rose-500" /> Medical & Emergency
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 block">Allergies / Conditions</span>
                                            <span className={`font-medium ${personalDetails.allergies !== 'None' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'} block`}>
                                                {personalDetails.allergies}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 block">Emergency Contact</span>
                                            <span className="font-medium text-gray-900 dark:text-white block">{personalDetails.emergencyContact}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex justify-between items-center shrink-0">
                    <p className="text-xs text-gray-500">Member since Sept 2023</p>
                    <Button variant="outline" onClick={onClose}>Close Profile</Button>
                </div>
            </div>
        </div>
    )
}

// --- Delete Modal ---
export const DeleteClubberModal = ({ isOpen, onClose, kid }: { isOpen: boolean; onClose: () => void; kid?: Kid }) => {
    if (!isOpen || !kid) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-slate-700 p-6 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} />
                </div>
                <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Delete Clubber?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{kid.firstname} {kid.lastname}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose} className="w-full">Cancel</Button>
                    <Button variant="destructive" onClick={onClose} className="w-full">Delete</Button>
                </div>
            </div>
        </div>
    )
}