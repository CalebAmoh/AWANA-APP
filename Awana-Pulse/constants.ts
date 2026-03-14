import { Kid, ClubGroup, Status, Metric, Alert } from './types';

const GHANAIAN_FIRST_NAMES = [
  'Kwame', 'Kofi', 'Kwabena', 'Kweku', 'Yaw', 'Kojo', 'Nii', 'Mawuli', 'Fiifi', 'Ato', 'Emmanuel', 'Samuel', 'Daniel', // Male
  'Ama', 'Abena', 'Akua', 'Yaa', 'Afia', 'Adjoa', 'Esi', 'Naa', 'Akosua', 'Dzifa', 'Enyonam', 'Peace', 'Grace' // Female
];

const GHANAIAN_LAST_NAMES = [
  'Mensah', 'Osei', 'Appiah', 'Asante', 'Owusu', 'Boateng', 'Ansah', 'Antwi', 'Agyapong', 'Tetteh', 
  'Lartey', 'Quartey', 'Amoah', 'Frimpong', 'Acheampong', 'Dankwa', 'Addo', 'Baah', 'Boakye', 'Sowah',
  'Amponsah', 'Gyasi', 'Kyei', 'Darko', 'Nyarko', 'Asare', 'Boadu', 'Sarpong', 'Ofori', 'Yeboah'
];

const generateKids = (count: number): Kid[] => {
  const kids: Kid[] = [];
  const groups = [ClubGroup.CUBBY, ClubGroup.SPARK, ClubGroup.FLAME, ClubGroup.TORCH];
  const statuses = [Status.ON_TRACK, Status.ON_TRACK, Status.ON_TRACK, Status.AHEAD, Status.NEEDS_HELP, Status.NEW];

  for (let i = 1; i <= count; i++) {
    const firstName = GHANAIAN_FIRST_NAMES[Math.floor(Math.random() * GHANAIAN_FIRST_NAMES.length)];
    const lastName = GHANAIAN_LAST_NAMES[Math.floor(Math.random() * GHANAIAN_LAST_NAMES.length)];
    const group = groups[Math.floor(Math.random() * groups.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate realistic points based on status
    let points = Math.floor(Math.random() * 1000) + 200;
    let sections = Math.floor(Math.random() * 10) + 2;
    let attendance = Math.floor(Math.random() * 30) + 70;

    if (status === Status.AHEAD) {
      points += 1500;
      sections += 10;
      attendance = Math.floor(Math.random() * 5) + 95;
    } else if (status === Status.NEEDS_HELP) {
      points = Math.floor(Math.random() * 300);
      sections = Math.floor(Math.random() * 3);
      attendance = Math.floor(Math.random() * 40) + 40;
    } else if (status === Status.NEW) {
      points = 0;
      sections = 0;
      attendance = 100;
    }

    kids.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      group: group,
      points: points,
      sectionsCompleted: sections,
      attendanceRate: attendance,
      lastAttended: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString('en-GB'),
      status: status,
      avatarUrl: `https://picsum.photos/100/100?random=${i}`
    });
  }
  return kids;
};

// Generate 60 kids
export const MOCK_KIDS: Kid[] = generateKids(60);

// Select specific kids for alerts to ensure consistency
const absentKid = MOCK_KIDS.find(k => k.attendanceRate < 60) || MOCK_KIDS[0];
const stuckKid = MOCK_KIDS.find(k => k.status === Status.NEEDS_HELP && k.id !== absentKid.id) || MOCK_KIDS[1];

export const MOCK_METRICS: Metric[] = [
  { label: 'Total Clubbers', value: MOCK_KIDS.length, change: '+5 this month', trend: 'up', iconName: 'users', color: 'green' },
  { label: 'Needs Encouragement', value: MOCK_KIDS.filter(k => k.status === Status.NEEDS_HELP).length, change: '3 new this week', trend: 'down', iconName: 'alert', color: 'red' },
  { label: 'Upcoming Events', value: 'Grand Prix', change: 'In 2 weeks', trend: 'neutral', iconName: 'calendar', color: 'orange' },
  { label: 'Total Verses Said', value: MOCK_KIDS.reduce((acc, k) => acc + k.sectionsCompleted, 0), change: '12% improvement', trend: 'up', iconName: 'award', color: 'blue' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: '1', title: `${absentKid.name} Absent`, description: 'Has missed 3 consecutive weeks.', severity: 'high', type: 'attendance' },
  { id: '2', title: `${stuckKid.name} Stuck`, description: 'Stuck on Section 2.3 for 3 weeks.', severity: 'medium', type: 'performance' },
];

export const GROUP_COLORS = {
  [ClubGroup.CUBBY]: '#3B82F6', // Blue
  [ClubGroup.SPARK]: '#EF4444', // Red
  [ClubGroup.FLAME]: '#10B981', // Green
  [ClubGroup.TORCH]: '#F59E0B', // Yellow
};