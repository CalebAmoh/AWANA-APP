import React, { useState, useEffect } from 'react';
import RosterTable from './RosterTable';
import { Kid } from '../types';
import { Users, Calendar, UserPlus, AlertCircle, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Backend } from '../services/backend';

interface ClubbersPageProps {
  kids: Kid[];
  onDataChange?: () => void;
}

interface AttendanceStats {
  attendanceRate: number;
  totalClubbers: number;
  averageAttendanceCredit: number;
}

interface AttendanceTrend {
  isRising: boolean;
  percentageChange: number;
  currentWeekRate: number;
  previousWeekRate: number;
}

interface NewClubbersStats {
  newClubbersMonth: number;
  newClubbersWeek: number;
  newClubbersToday: number;
}

const ClubbersPage: React.FC<ClubbersPageProps> = ({ kids, onDataChange }) => {
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({ attendanceRate: 0, totalClubbers: 0, averageAttendanceCredit: 0 });
  const [attendanceTrend, setAttendanceTrend] = useState<AttendanceTrend>({ isRising: false, percentageChange: 0, currentWeekRate: 0, previousWeekRate: 0 });
  const [newClubbersStats, setNewClubbersStats] = useState<NewClubbersStats>({ newClubbersMonth: 0, newClubbersWeek: 0, newClubbersToday: 0 });
  const [clubbersNeedingHelp, setClubbersNeedingHelp] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [attendance, trend, newClubbers, needHelp] = await Promise.all([
        Backend.getAttendanceStats(),
        Backend.getAttendanceTrend(),
        Backend.getNewClubbers(),
        Backend.getClubbersNeedingHelp()
      ]);
      
      setAttendanceStats(attendance);
      setAttendanceTrend(trend);
      setNewClubbersStats(newClubbers);
      setClubbersNeedingHelp(needHelp);
      setLoading(false);
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Clubbers Management</h2>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage details for all registered clubbers.
        </p>
      </div>

      {/* Colorful Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Stat 1 - Total Active */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700 p-6 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/40">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users size={100} />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2 bg-white/20 w-fit rounded-lg mb-3 backdrop-blur-sm">
                <Users size={20} className="text-white" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Active</p>
              <h3 className="text-4xl font-extrabold tracking-tight">{kids.length}</h3>
            </div>
            <div className="mt-4 flex items-center text-blue-50 text-xs font-medium">
              <span className="bg-white/20 px-2 py-1 rounded-full mr-2 backdrop-blur-md flex items-center gap-1">
                 <Sparkles size={10} /> +{newClubbersStats.newClubbersWeek}
              </span>
              <span>this week</span>
            </div>
          </div>
        </div>

        {/* Stat 2 - Avg Attendance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-700 p-6 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calendar size={100} />
          </div>
           <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2 bg-white/20 w-fit rounded-lg mb-3 backdrop-blur-sm">
                <Calendar size={20} className="text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Attendance Rate</p>
              <h3 className="text-4xl font-extrabold tracking-tight">{loading ? '--' : attendanceStats.attendanceRate}%</h3>
            </div>
             <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                   Avg Rate
                </span>
              </div>
              {!loading && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  attendanceTrend.isRising 
                    ? 'bg-emerald-400/30 text-emerald-50' 
                    : 'bg-red-400/30 text-red-50'
                }`}>
                  {attendanceTrend.isRising ? (
                    <>
                      <TrendingUp size={12} />
                      +{Math.abs(attendanceTrend.percentageChange)}%
                    </>
                  ) : (
                    <>
                      <TrendingDown size={12} />
                      {attendanceTrend.percentageChange}%
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

         {/* Stat 3 - New Registrations */}
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700 p-6 text-white shadow-xl shadow-purple-500/30 transition-all hover:scale-[1.02] hover:shadow-purple-500/40">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserPlus size={100} />
          </div>
           <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2 bg-white/20 w-fit rounded-lg mb-3 backdrop-blur-sm">
                <UserPlus size={20} className="text-white" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">New Clubbers</p>
              <h3 className="text-4xl font-extrabold tracking-tight">{loading ? '--' : newClubbersStats.newClubbersMonth}</h3>
            </div>
             <div className="mt-4 flex items-center text-purple-50 text-xs font-medium">
              <span className="bg-white/20 px-2 py-1 rounded-full mr-2 backdrop-blur-md">
                 Active
              </span>
              <span>This month</span>
            </div>
          </div>
        </div>

         {/* Stat 4 - Needs Attention */}
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-amber-700 p-6 text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02] hover:shadow-orange-500/40">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle size={100} />
          </div>
           <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2 bg-white/20 w-fit rounded-lg mb-3 backdrop-blur-sm">
                <AlertCircle size={20} className="text-white" />
              </div>
              <p className="text-orange-100 text-sm font-medium mb-1">Needs Attention</p>
              <h3 className="text-4xl font-extrabold tracking-tight">{loading ? '--' : clubbersNeedingHelp.length}</h3>
            </div>
             <div className="mt-4 flex items-center text-orange-50 text-xs font-medium">
              <span className="bg-white/20 px-2 py-1 rounded-full mr-2 backdrop-blur-md">
                 Follow Up
              </span>
            </div>
          </div>
        </div>

      </div>

      <RosterTable kids={kids} onDataChange={onDataChange} />
    </div>
  );
};

export default ClubbersPage;