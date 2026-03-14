export enum ClubGroup {
  CUBBY = 'Cubby',
  SPARK = 'Spark',
  FLAME = 'Flame',
  TORCH = 'Torch'
}

export enum Status {
  ON_TRACK = 'On Track',
  AHEAD = 'Ahead',
  NEEDS_HELP = 'Needs Help',
  NEW = 'New'
}

export interface Kid {
  id: string;
  firstname: string;
  lastname: string;
  group_name: ClubGroup;
  points: number;
  sectionsCompleted: number;
  attendanceRate: number; // 0-100
  lastAttended: string;
  status: Status;
  avatarUrl: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: 'users' | 'alert' | 'calendar' | 'award';
  color: 'blue' | 'red' | 'orange' | 'green';
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  type: 'attendance' | 'performance' | 'birthday';
}