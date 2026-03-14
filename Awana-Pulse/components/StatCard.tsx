import React from 'react';
import { Metric } from '../types';
import { Users, AlertCircle, Calendar, Award, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  metric: Metric;
}

const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const getIcon = () => {
    switch (metric.iconName) {
      case 'users': return <Users size={24} />;
      case 'alert': return <AlertCircle size={24} />;
      case 'calendar': return <Calendar size={24} />;
      case 'award': return <Award size={24} />;
      default: return <Users size={24} />;
    }
  };

  const getTrendIcon = () => {
    if (metric.trend === 'up') return <ArrowUp size={14} className="mr-1" />;
    if (metric.trend === 'down') return <ArrowDown size={14} className="mr-1" />;
    return <Minus size={14} className="mr-1" />;
  };

  const getStyles = () => {
    switch (metric.color) {
      case 'green': return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
          border: 'border-l-emerald-500',
          trend: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
      };
      case 'red': return {
          iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
          border: 'border-l-rose-500',
          trend: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20'
      };
      case 'orange': return {
          iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
          border: 'border-l-amber-500',
          trend: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
      };
      case 'blue': return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
          border: 'border-l-blue-500',
          trend: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
      };
      default: return {
          iconBg: 'bg-slate-100 text-slate-600',
          border: 'border-l-slate-500',
          trend: 'text-slate-600'
      };
    }
  };

  const styles = getStyles();

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 ${styles.border} border-l-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{metric.label}</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metric.value}</p>
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex items-center">
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${styles.trend}`}>
          {getTrendIcon()}
          {/* <span>{metric.change}</span> */}
        </div>
      </div>
    </div>
  );
};

export default StatCard;