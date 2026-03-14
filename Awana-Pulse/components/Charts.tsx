import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ATTENDANCE_DATA = [
  { name: 'Present', value: 85, color: '#10B981' },
  { name: 'Excused', value: 10, color: '#F59E0B' },
  { name: 'Absent', value: 5, color: '#EF4444' },
];

const GROUP_DISTRIBUTION = [
  { name: 'Cubby', value: 12, color: '#3B82F6' },
  { name: 'Spark', value: 18, color: '#EF4444' },
  { name: 'Flame', value: 10, color: '#10B981' },
  { name: 'Torch', value: 2, color: '#F59E0B' },
];

interface ChartProps {
  isDarkMode?: boolean;
}

export const AttendanceChart: React.FC<ChartProps> = ({ isDarkMode }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={ATTENDANCE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            stroke={isDarkMode ? '#1e293b' : '#fff'}
            strokeWidth={2}
          >
            {ATTENDANCE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: isDarkMode ? '#1e293b' : '#fff',
              color: isDarkMode ? '#f1f5f9' : '#111827'
            }} 
            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] text-center">
        <span className="block text-3xl font-bold text-gray-800 dark:text-white">85%</span>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Attendance</span>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {ATTENDANCE_DATA.map((item) => (
             <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{item.name}</span>
             </div>
        ))}
      </div>
    </div>
  );
};

export const GroupDistributionChart: React.FC<ChartProps> = ({ isDarkMode }) => {
    return (
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={GROUP_DISTRIBUTION}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              stroke={isDarkMode ? '#1e293b' : '#fff'}
              strokeWidth={2}
            >
              {GROUP_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                 contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    color: isDarkMode ? '#f1f5f9' : '#111827'
                 }} 
                 itemStyle={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-xs text-gray-500 dark:text-slate-400 font-medium ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };