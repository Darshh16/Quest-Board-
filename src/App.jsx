import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ShoppingBag, Sword, Trophy, Coins, Star, X, Repeat, Clock, Sparkles, Zap, History as HistoryIcon, Calendar } from 'lucide-react';

// Modern Glass Card Component
const Card = ({ children, className = "" }) => (
    <div className={`backdrop-blur-xl bg-slate-800/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${className}`}>
        {children}
    </div>
);

// Modernized Button with Glow Effects
const Button = ({ onClick, children, variant = "primary", className = "", disabled = false }) => {
    const baseStyle = "px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/20",
        success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/20",
        danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/25 border border-red-400/20",
        ghost: "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 backdrop-blur-sm",
        outline: "border-2 border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800/50",
        disabled: "bg-slate-800/50 text-slate-500 border border-slate-700"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${disabled ? variants.disabled : variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// Badge Component for Difficulty/Tags
const Badge = ({ children, colorClass }) => (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-current opacity-80 ${colorClass}`}>
        {children}
    </span>
);

export default function QuestBoard() {
    // State
    const [tasks, setTasks] = useState([]);
    const [dailies, setDailies] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [history, setHistory] = useState([]); // New History State
    const [userStats, setUserStats] = useState({ level: 1, xp: 0, gold: 0, xpToNextLevel: 100 });
    const [activeTab, setActiveTab] = useState('quests');

    // Form State
    const [newTask, setNewTask] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [isRecurring, setIsRecurring] = useState(false);

    const [newReward, setNewReward] = useState("");
    const [rewardCost, setRewardCost] = useState(50);
    const [notification, setNotification] = useState(null);

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('questBoardData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setTasks(parsed.tasks || []);
            setDailies(parsed.dailies || []);
            setRewards(parsed.rewards || []);
            setHistory(parsed.history || []);
            setUserStats(parsed.userStats || { level: 1, xp: 0, gold: 0, xpToNextLevel: 100 });
        } else {
            setRewards([
                { id: 1, name: "15 Min Break", cost: 30 },
                { id: 2, name: "Watch 1 Episode", cost: 100 },
                { id: 3, name: "Buy a Snack", cost: 50 }
            ]);
            setDailies([
                { id: 999, title: "Study DSA (1 hr)", difficulty: "hard", lastCompleted: null }
            ]);
        }
    }, []);

    // Save data
    useEffect(() => {
        localStorage.setItem('questBoardData', JSON.stringify({ tasks, dailies, rewards, userStats, history }));
    }, [tasks, dailies, rewards, userStats, history]);

    // Logic
    const difficultySettings = {
        easy: { xp: 10, gold: 5, color: "text-emerald-400 shadow-emerald-500/20", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Easy" },
        medium: { xp: 25, gold: 15, color: "text-amber-400 shadow-amber-500/20", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium" },
        hard: { xp: 50, gold: 30, color: "text-rose-400 shadow-rose-500/20", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Hard" },
        boss: { xp: 100, gold: 100, color: "text-violet-400 shadow-violet-500/20", bg: "bg-violet-500/10", border: "border-violet-500/20", label: "Boss" }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addToHistory = (title, actionType, rewards = null) => {
        const entry = {
            id: Date.now(),
            title,
            actionType, // 'completed', 'daily_completed', 'abandoned', 'purchased'
            date: new Date().toISOString(),
            rewards
        };
        // Keep only last 50 entries to prevent storage bloat
        setHistory(prev => [entry, ...prev].slice(0, 50));
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const newItem = {
            id: Date.now(),
            title: newTask,
            difficulty,
        };

        if (isRecurring) {
            setDailies([...dailies, { ...newItem, lastCompleted: null }]);
            showNotification("Daily Quest Added!");
        } else {
            setTasks([{ ...newItem, completed: false }, ...tasks]);
            showNotification("Quest Added!");
        }

        setNewTask("");
        setIsRecurring(false);
    };

    const processRewards = (difficultyLevel) => {
        const settings = difficultySettings[difficultyLevel];
        let newXp = userStats.xp + settings.xp;
        let newGold = userStats.gold + settings.gold;
        let newLevel = userStats.level;
        let newXpToNext = userStats.xpToNextLevel;

        if (newXp >= newXpToNext) {
            newLevel++;
            newXp = newXp - newXpToNext;
            newXpToNext = Math.floor(newXpToNext * 1.2);
            showNotification(`LEVEL UP! You are now level ${newLevel}!`, 'levelup');
        } else {
            showNotification(`Quest Complete! +${settings.xp} XP, +${settings.gold} Gold`);
        }

        setUserStats({ level: newLevel, xp: newXp, gold: newGold, xpToNextLevel: newXpToNext });
    };

    const completeTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const settings = difficultySettings[task.difficulty];
        processRewards(task.difficulty);
        addToHistory(task.title, 'completed', settings);

        setTasks(tasks.filter(t => t.id !== id));
    };

    const deleteTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        addToHistory(task.title, 'abandoned');
        setTasks(tasks.filter(t => t.id !== id));
    };

    const completeDaily = (id) => {
        const daily = dailies.find(d => d.id === id);
        if (!daily) return;
        if (isDailyCompleted(daily.lastCompleted)) {
            showNotification("Already completed today! Come back tomorrow.", 'error');
            return;
        }

        const settings = difficultySettings[daily.difficulty];
        processRewards(daily.difficulty);
        addToHistory(daily.title, 'daily_completed', settings);

        const updatedDailies = dailies.map(d =>
            d.id === id ? { ...d, lastCompleted: new Date().toISOString() } : d
        );
        setDailies(updatedDailies);
    };

    const deleteDaily = (id) => {
        const daily = dailies.find(d => d.id === id);
        if (daily) addToHistory(daily.title, 'abandoned');
        setDailies(dailies.filter(d => d.id !== id));
    };

    const isDailyCompleted = (lastCompletedDate) => {
        if (!lastCompletedDate) return false;
        const today = new Date().toDateString();
        const last = new Date(lastCompletedDate).toDateString();
        return today === last;
    };

    const deleteReward = (id) => {
        setRewards(rewards.filter(r => r.id !== id));
    };

    const addReward = (e) => {
        e.preventDefault();
        if (!newReward.trim()) return;
        setRewards([...rewards, { id: Date.now(), name: newReward, cost: parseInt(rewardCost) }]);
        setNewReward("");
        setRewardCost(50);
    };

    const buyReward = (id) => {
        const reward = rewards.find(r => r.id === id);
        if (userStats.gold >= reward.cost) {
            setUserStats({ ...userStats, gold: userStats.gold - reward.cost });
            addToHistory(reward.name, 'purchased', { cost: reward.cost });
            showNotification(`Purchased: ${reward.name}`, 'success');
        } else {
            showNotification(`Not enough gold! Need ${reward.cost - userStats.gold} more.`, 'error');
        }
    };

    // Helper to format date for history
    const formatHistoryDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-slate-100 font-sans p-4 md:p-8 selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Stats Bar */}
                <Card className="p-6 md:p-8 border-t border-t-white/10 bg-gradient-to-b from-slate-800/60 to-slate-900/60">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative group cursor-pointer">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl rotate-3 flex items-center justify-center text-3xl font-black shadow-2xl shadow-indigo-500/30 border border-white/10 group-hover:rotate-6 transition-transform duration-300">
                                    {userStats.level}
                                </div>
                                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black px-2 py-1 rounded-md shadow-lg rotate-[-3deg] group-hover:rotate-0 transition-transform duration-300">
                                    LVL
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                                    Quest Board
                                </h1>
                                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium mt-1">
                                    <span className="text-indigo-400 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {userStats.xp} XP
                                    </span>
                                    <span className="text-slate-600">/</span>
                                    <span>{userStats.xpToNextLevel} to next level</span>
                                </div>

                                {/* Modern XP Bar */}
                                <div className="w-full md:w-64 h-3 bg-slate-950/50 rounded-full mt-3 overflow-hidden border border-white/5 relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700 ease-out relative"
                                        style={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-black/30 transition-colors w-full md:w-auto justify-between md:justify-start">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Coins className="text-amber-400 w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Gold</div>
                                <div className="text-2xl font-black text-amber-400 font-mono tracking-tighter">{userStats.gold}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Navigation Tabs */}
                <div className="flex p-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('quests')}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'quests' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        <Sword className="w-5 h-5" />
                        Active Quests
                    </button>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'shop' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Rewards Shop
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'history' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        <HistoryIcon className="w-5 h-5" />
                        History
                    </button>
                </div>

                {/* Notification Toast */}
                {notification && (
                    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce-in border backdrop-blur-xl
            ${notification.type === 'levelup' ? 'bg-violet-600/90 border-violet-400 text-white shadow-violet-900/50' :
                            notification.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100'}`}>
                        <div className={`p-2 rounded-full ${notification.type === 'levelup' ? 'bg-white/20' : 'bg-black/20'}`}>
                            {notification.type === 'levelup' ? <Trophy className="w-5 h-5" /> :
                                notification.type === 'error' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        </div>
                        <div>
                            <div className="font-bold text-sm uppercase tracking-wider opacity-80">
                                {notification.type === 'levelup' ? 'Congratulations!' : notification.type === 'error' ? 'Oops!' : 'Success'}
                            </div>
                            <div className="font-bold text-lg">{notification.message}</div>
                        </div>
                    </div>
                )}

                {/* QUESTS TAB */}
                {activeTab === 'quests' && (
                    <div className="space-y-8">
                        {/* Add Task Form */}
                        <Card className="p-1">
                            <form onSubmit={addTask} className="flex flex-col gap-0">
                                <div className="flex flex-col md:flex-row gap-0">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="flex-1 bg-transparent border-0 px-6 py-5 text-lg text-white placeholder:text-slate-500 focus:ring-0"
                                    />
                                    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 md:bg-transparent border-t md:border-t-0 md:border-l border-white/5">
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            className="bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 hover:bg-slate-700 cursor-pointer"
                                        >
                                            {Object.entries(difficultySettings).map(([key, setting]) => (
                                                <option key={key} value={key}>{setting.label}</option>
                                            ))}
                                        </select>
                                        <Button type="submit" className="shadow-none">
                                            <Plus className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Secondary Actions Bar */}
                                <div className="px-6 py-3 bg-black/20 border-t border-white/5 flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsRecurring(!isRecurring)}
                                        className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isRecurring ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isRecurring ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                            {isRecurring && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        Repeat Daily
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <div className="grid gap-8">
                            {/* Daily Quests Section */}
                            {dailies.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-indigo-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 ml-1">
                                        <Repeat className="w-4 h-4" /> Daily Quests
                                    </h2>
                                    <div className="grid grid-cols-1 gap-3">
                                        {dailies.map(daily => {
                                            const isDone = isDailyCompleted(daily.lastCompleted);
                                            const settings = difficultySettings[daily.difficulty];
                                            return (
                                                <Card key={daily.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${isDone ? 'opacity-50 grayscale' : 'hover:scale-[1.01] hover:border-indigo-500/30'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${settings.bg} ${settings.color} border ${settings.border}`}>
                                                            <Clock className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`font-bold text-lg ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>{daily.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge colorClass={settings.color}>{settings.label}</Badge>
                                                                <span className="text-xs font-bold text-slate-500">•</span>
                                                                <span className="text-xs font-bold text-amber-500">+{settings.gold} G</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-end md:self-auto">
                                                        <Button
                                                            variant={isDone ? "disabled" : "primary"}
                                                            disabled={isDone}
                                                            onClick={() => completeDaily(daily.id)}
                                                            className="w-full md:w-auto"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            {isDone ? "Done" : "Complete"}
                                                        </Button>
                                                        <button
                                                            onClick={() => deleteDaily(daily.id)}
                                                            className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Standard Task List */}
                            <div className="space-y-4">
                                <h2 className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 ml-1">
                                    <Zap className="w-4 h-4" /> One-Time Quests
                                </h2>
                                {tasks.length === 0 ? (
                                    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50">
                                        <Sword className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                                        <p className="text-slate-500 font-medium">No active quests. The adventure awaits!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {tasks.map(task => {
                                            const settings = difficultySettings[task.difficulty];
                                            return (
                                                <Card key={task.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-white/20 hover:bg-slate-800/60">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${settings.bg} ${settings.color} border ${settings.border}`}>
                                                            <Star className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">{task.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge colorClass={settings.color}>{settings.label}</Badge>
                                                                <span className="text-xs font-bold text-slate-500">•</span>
                                                                <span className="text-xs font-bold text-amber-500">+{settings.gold} G</span>
                                                                <span className="text-xs font-bold text-slate-500">•</span>
                                                                <span className="text-xs font-bold text-indigo-400">+{settings.xp} XP</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-end md:self-auto">
                                                        <Button variant="success" onClick={() => completeTask(task.id)}>
                                                            <Check className="w-4 h-4" />
                                                            Complete
                                                        </Button>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SHOP TAB */}
                {activeTab === 'shop' && (
                    <div className="space-y-8">
                        <Card className="p-6 bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-500/20">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                                <Plus className="w-5 h-5" /> Create Custom Reward
                            </h3>
                            <form onSubmit={addReward} className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    value={newReward}
                                    onChange={(e) => setNewReward(e.target.value)}
                                    placeholder="Reward Name (e.g. 'Eat a Cookie')"
                                    className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                                <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-700 rounded-xl px-4 relative">
                                    <span className="text-amber-400 font-bold text-lg">G</span>
                                    <input
                                        type="number"
                                        value={rewardCost}
                                        onChange={(e) => setRewardCost(e.target.value)}
                                        className="w-20 bg-transparent py-3 text-white focus:outline-none text-right font-mono font-bold"
                                    />
                                </div>
                                <Button variant="success" type="submit">
                                    Create
                                </Button>
                            </form>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rewards.map(reward => (
                                <Card key={reward.id} className="p-6 relative group hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-bold text-slate-200 group-hover:text-white">{reward.name}</h3>
                                        <button
                                            onClick={() => deleteReward(reward.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div className="text-amber-400 font-bold text-3xl font-mono flex items-baseline gap-1">
                                            {reward.cost} <span className="text-xs text-slate-500 font-sans font-bold uppercase tracking-wider">Gold</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => buyReward(reward.id)}
                                            disabled={userStats.gold < reward.cost}
                                            className={userStats.gold >= reward.cost ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300" : ""}
                                        >
                                            Buy
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-violet-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 ml-1">
                                <HistoryIcon className="w-4 h-4" /> Recent Activity
                            </h2>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Last 50 Events</span>
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                                <p className="text-slate-500 font-medium">No history yet. Start completing quests!</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {history.map(entry => {
                                    // Styles based on action type
                                    let statusColor = "text-slate-400";
                                    let icon = <Check className="w-4 h-4" />;
                                    let borderColor = "border-slate-700/50";

                                    if (entry.actionType === 'completed' || entry.actionType === 'daily_completed') {
                                        statusColor = "text-emerald-400";
                                        icon = <Check className="w-4 h-4" />;
                                        borderColor = "border-emerald-500/10";
                                    } else if (entry.actionType === 'abandoned') {
                                        statusColor = "text-red-400";
                                        icon = <X className="w-4 h-4" />;
                                        borderColor = "border-red-500/10";
                                    } else if (entry.actionType === 'purchased') {
                                        statusColor = "text-amber-400";
                                        icon = <ShoppingBag className="w-4 h-4" />;
                                        borderColor = "border-amber-500/10";
                                    }

                                    return (
                                        <div key={entry.id} className={`p-4 rounded-xl bg-slate-900/40 border ${borderColor} flex items-center justify-between group hover:bg-slate-800/40 transition-colors`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg bg-black/20 ${statusColor}`}>
                                                    {icon}
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-sm ${entry.actionType === 'abandoned' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                        {entry.title}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-600 flex items-center gap-2 mt-1">
                                                        <Calendar className="w-3 h-3" /> {formatHistoryDate(entry.date)}
                                                    </div>
                                                </div>
                                            </div>

                                            {entry.rewards && (
                                                <div className="text-right">
                                                    {entry.rewards.cost ? (
                                                        <div className="text-xs font-bold text-red-400">-{entry.rewards.cost} G</div>
                                                    ) : (
                                                        <>
                                                            <div className="text-xs font-bold text-amber-500">+{entry.rewards.gold} G</div>
                                                            <div className="text-xs font-bold text-indigo-400">+{entry.rewards.xp} XP</div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {entry.actionType === 'abandoned' && (
                                                <Badge colorClass="text-red-500 border-red-500/20">Abandoned</Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
