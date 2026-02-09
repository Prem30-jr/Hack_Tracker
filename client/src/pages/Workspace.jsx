import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import {
    Users,
    CheckSquare,
    Github,
    LayoutDashboard,
    Bot,
    Plus,
    Menu,
    X,
    Bell,
    MessageSquare,
    Sparkles,
    ExternalLink,
    ChevronRight,
    Clock,
    Check,
    ListChecks,
    AlertTriangle,
    Calendar,
    Target,
    GitCommit,
    GitPullRequest,
    Send,
    Trophy,
    LayoutGrid,
    MoreVertical,
    Copy,
    LogOut,
    Settings,
    Edit3
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Workspace = () => {
    const { teamId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [team, setTeam] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (teamId) {
            fetchTeamData();
            fetchTasks();
        }
    }, [teamId]);

    const fetchTeamData = async () => {
        try {
            const res = await api.get(`/teams/${teamId}`);
            setTeam(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch team", err);
            navigate('/dashboard');
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks/${teamId}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const tabs = [
        { id: 'overview', name: 'Mission Control', icon: LayoutDashboard },
        { id: 'tasks', name: 'Sprint Board', icon: CheckSquare },
        { id: 'resources', name: 'Resources', icon: ListChecks },
        { id: 'ai', name: 'AI Architect', icon: Bot, badge: 'PRO' },
        { id: 'github', name: 'Repo Sync', icon: Github },
        { id: 'team', name: 'Squad', icon: Users },
    ];

    if (loading) return (
        <div className="h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px]" />
            <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6" />
                <p className="text-gray-400 font-medium animate-pulse tracking-wide">Initializing Workspace...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#020617] text-white selection:bg-primary/30 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "border-r border-white/[0.05] transition-all duration-300 flex flex-col z-40 relative bg-[#0f172a]/80 backdrop-blur-xl",
                isSidebarOpen ? "w-72" : "w-20"
            )}>
                <div className="h-20 flex items-center px-6 border-b border-white/[0.05]">
                    <motion.div
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                        className={cn("flex items-center space-x-3 overflow-hidden whitespace-nowrap flex-1", !isSidebarOpen && "hidden")}
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 cursor-pointer hover:scale-105 transition-transform">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight cursor-pointer hover:text-white/90 transition-colors">HackTracker</span>
                    </motion.div>
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 mx-auto" />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                    {isSidebarOpen && (
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">Current Workspace</p>
                            <div className="glass-panel p-4 flex items-center space-x-3 border-white/5 bg-white/[0.02]">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 text-lg font-bold">
                                    {team?.name?.substring(0, 1) || 'P'}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-sm truncate leading-tight">{team?.name}</h3>
                                    <p className="text-[11px] text-gray-500 truncate">{team?.hackathonName || 'Hackathon Project'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-primary/10 to-transparent text-primary"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <tab.icon className={cn(
                                        "w-5 h-5 shrink-0 transition-colors",
                                        activeTab === tab.id ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
                                    )} />
                                    {isSidebarOpen && <span className={cn("font-medium text-sm", activeTab === tab.id && "font-bold")}>{tab.name}</span>}
                                </div>
                                {isSidebarOpen && tab.badge && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-primary to-secondary text-[9px] font-bold text-white shadow-sm shadow-primary/20">{tab.badge}</span>
                                )}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absoluteleft-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                    />
                                )}
                            </button>
                        ))}


                        <div className="pt-4 mt-4 border-t border-white/[0.05]">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:bg-white/5 hover:text-white"
                            >
                                <LogOut className="w-5 h-5 shrink-0 mr-3 transition-colors group-hover:text-rose-400 rotate-180" />
                                {isSidebarOpen && <span className="font-medium text-sm group-hover:text-rose-400 transition-colors">Exit Workspace</span>}
                            </button>
                        </div>
                    </nav>
                </div>

                <div className="p-4 border-t border-white/[0.05]">
                    <div className={cn("flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group", !isSidebarOpen && "justify-center")}>
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">
                                {user?.displayName?.substring(0, 1) || 'U'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{user?.displayName || 'Builder'}</p>
                                <p className="text-[10px] text-gray-500 truncate mt-0.5 font-medium">View Profile</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside >

            {/* Main Content */}
            < main className="flex-1 flex flex-col relative overflow-hidden" >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

                <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md z-30 sticky top-0">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold flex items-center text-white">
                            {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-5 h-5 mr-3 text-gray-400" })}
                            {tabs.find(t => t.id === activeTab)?.name}
                        </h2>
                        {team?.hackathonName && (
                            <>
                                <div className="h-4 w-px bg-white/10" />
                                <span className="text-xs font-medium text-gray-500 flex items-center">
                                    <Trophy className="w-3 h-3 mr-1.5 text-accent" />
                                    {team.hackathonName}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex -space-x-2">
                            {team?.members?.slice(0, 3).map((m, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-white/10 flex items-center justify-center text-[10px] uppercase font-bold text-gray-300 overflow-hidden relative" title={m.user?.displayName}>
                                    {m.user?.photoURL ? (
                                        <img src={m.user.photoURL} alt={m.user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        m.user?.displayName?.substring(0, 1) || '?'
                                    )}
                                </div>
                            ))}
                            {team?.members?.length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                    +{team.members.length - 3}
                                </div>
                            )}
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <button className="btn-icon bg-white/5 hover:bg-white/10">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth relative z-10">
                    <div className="max-w-7xl mx-auto h-full pb-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="h-full"
                            >
                                <TabContent
                                    activeTab={activeTab}
                                    team={team}
                                    tasks={tasks}
                                    refreshTasks={fetchTasks}
                                    refreshTeam={fetchTeamData}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main >
        </div >
    );
};

const TabContent = ({ activeTab, team, tasks, refreshTasks, refreshTeam }) => {
    switch (activeTab) {
        case 'overview': return <OverviewTab team={team} tasks={tasks} />;
        case 'tasks': return <TasksTab team={team} tasks={tasks} refreshTasks={refreshTasks} />;
        case 'resources': return <ResourcesTab team={team} refreshTeam={refreshTeam} refreshTasks={refreshTasks} />;
        case 'ai': return <AITab team={team} />;
        case 'team': return <TeamTab team={team} refreshTeam={refreshTeam} />;
        case 'github': return <GithubTab team={team} refreshTeam={refreshTeam} />;
        default: return null;
    }
};

const OverviewTab = ({ team, tasks }) => {
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const totalTasks = tasks.length || 1;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="space-y-8 pb-10">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Target}
                    label="Sprint Velocity"
                    status={`${progress}%`}
                    sublabel="Completion Rate"
                    color="primary"
                    chart={<div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden"><div style={{ width: `${progress}%` }} className="h-full bg-primary rounded-full" /></div>}
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Critical Tasks"
                    status={tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length.toString()}
                    sublabel="Needs Attention"
                    color="warning"
                />
                <StatCard
                    icon={Clock}
                    label="Time Remaining"
                    status="48h"
                    sublabel="Until Submission"
                    color="success"
                />
                <StatCard
                    icon={Users}
                    label="Team Morale"
                    status="High"
                    sublabel="Based on Activity"
                    color="secondary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 glass-panel p-6 border-white/5 bg-[#0f172a]/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center">
                            <GitCommit className="w-5 h-5 mr-3 text-primary" /> Live Activity Feed
                        </h3>
                        <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">View All</button>
                    </div>

                    <div className="space-y-0 relative">
                        {/* Vertical line connecting items */}
                        <div className="absolute left-2.5 top-2 bottom-6 w-px bg-gradient-to-b from-white/10 to-transparent" />

                        {tasks.slice(0, 5).map((task, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={task._id}
                                className="relative pl-8 py-3 group cursor-pointer"
                            >
                                <div className={cn(
                                    "absolute left-0 top-4 w-5 h-5 rounded-full border-[3px] border-[#0f172a] z-10 flex items-center justify-center",
                                    task.status === 'Completed' ? "bg-emerald-500" : task.status === 'In-Progress' ? "bg-amber-500" : "bg-slate-500"
                                )} />
                                <div className="glass-card p-4 hover:bg-white/[0.04] transition-colors border border-white/5 hover:border-white/10">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm text-gray-200 group-hover:text-primary transition-colors">{task.title}</p>
                                        <span className="text-[10px] font-mono text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest bg-white/5 px-2 py-0.5 rounded">{task.status}</span>
                                            {task.priority === 'Urgent' && <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest bg-rose-500/10 px-2 py-0.5 rounded flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Urgent</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center">
                                            {task.assignedTo?.displayName || 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Assistant Quick Access */}
                <div className="h-full">
                    <div className="glass-panel p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/25 mx-auto animate-float">
                                <Bot className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-white">Stuck on a bug?</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Your AI Architect can debug code, write documentation, or even generate pitch decks instantly.
                            </p>
                            <button className="btn-primary w-full shadow-2xl shadow-primary/20">
                                <Sparkles className="w-4 h-4 mr-2" /> Launch Architect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, status, sublabel, color, chart }) => (
    <div className="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={cn(
            "absolute top-0 right-0 p-20 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 transition-opacity group-hover:opacity-30",
            color === 'primary' ? "bg-primary" :
                color === 'secondary' ? "bg-secondary" :
                    color === 'success' ? "bg-emerald-500" :
                        color === 'warning' ? "bg-amber-500" : "bg-slate-500"
        )} />

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border border-white/10",
                    "bg-white/5 text-white"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                {/* <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" /> */}
            </div>
            <div>
                <p className="text-3xl font-black mb-1 tracking-tight text-white">{status}</p>
                <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold",
                        color === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                    )}>
                        {color === 'warning' ? '+2' : '+12%'}
                    </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium mt-1">{sublabel}</p>
                {chart}
            </div>
        </div>
    </div>
);

const TasksTab = ({ team, tasks, refreshTasks }) => {
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', deadline: '' });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tasks/${team._id}`, newTask);
            setNewTask({ title: '', description: '', priority: 'Medium', deadline: '' });
            setShowNewTask(false);
            refreshTasks();
        } catch (err) {
            console.error("Task creation failed:", err);
            alert("Failed to create task");
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${team._id}/${taskId}`, { status: newStatus });
            refreshTasks();
        } catch (err) { console.error(err); }
    };

    const columns = [
        { id: 'To-Do', label: 'Backlog', color: 'bg-slate-500', icon: ListChecks },
        { id: 'In-Progress', label: 'In Progress', color: 'bg-amber-500', icon: Clock },
        { id: 'Completed', label: 'Done', color: 'bg-emerald-500', icon: CheckSquare }
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black mb-1">Sprint Board</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage your hackathon deliverables.</p>
                </div>
                <button onClick={() => setShowNewTask(true)} className="btn-primary flex items-center shadow-2xl">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Add Task</span>
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
                {columns.map(col => (
                    <div key={col.id} className="flex flex-col h-full bg-[#0f172a]/40 backdrop-blur-md rounded-3xl border border-white/5 relative group">
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f172a]/40 backdrop-blur-xl rounded-t-3xl z-10">
                            <div className="flex items-center space-x-3">
                                <div className={cn("p-2 rounded-lg bg-white/5", col.id === 'In-Progress' ? "text-amber-400" : col.id === 'Completed' ? "text-emerald-400" : "text-slate-400")}>
                                    <col.icon className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm tracking-wide">{col.label}</h3>
                            </div>
                            <span className="bg-white/5 text-xs font-bold px-2.5 py-1 rounded-full text-gray-400 border border-white/5">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        {/* Task List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            <AnimatePresence>
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <motion.div
                                        layoutId={task._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={task._id}
                                        className="glass-card p-4 hover:border-primary/40 cursor-grab active:cursor-grabbing group/card shadow-lg bg-[#1e293b]/40 border-white/[0.05] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                                        <div className="flex justify-between items-start mb-3">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm",
                                                task.priority === 'Urgent' ? "bg-rose-500 text-white shadow-rose-500/20" :
                                                    task.priority === 'High' ? "bg-amber-500 text-white shadow-amber-500/20" :
                                                        "bg-slate-700 text-slate-300"
                                            )}>{task.priority}</span>

                                            <div className="flex space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                {col.id !== 'To-Do' && <button onClick={() => updateTaskStatus(task._id, 'To-Do')} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Move to Backlog"><ChevronRight className="w-4 h-4 rotate-180" /></button>}
                                                {col.id !== 'Completed' && <button onClick={() => updateTaskStatus(task._id, col.id === 'To-Do' ? 'In-Progress' : 'Completed')} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Advance"><ChevronRight className="w-4 h-4" /></button>}
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-sm mb-3 text-gray-100 leading-relaxed">{task.title}</h4>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                                            <div className="flex items-center -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold border-2 border-[#1e293b]" title={task.assignedTo?.displayName}>
                                                    {task.assignedTo?.displayName?.substring(0, 1) || '?'}
                                                </div>
                                            </div>

                                            {task.deadline && (
                                                <div className={cn(
                                                    "flex items-center text-[10px] font-bold uppercase tracking-wider",
                                                    new Date(task.deadline) < new Date() ? "text-rose-400" : "text-gray-500"
                                                )}>
                                                    <Calendar className="w-3 h-3 mr-1.5" />
                                                    {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="text-center py-10 text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                                    <p className="text-xs font-bold uppercase tracking-widest">No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showNewTask && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg glass-card p-8 shadow-2xl relative border-t border-white/10">
                            <button onClick={() => setShowNewTask(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                            <h3 className="text-2xl font-black mb-1">New Task</h3>
                            <p className="text-gray-400 text-sm mb-6">Add a new item to your sprint backlog.</p>

                            <form onSubmit={handleCreateTask} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Title</label>
                                    <input required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Implement Auth Flow" className="input-field bg-[#0f172a]/50 focus:bg-[#0f172a]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Priority</label>
                                        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="input-field bg-[#0f172a]/50">
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Deadline</label>
                                        <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} className="input-field bg-[#0f172a]/50" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full btn-primary py-4 mt-2 text-base shadow-lg shadow-primary/25">Add to Board</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ResourcesTab = ({ team, refreshTeam, refreshTasks }) => {
    const handleTemplateApply = async (templateName) => {
        try {
            await api.post(`/teams/${team._id}/template`, { templateName });
            refreshTeam();
            refreshTasks();
            alert(`Template applied!`);
        } catch (err) {
            alert("Failed to apply template");
        }
    };

    const toggleChecklist = async (itemId, completed) => {
        try {
            await api.patch(`/teams/${team._id}/checklist/${itemId}`, { completed });
            refreshTeam();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black mb-1">Resources & Utilities</h2>
                    <p className="text-gray-500 text-sm">Automated checklists and templates for quick starts.</p>
                </div>
            </header>

            {!team?.template || team.template === 'None' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Hackathon Starter', 'AI/ML Project', 'SaaS MVP'].map(tpl => (
                        <div key={tpl} className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden" onClick={() => handleTemplateApply(tpl)}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{tpl}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">Instantly generate task lists and boilerplates for {tpl} projects.</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel p-8 border-primary/20 bg-[#0f172a]/40">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <ListChecks className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Submission Checklist</h3>
                        </div>
                        <ChecklistAdder team={team} refreshTeam={refreshTeam} />
                    </div>
                    <div className="space-y-3">
                        {team.submissionChecklist.map(item => (
                            <div key={item._id} onClick={() => toggleChecklist(item._id, !item.completed)} className="w-full flex items-center p-4 bg-[#0f172a]/50 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors border border-white/5">
                                <div className={cn("w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all", item.completed ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-primary")}>
                                    {item.completed && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={cn("text-sm font-medium transition-colors", item.completed ? "text-gray-500 line-through" : "text-gray-200")}>{item.item}</span>
                            </div>
                        ))}
                        {team.submissionChecklist.length === 0 && (
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                                <p className="text-sm">No items in your checklist yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ChecklistAdder = ({ team, refreshTeam }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        try {
            await api.post(`/teams/${team._id}/checklist`, { item: newItem });
            setNewItem('');
            setIsAdding(false);
            refreshTeam();
        } catch (err) {
            alert("Failed to add checklist item");
        }
    };

    if (!isAdding) return (
        <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
            title="Add Custom Item"
        >
            <Plus className="w-5 h-5" />
        </button>
    );

    return (
        <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
                autoFocus
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="New checklist item..."
                className="input-field bg-black/40 py-2 border-white/10 focus:border-primary w-64 text-sm"
            />
            <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/20">
                <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setIsAdding(false)} className="p-2 bg-white/5 text-gray-400 rounded-lg hover:text-white">
                <X className="w-4 h-4" />
            </button>
        </form>
    );
};

const AITab = ({ team }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I'm your **${team?.name}** AI Architect. I can help refine your pitch, debug code, or plan your sprints. What shall we tackle?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (customType = null, customPrompt = null) => {
        const textToQuery = customPrompt || input;
        if (!textToQuery.trim() || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: textToQuery }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post(`/ai/chat/${team._id}`, {
                prompt: textToQuery,
                type: customType || 'general'
            });
            setMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting to the neural network." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-14rem)] flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar scroll-smooth" ref={scrollRef}>
                {messages.map((m, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn("flex w-full gap-4", m.role === 'user' ? "justify-end" : "justify-start")}
                    >
                        {m.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[80%] p-5 text-sm leading-relaxed shadow-lg backdrop-blur-sm border",
                            m.role === 'user'
                                ? "bg-primary text-white rounded-2xl rounded-br-sm border-primary/50"
                                : "bg-[#1e293b]/70 text-gray-200 rounded-2xl rounded-bl-sm border-white/5"
                        )}>
                            <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                        </div>
                        {m.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                                <Users className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex w-full gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-[#1e293b]/70 p-4 rounded-2xl rounded-bl-sm border border-white/5 flex items-center space-x-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 px-4">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                    {['Refine Idea', 'Suggest Tech Stack', 'Generate PPT Outline', 'Debug Code', 'Write Readme'].map(label => (
                        <button key={label} onClick={() => handleSend('general', `Help me with ${label}`)} className="px-4 py-2 bg-white/5 hover:bg-white/10 hover:border-primary/50 rounded-full text-xs font-bold text-gray-400 hover:text-white border border-white/5 whitespace-nowrap transition-all shadow-sm">
                            <Sparkles className="w-3 h-3 inline mr-1.5 text-secondary" />
                            {label}
                        </button>
                    ))}
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:ring-0 relative z-10 transition-colors"
                        placeholder="Ask your AI Architect..."
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20 shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-3 font-medium">AI can make mistakes. Review generated code.</p>
            </div>
        </div>
    );
};

const TeamTab = ({ team, refreshTeam }) => {
    const [showInvite, setShowInvite] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!team?.inviteCode) return;
        navigator.clipboard.writeText(team.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black mb-1">Squad Roster</h2>
                    <p className="text-gray-500 text-sm">Manage team roles and permissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowEdit(true)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 flex items-center gap-2 font-bold text-xs">
                        <Settings className="w-4 h-4" /> Manage Team
                    </button>
                    <button onClick={() => setShowInvite(true)} className="btn-secondary text-xs flex items-center">
                        <Users className="w-4 h-4 mr-2" /> Invite Member
                    </button>
                </div>
            </header>

            {/* Team Info Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-panel p-6 bg-primary/5 border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Hackathon</p>
                    <h4 className="text-lg font-bold">{team?.hackathonName || 'No Event Linked'}</h4>
                </div>
                <div className="glass-panel p-6 bg-secondary/5 border-secondary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Start Date</p>
                    <h4 className="text-lg font-bold">
                        {team?.hackathonStartDate ? new Date(team.hackathonStartDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not Scheduled'}
                    </h4>
                </div>
                <div className="glass-panel p-6 bg-white/5 border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Capacity</p>
                    <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold">{team?.members?.length} / {team?.memberSize || 4}</h4>
                        <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                            <div
                                style={{ width: `${(team?.members?.length / (team.memberSize || 4)) * 100}%` }}
                                className={cn("h-full transition-all duration-1000", team.members.length >= team.memberSize ? "bg-rose-500" : "bg-primary")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team?.members?.map((m, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={m.user?._id}
                        className="glass-card p-6 flex flex-col items-center text-center hover:border-primary/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-1 mb-4 shadow-xl border border-white/10 group-hover:scale-105 transition-transform overflow-hidden relative">
                            {m.user?.photoURL ? (
                                <img src={m.user.photoURL} alt={m.user.displayName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black uppercase text-white">
                                    {m.user?.displayName?.substring(0, 1) || m.user?.email?.substring(0, 1)}
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{m.user?.displayName || m.user?.email?.split('@')[0]}</h3>
                        <p className="text-xs text-gray-500 mb-4">{m.user?.email}</p>

                        <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            m.role === 'Admin' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>{m.role}</span>

                        <div className="mt-6 flex space-x-2 w-full justify-center">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Github className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showInvite && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md glass-card p-8 shadow-2xl relative border-t border-white/10 bg-[#0f172a]/90"
                        >
                            <button onClick={() => setShowInvite(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500 hover:text-white" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-white">Grow Your Squad</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
                                    Share this invite code with your teammates to let them join this workspace instantly.
                                </p>

                                <div className="w-full mb-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left ml-1">Invite Code</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-lg tracking-widest text-primary text-center select-all">
                                            {team?.inviteCode || 'LOADING...'}
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="h-[52px] w-[52px] flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                                            title="Copy Code"
                                        >
                                            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-600 mt-4">Code expires in 7 days • Only admins can regenerate</p>
                            </div>
                        </motion.div>
                    </div>
                )}
                {showEdit && <EditTeamModal team={team} setShowEdit={setShowEdit} refreshTeam={refreshTeam} />}
            </AnimatePresence>
        </div>
    );
};

const EditTeamModal = ({ team, setShowEdit, refreshTeam }) => {
    const [formData, setFormData] = useState({
        name: team.name,
        hackathonName: team.hackathonName || '',
        hackathonStartDate: team.hackathonStartDate ? team.hackathonStartDate.split('T')[0] : '',
        memberSize: team.memberSize || 4,
        description: team.description || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch(`/teams/${team._id}`, formData);
            refreshTeam();
            setShowEdit(false);
        } catch (err) {
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg glass-card p-10 shadow-2xl relative border-t border-white/10 bg-[#0f172a]">
                <button onClick={() => setShowEdit(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                <div className="mb-8">
                    <h3 className="text-2xl font-black mb-1">Squad Settings</h3>
                    <p className="text-gray-400 text-sm">Update your hackathon mission details.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Team Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field bg-black/30" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Event Name</label>
                        <input required value={formData.hackathonName} onChange={e => setFormData({ ...formData, hackathonName: e.target.value })} className="input-field bg-black/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Start Date</label>
                            <input type="date" value={formData.hackathonStartDate} onChange={e => setFormData({ ...formData, hackathonStartDate: e.target.value })} className="input-field bg-black/30" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-500 tracking-wider ml-1">Member Limit</label>
                            <input type="number" min={team.members.length} max="10" value={formData.memberSize} onChange={e => setFormData({ ...formData, memberSize: e.target.value })} className="input-field bg-black/30" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-2 shadow-lg shadow-primary/20">
                        {loading ? 'Saving...' : 'Update Settings'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const GithubTab = ({ team, refreshTeam }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/github/stats/${team._id}`);
            setStats(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (team?.githubConnected && team?.githubRepoName) fetchStats();
    }, [team?.githubConnected, team?.githubRepoName]);

    const handleConnect = async () => {
        try {
            const res = await api.get(`/github/auth/${team._id}`);
            if (res.data.url) window.location.href = res.data.url;
        } catch (err) { alert(err.response?.data?.message || "Auth failed"); }
    };

    const handleRepoConnect = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/github/connect-repo/${team._id}`, repoInfo);
            refreshTeam();
        } catch (err) { alert("Failed to connect repo"); }
    };

    if (!team?.githubConnected) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="glass-panel p-12 text-center max-w-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0f172a] to-black" />
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10 shadow-2xl">
                        <Github className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black mb-3">Sync Codebase</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">Connect GitHub to track commits, PRs, and team velocity directly in your mission control.</p>
                    <button onClick={handleConnect} className="btn-primary w-full shadow-xl shadow-primary/20">
                        Authorize GitHub
                    </button>
                </div>
            </div>
        </div>
    );

    if (!team?.githubRepoName) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="glass-panel p-12 max-w-md w-full border-t border-white/10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GitCommit className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Link Repository</h2>
                    <p className="text-sm text-gray-500">Enter the repository details to start tracking.</p>
                </div>

                <form onSubmit={handleRepoConnect} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Owner</label>
                        <input required value={repoInfo.owner} onChange={e => setRepoInfo({ ...repoInfo, owner: e.target.value })} className="input-field bg-[#020617]" placeholder="e.g. facebook" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Repository</label>
                        <input required value={repoInfo.repo} onChange={e => setRepoInfo({ ...repoInfo, repo: e.target.value })} className="input-field bg-[#020617]" placeholder="e.g. react" />
                    </div>
                    <button className="btn-primary w-full mt-4 py-3">Connect Repository</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between bg-[#0f172a]/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                        <Github className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{team.githubRepoName}</h2>
                        <a href={team.githubRepo} target="_blank" rel="noreferrer" className="text-xs text-primary hover:text-primary-hover hover:underline flex items-center font-medium transition-colors">
                            View on GitHub <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>
                <button onClick={fetchStats} className="btn-icon bg-white/5 hover:bg-white/10" title="Refresh Data"><Clock className="w-5 h-5" /></button>
            </header>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center animate-pulse text-gray-500">
                    <GitCommit className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                    <span className="text-sm font-medium">Syncing repository data...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 h-96 flex flex-col border-white/5 bg-[#0f172a]/30">
                        <h3 className="font-bold mb-6 flex items-center"><LayoutGrid className="w-4 h-4 mr-2 text-primary" /> Commit Velocity</h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.commits ? stats.commits.map(c => ({ name: new Date(c.commit.author.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), count: 1 })) : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-6 h-96 flex flex-col border-white/5 bg-[#0f172a]/30">
                        <h3 className="font-bold mb-6 flex items-center"><Users className="w-4 h-4 mr-2 text-secondary" /> Contributor Impact</h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.contributors || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="login" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                                    <Bar dataKey="contributions" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;
