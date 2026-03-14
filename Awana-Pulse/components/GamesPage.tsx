import React, { useState } from 'react';
import { Gamepad2, Trophy, Timer, Calendar as CalendarIcon, Plus, History, X, Save, Medal, ChevronRight, Activity, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Button, Badge, Input, Label, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea } from './ui';

// Types
interface Team {
  id: string;
  name: string;
  score: number;
}

interface GameActivity {
  id: number;
  title: string;
  type: string;
  description: string;
}

interface ScoreLog {
  id: string;
  activityName: string;
  date: string;
  scores: { [teamId: string]: number };
}

// Initial Data
const INITIAL_TEAMS: Team[] = [
  { id: 'red', name: 'Red Team', score: 1250 },
  { id: 'blue', name: 'Blue Team', score: 1400 },
  { id: 'green', name: 'Green Team', score: 1150 },
  { id: 'yellow', name: 'Yellow Team', score: 1300 },
];

const INITIAL_GAMES: GameActivity[] = [
  { id: 1, title: 'Balloon Pop Relay', type: 'Relay', description: 'Teams race to pop balloons by sitting on them. First team to pop all wins.' },
  { id: 2, title: 'Verse Scramble', type: 'Memory', description: 'Teams must arrange scrambled words on the floor to form the memory verse.' },
  { id: 3, title: 'Bean Bag Toss', type: 'Skill', description: 'Throw bean bags into numbered buckets for points. Distance adds difficulty.' },
];

// Gradient Styles Mapping - More Vibrant
const TEAM_STYLES: Record<string, { gradient: string; shadow: string; text: string; iconColor: string; accent: string }> = {
  red: { 
      gradient: 'from-rose-500 via-red-600 to-red-700', 
      shadow: 'shadow-red-500/30', 
      text: 'text-rose-50', 
      iconColor: 'text-white/10',
      accent: 'bg-white/20'
  },
  blue: { 
      gradient: 'from-blue-500 via-indigo-600 to-indigo-700', 
      shadow: 'shadow-indigo-500/30', 
      text: 'text-indigo-50', 
      iconColor: 'text-white/10',
      accent: 'bg-white/20'
  },
  green: { 
      gradient: 'from-emerald-400 via-emerald-600 to-teal-700', 
      shadow: 'shadow-emerald-500/30', 
      text: 'text-emerald-50', 
      iconColor: 'text-white/10',
      accent: 'bg-white/20'
  },
  yellow: { 
      gradient: 'from-amber-400 via-orange-500 to-orange-600', 
      shadow: 'shadow-orange-500/30', 
      text: 'text-amber-50', 
      iconColor: 'text-white/10',
      accent: 'bg-white/20'
  },
};

const GamesPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [games, setGames] = useState<GameActivity[]>(INITIAL_GAMES);
  const [scoreHistory, setScoreHistory] = useState<ScoreLog[]>([]);
  
  // Modals State
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Form State
  const [newScores, setNewScores] = useState<{ [key: string]: string }>({ red: '', blue: '', green: '', yellow: '' });
  const [newGame, setNewGame] = useState({ title: '', type: 'Relay', description: '' });
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  // Determine Leader
  const leader = [...teams].sort((a, b) => b.score - a.score)[0];

  const handleScoreChange = (id: string, value: string) => {
    setNewScores(prev => ({ ...prev, [id]: value }));
  };

  const saveScores = () => {
    if (!selectedActivityId) return;

    let activityName = 'Bonus / Quick Game';
    if (selectedActivityId !== 'bonus') {
        const game = games.find(g => g.id.toString() === selectedActivityId);
        if (game) activityName = game.title;
    }

    // Convert string inputs to numbers
    const points: { [key: string]: number } = {};
    let hasPoints = false;
    teams.forEach(team => {
        const val = parseInt(newScores[team.id]) || 0;
        points[team.id] = val;
        if (val !== 0) hasPoints = true;
    });

    if (!hasPoints) return; // Don't save empty logs

    // Update Teams
    setTeams(teams.map(team => ({
      ...team,
      score: team.score + (points[team.id] || 0)
    })));

    // Add to History
    const newLog: ScoreLog = {
        id: Date.now().toString(),
        activityName,
        date: new Date().toLocaleDateString(),
        scores: points
    };
    setScoreHistory([newLog, ...scoreHistory]);

    // Reset Form
    setNewScores({ red: '', blue: '', green: '', yellow: '' });
    setSelectedActivityId('');
    setIsScoreModalOpen(false);
  };

  const addGame = () => {
    if (!newGame.title) return;
    setGames([...games, { ...newGame, id: Date.now() }]);
    setNewGame({ title: '', type: 'Relay', description: '' });
    setIsAddGameModalOpen(false);
  };

  const calculateBaseScores = () => {
      // Calculate what the score was before any history was recorded
      const baseScores: {[key: string]: number} = {};
      teams.forEach(team => {
          const totalHistoryPoints = scoreHistory.reduce((acc, log) => acc + (log.scores[team.id] || 0), 0);
          baseScores[team.id] = team.score - totalHistoryPoints;
      });
      return baseScores;
  };

  const getWeeklyPoints = (teamId: string) => {
      const currentWeekDate = new Date().toLocaleDateString();
      // For this demo, we match exactly today's date, but in a real app this would check the week range
      return scoreHistory
        .filter(l => l.date === currentWeekDate)
        .reduce((acc, l) => acc + (l.scores[teamId] || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Game Center</h2>
            <p className="text-muted-foreground">
            Manage team scores and plan game time activities.
            </p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" onClick={() => setIsScoreModalOpen(true)} className="gap-2">
                <History size={16} /> Record Scores
             </Button>
             <Button onClick={() => setIsAddGameModalOpen(true)} className="gap-2">
                <Plus size={16} /> Plan Activity
             </Button>
        </div>
      </div>

      {/* NEW Vibrant Team Scores Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team) => {
            const style = TEAM_STYLES[team.id] || TEAM_STYLES['blue'];
            const weeklyPoints = getWeeklyPoints(team.id);
            
            return (
            <div 
                key={team.id}
                onClick={() => setViewingTeam(team)}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} p-6 text-white shadow-xl ${style.shadow} transition-all hover:scale-[1.03] cursor-pointer group border-0`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy size={80} />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-8 rounded-full ${style.accent}`}></span>
                            <p className={`${style.text} text-sm font-bold uppercase tracking-wider`}>{team.name}</p>
                        </div>
                        <h3 className="text-5xl font-extrabold tracking-tight drop-shadow-sm">{team.score.toLocaleString()}</h3>
                    </div>
                    <div className={`mt-6 flex items-center ${style.text} text-xs font-medium`}>
                         <div className={`${style.accent} px-3 py-1.5 rounded-lg mr-2 backdrop-blur-md flex items-center gap-1.5 font-bold`}>
                            <TrendingUp size={14} />
                            <span>+{weeklyPoints}</span>
                         </div>
                         <span className="opacity-80">this week</span>
                    </div>
                </div>
            </div>
            );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* All Activities List */}
         <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-purple-500"/>
                    All Activities
                </CardTitle>
                <CardDescription>Library of games and activities available</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {games.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground italic">No games scheduled. Plan one now!</div>
                    ) : (
                        games.map((game) => (
                            <div key={game.id} className="flex items-start justify-between p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                        <Gamepad2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{game.title}</h4>
                                            <Badge variant="outline" className="text-[10px] h-5 border-slate-300 dark:border-slate-600 shrink-0">{game.type}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">
                                            {game.description || "No description provided."}
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => setGames(games.filter(g => g.id !== game.id))}>
                                    <X size={16} />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
         </Card>

         {/* Dynamic Leader Team */}
         <div 
            onClick={() => setIsLeaderboardOpen(true)}
            className={`cursor-pointer group rounded-2xl bg-gradient-to-br ${leader.id === 'red' ? 'from-rose-500 to-red-600' : leader.id === 'blue' ? 'from-blue-500 to-indigo-600' : leader.id === 'green' ? 'from-emerald-500 to-teal-600' : 'from-amber-400 to-orange-500'} text-white shadow-2xl flex flex-col transition-transform hover:scale-[1.02] border-0`}
         >
            <div className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Medal size={120} />
                </div>
                <div className="flex items-center justify-between text-white/90 mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6"/>
                        <h3 className="font-bold text-lg">Current Leader</h3>
                    </div>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                    <div className="relative">
                        <div className="h-28 w-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30">
                             <Medal className="h-14 w-14 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap border-2 border-white/20">
                            #{1} Place
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">{leader.name}</h3>
                        <p className="text-white/90 font-medium mt-1">Leading with {leader.score.toLocaleString()} points!</p>
                    </div>
                </div>
            </div>
            <div className="mt-auto bg-black/10 p-4 backdrop-blur-sm rounded-b-2xl border-t border-white/10">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 shadow-none">
                    View Full Standings
                </Button>
            </div>
         </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Update Scores Modal */}
      {isScoreModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold">Record Weekly Scores</h2>
                    <button onClick={() => setIsScoreModalOpen(false)}><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Select Activity</Label>
                        <Select 
                            value={selectedActivityId} 
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedActivityId(e.target.value)}
                        >
                            <option value="" disabled>Select a game...</option>
                            {games.map(g => (
                                <option key={g.id} value={g.id.toString()}>{g.title}</option>
                            ))}
                            <option value="bonus">Bonus / Quick Game</option>
                        </Select>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Label>Points per Team</Label>
                        {teams.map(team => {
                            const style = TEAM_STYLES[team.id] || TEAM_STYLES['blue'];
                            return (
                            <div key={team.id} className="flex items-center gap-4">
                                <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${style.gradient}`}></div>
                                <Label className="w-24 font-bold text-base flex-1">{team.name}</Label>
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    className="text-right font-mono w-24"
                                    value={newScores[team.id]}
                                    onChange={(e) => handleScoreChange(team.id, e.target.value)}
                                    disabled={!selectedActivityId}
                                />
                            </div>
                        )})}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsScoreModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50" 
                            onClick={saveScores}
                            disabled={!selectedActivityId}
                        >
                            <Save size={16} /> Save Scores
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 2. Team History Modal */}
      {viewingTeam && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className={`flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r ${TEAM_STYLES[viewingTeam.id]?.gradient || 'from-gray-500 to-gray-600'}`}>
                    <div>
                        <h2 className="text-xl font-bold text-white">{viewingTeam.name} History</h2>
                        <p className="text-sm opacity-90 text-white/80">Activity performance log</p>
                    </div>
                    <button onClick={() => setViewingTeam(null)} className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-white"><X size={20} /></button>
                </div>
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Activity</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right pr-6">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scoreHistory.filter(log => log.scores[viewingTeam.id]).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-32 text-muted-foreground">No recent activity recorded.</TableCell>
                                </TableRow>
                            ) : (
                                scoreHistory.filter(log => log.scores[viewingTeam.id]).map((log, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium pl-6">{log.activityName}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                                        <TableCell className="text-right font-bold pr-6">+{log.scores[viewingTeam.id]}</TableCell>
                                    </TableRow>
                                ))
                            )}
                            <TableRow className="bg-slate-50 dark:bg-slate-800 font-bold">
                                <TableCell className="pl-6" colSpan={2}>Initial Points (Base)</TableCell>
                                <TableCell className="text-right pr-6">{calculateBaseScores()[viewingTeam.id].toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                                <TableCell className="pl-6" colSpan={2}>Current Total</TableCell>
                                <TableCell className="text-right pr-6 text-lg">{viewingTeam.score.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
             </div>
        </div>
      )}

      {/* 3. Full Standings Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Full Standings</h2>
                            <p className="text-sm text-gray-500">Breakdown of scores by activity</p>
                        </div>
                    </div>
                    <button onClick={() => setIsLeaderboardOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-800">
                                <TableRow>
                                    <TableHead className="w-[30%]">Activity / Event</TableHead>
                                    {teams.map(team => (
                                        <TableHead key={team.id} className={`text-center font-bold ${TEAM_STYLES[team.id] ? 'text-gray-900 dark:text-white' : ''}`}>
                                            <span className={`px-2 py-1 rounded-md bg-gradient-to-r ${TEAM_STYLES[team.id]?.gradient || ''} text-white text-xs`}>
                                                {team.name}
                                            </span>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Base Score Row */}
                                <TableRow>
                                    <TableCell className="font-medium text-slate-500">Initial Points (Base)</TableCell>
                                    {teams.map(team => (
                                        <TableCell key={team.id} className="text-center text-slate-500">
                                            {calculateBaseScores()[team.id].toLocaleString()}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* History Rows */}
                                {scoreHistory.map((log, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="font-medium text-gray-900 dark:text-white">{log.activityName}</div>
                                            <div className="text-xs text-gray-400">{log.date}</div>
                                        </TableCell>
                                        {teams.map(team => (
                                            <TableCell key={team.id} className="text-center font-medium">
                                                {log.scores[team.id] ? `+${log.scores[team.id]}` : '-'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}

                                {/* Total Row */}
                                <TableRow className="bg-slate-100 dark:bg-slate-900 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                                    <TableCell className="text-lg">Total Score</TableCell>
                                    {teams.map(team => (
                                        <TableCell key={team.id} className="text-center text-lg">
                                            {team.score.toLocaleString()}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* 4. Add Game Modal */}
      {isAddGameModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold">Plan New Activity</h2>
                    <button onClick={() => setIsAddGameModalOpen(false)}><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Game Title</Label>
                        <Input 
                            placeholder="e.g. Balloon Relay" 
                            value={newGame.title} 
                            onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select 
                            value={newGame.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewGame({...newGame, type: e.target.value})}
                        >
                            <option>Relay</option>
                            <option>Memory</option>
                            <option>Skill</option>
                            <option>Tag</option>
                            <option>Strategy</option>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            placeholder="Briefly describe the game rules or objective..."
                            value={newGame.description}
                            onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                            rows={3}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddGameModalOpen(false)}>Cancel</Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={addGame}>
                            <Plus size={16} /> Add Activity
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default GamesPage;