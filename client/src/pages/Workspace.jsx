import React, { useState, useEffect } from 'react';
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
    Target
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
    }, [teamId]); // Corrected: teamId is the only changing dependency we need here for fetching

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
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'tasks', name: 'Sprints', icon: CheckSquare },
        { id: 'resources', name: 'Checklist', icon: ListChecks },
        { id: 'ai', name: 'HackAssistant', icon: Bot, badge: 'AI' },
        { id: 'github', name: 'GitHub Sync', icon: Github },
        { id: 'team', name: 'Team', icon: Users },
    ];

    if (loading) return (
        <div className="h-screen bg-[#020617] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Sidebar */}
            <aside className={cn(
                "bg-[#0f172a]/50 border-r border-white/5 transition-all duration-500 flex flex-col z-40 relative backdrop-blur-2xl",
                isSidebarOpen ? "w-72" : "w-20"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <motion.div
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                        className={cn("flex items-center space-x-3 overflow-hidden whitespace-nowrap", !isSidebarOpen && "hidden")}
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="w-9 h-9 bg-primary cursor-pointer rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter cursor-pointer">HackTracker</span>
                    </motion.div>
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <div className="px-4 mb-8">
                    <div className={cn(
                        "group relative bg-white/[0.03] border border-white/[0.05] rounded-2xl transition-all p-4",
                        isSidebarOpen ? "block" : "hidden"
                    )}>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Project</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm truncate">{team?.name}</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group relative",
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-xl shadow-blue-500/10"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center space-x-4">
                                <tab.icon className={cn("w-5 h-5 shrink-0", activeTab === tab.id ? "text-white" : "group-hover:text-primary transition-colors")} />
                                {isSidebarOpen && <span className="font-semibold text-sm">{tab.name}</span>}
                            </div>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className={cn("p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/10", isSidebarOpen ? "flex items-center space-x-4" : "flex justify-center")}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black shrink-0 border-2 border-white/10 uppercase">
                            {user?.displayName?.substring(0, 2) || user?.email?.substring(0, 2)}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">{user?.displayName || user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-tighter">
                                    Member
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/50 backdrop-blur-md z-30">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>{team?.hackathonName || 'Operational'}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-5">
                        <button className="relative p-2.5 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all group">
                            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-blue-600 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold text-sm hidden md:block">New Task</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-full"
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
            </main>
        </div>
    );
};

const TabContent = ({ activeTab, team, tasks, refreshTasks, refreshTeam }) => {
    switch (activeTab) {
        case 'overview': return <OverviewTab team={team} tasks={tasks} />;
        case 'tasks': return <TasksTab team={team} tasks={tasks} refreshTasks={refreshTasks} />;
        case 'resources': return <ResourcesTab team={team} refreshTeam={refreshTeam} refreshTasks={refreshTasks} />;
        case 'ai': return <AITab team={team} />;
        case 'team': return <TeamTab team={team} />;
        case 'github': return <GithubTab team={team} refreshTeam={refreshTeam} />;
        default: return null;
    }
};

const OverviewTab = ({ team, tasks }) => (
    <div className="space-y-12 pb-20">
        <header>
            <h2 className="text-4xl font-black mb-2">{team?.name}</h2>
            <p className="text-gray-500 text-lg">Dashboard & Insights</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={Target} label="Team Velocity" status={`${tasks.filter(t => t.status === 'Completed').length} / ${tasks.length}`} color="blue" />
            <StatCard icon={AlertTriangle} label="Urgent Tasks" status={tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length.toString()} color="red" />
            <StatCard icon={Clock} label="Days Left" status="2 Days" color="purple" />
        </div>

        <div className="glass-card p-10">
            <h3 className="text-xl font-bold mb-8">Sprint Progress</h3>
            <div className="space-y-4">
                {tasks.slice(0, 3).map(task => (
                    <div key={task._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                task.status === 'Completed' ? "bg-green-500" : task.status === 'In-Progress' ? "bg-yellow-500" : "bg-gray-600"
                            )} />
                            <span className="font-bold text-sm tracking-tight">{task.title}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{task.status}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, status, color }) => (
    <div className="glass-card p-8 hover:scale-[1.02] transition-all cursor-pointer">
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
            color === 'green' ? "bg-green-500/10 text-green-500" :
                color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                    color === 'red' ? "bg-red-500/10 text-red-500" : "bg-purple-500/10 text-purple-500"
        )}>
            <Icon className="w-6 h-6" />
        </div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black">{status}</p>
    </div>
);

const TasksTab = ({ team, tasks, refreshTasks }) => {
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', deadline: '' });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            console.log("Creating task for team:", team._id, newTask);
            const res = await api.post(`/tasks/${team._id}`, newTask);
            console.log("Task created:", res.data);
            setNewTask({ title: '', description: '', priority: 'Medium', deadline: '' });
            setShowNewTask(false);
            refreshTasks();
        } catch (err) {
            console.error("Task creation failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to create task");
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            await api.patch(`/tasks/${team._id}/${taskId}`, updates);
            refreshTasks();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">Tasks</h2>
                <button onClick={() => setShowNewTask(true)} className="px-6 py-2.5 bg-primary rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20">Create Task</button>
            </div>

            <AnimatePresence>
                {showNewTask && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card p-8 border-primary/20 space-y-6">
                        <h3 className="text-xl font-bold">Add Sprint Goal</h3>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <input required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary" />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="bg-[#0f172a] border border-white/10 rounded-xl p-4 outline-none">
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                                <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} className="bg-[#0f172a] border border-white/10 rounded-xl p-4 outline-none text-gray-400" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowNewTask(false)} className="px-6 py-3 font-bold text-gray-500">Cancel</button>
                                <button type="submit" className="px-10 py-3 bg-primary rounded-xl font-bold">Initialize</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task._id} className="glass-card p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => updateTask(task._id, { status: task.status === 'Completed' ? 'To-Do' : 'Completed' })}
                                className={cn("w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all", task.status === 'Completed' ? "bg-green-500 border-green-500" : "border-white/10 hover:border-primary")}
                            >
                                {task.status === 'Completed' && <Check className="w-4 h-4 text-white" />}
                            </button>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <h4 className={cn("font-bold text-lg", task.status === 'Completed' && "text-gray-500 line-through")}>{task.title}</h4>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                        task.priority === 'Urgent' ? "bg-red-500/20 text-red-500" : "bg-primary/10 text-primary"
                                    )}>{task.priority}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</div>
                                    <div>{task.status}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ResourcesTab = ({ team, refreshTeam, refreshTasks }) => {
    const handleTemplateApply = async (templateName) => {
        try {
            console.log("Applying template:", templateName, "to team:", team._id);
            const res = await api.post(`/teams/${team._id}/template`, { templateName });
            console.log("Template response:", res.data);
            refreshTeam();
            refreshTasks();
            alert(`Template ${templateName} applied and tasks seeded!`);
        } catch (err) {
            console.error("Template application failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to apply template");
        }
    };

    const toggleChecklist = async (itemId, completed) => {
        try {
            await api.patch(`/teams/${team._id}/checklist/${itemId}`, { completed });
            refreshTeam();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h2 className="text-3xl font-black mb-2">Hackathon Utilities</h2>
                <p className="text-gray-500">Submission checklists and templates.</p>
            </header>

            {!team?.template || team.template === 'None' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['SIH', 'Generic Hackathon', 'SaaS MVP'].map(tpl => (
                        <div key={tpl} className="glass-card p-8 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => handleTemplateApply(tpl)}>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{tpl} Template</h3>
                            <p className="text-xs text-gray-500">Seed workspace with {tpl} specific tasks and checkpoints.</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Checklist */}
                    <div className="glass-card p-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <ListChecks className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold">Submission Checklist</h3>
                        </div>
                        <div className="space-y-4">
                            {team.submissionChecklist.map(item => (
                                <button key={item._id} onClick={() => toggleChecklist(item._id, !item.completed)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                                    <span className={cn("text-sm font-bold tracking-tight", item.completed && "text-gray-500 line-through")}>{item.item}</span>
                                    <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center", item.completed ? "bg-primary" : "border-2 border-white/10 group-hover:border-primary")}>
                                        {item.completed && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reminders / Info */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent">
                            <h3 className="font-bold mb-4 flex items-center"><Calendar className="w-5 h-5 mr-3 text-indigo-400" /> Key Deadlines</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Abstract Submission</span>
                                    <span className="font-black">Feb 15</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>MVP Prototype</span>
                                    <span className="font-black">Feb 20</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AITab = ({ team }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I'm your **${team?.name}** mentor. I'm here to help you refine problem statements, structure technical solutions, or plan your PPT. What can I help with?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            const errorMsg = err.response?.data?.error || "I'm having trouble connecting to my central brain. Please check your API configuration.";
            setMessages([...newMessages, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const QuickAction = ({ label, type, prompt }) => (
        <button
            onClick={() => handleSend(type, prompt)}
            className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all whitespace-nowrap"
        >
            {label}
        </button>
    );

    return (
        <div className="h-[calc(100vh-16rem)] flex flex-col pt-4">
            <div className="flex-1 glass-card overflow-hidden flex flex-col relative border-indigo-500/20">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold">HackAssistant AI</h3>
                            <p className="text-[10px] text-green-500 uppercase font-black">Powered by Gemini</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 pb-40">
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={cn("flex space-x-4", m.role === 'user' ? "flex-row-reverse space-x-reverse" : "")}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                m.role === 'user' ? "bg-white/10" : "bg-primary"
                            )}>
                                {m.role === 'user' ? <Users className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                            </div>
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed max-w-xl prose prose-invert overflow-hidden",
                                m.role === 'user' ? "bg-white/5 rounded-tr-none" : "bg-indigo-500/10 border border-white/5 rounded-tl-none text-gray-300"
                            )}>
                                <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex space-x-4 animate-pulse">
                            <div className="w-8 h-8 rounded-xl bg-primary/20" />
                            <div className="h-10 bg-white/5 rounded-2xl w-32" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        <QuickAction label="Refine Problem" type="refine_problem" prompt={`Find gaps in our idea for ${team?.name}.`} />
                        <QuickAction label="Solution Approach" type="solution_approach" prompt={`How should we build a ${team?.hackathonName} project?`} />
                        <QuickAction label="Module Breakdown" type="module_breakdown" prompt={`What technical modules do we need?`} />
                        <QuickAction label="PPT Outline" type="ppt_outline" prompt={`Give me a pitch deck outline.`} />
                    </div>

                    <div className="relative glass p-2 rounded-3xl border border-white/10 shadow-2xl bg-[#0f172a]/80 backdrop-blur-xl">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="w-full bg-transparent p-4 pl-6 outline-none text-sm placeholder:text-gray-500 pr-16"
                            placeholder="Ask Gemini for technical guidance..."
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamTab = ({ team }) => (
    <div className="space-y-10 pb-20">
        <h2 className="text-3xl font-black">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team?.members?.map((m) => (
                <div key={m.user?._id} className="glass-card p-8 transition-all">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-black uppercase text-white">
                            {m.user?.displayName?.substring(0, 2) || m.user?.email?.substring(0, 2)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{m.user?.displayName || m.user?.email?.split('@')[0]}</h3>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{m.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const GithubTab = ({ team, refreshTeam }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/github/stats/${team._id}`);
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch GitHub stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (team?.githubConnected && team?.githubRepoName) {
            fetchStats();
        }
    }, [team?.githubConnected, team?.githubRepoName]);

    const handleConnect = async () => {
        try {
            const res = await api.get(`/github/auth/${team._id}`);
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error("Failed to initiate GitHub auth", err);
            const msg = err.response?.data?.message || "Failed to initiate GitHub auth. Please check your connection.";
            alert(msg);
        }
    };

    const handleRepoConnect = async (e) => {
        e.preventDefault();
        try {
            setConnecting(true);
            await api.post(`/github/connect-repo/${team._id}`, repoInfo);
            refreshTeam();
            setRepoInfo({ owner: '', repo: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to connect repository");
        } finally {
            setConnecting(false);
        }
    };

    // Prepare chart data
    const commitData = stats?.commits ? stats.commits.reverse().map((c, i) => ({
        name: new Date(c.commit.author.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        commits: 1 // Simplified: each entry is 1 commit, better to group by date
    })).reduce((acc, curr) => {
        const existing = acc.find(a => a.name === curr.name);
        if (existing) existing.commits += 1;
        else acc.push(curr);
        return acc;
    }, []) : [];

    const contributorData = stats?.contributors?.map(c => ({
        name: c.login,
        contributions: c.contributions
    })) || [];

    if (!team?.githubConnected) {
        return (
            <div className="text-center py-32 glass-card">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Github className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-black mb-4">Connect GitHub</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-10">Authorize HackTracker to read repository activity and track your team's progress.</p>
                <button
                    onClick={handleConnect}
                    className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center space-x-3 mx-auto shadow-xl"
                >
                    <Github className="w-5 h-5" />
                    <span>Authorize with GitHub</span>
                </button>
            </div>
        );
    }

    if (!team?.githubRepoName) {
        return (
            <div className="max-w-2xl mx-auto py-20">
                <div className="glass-card p-10">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">GitHub Authorized</h2>
                            <p className="text-gray-500 text-sm">Now link your project repository.</p>
                        </div>
                    </div>

                    <form onSubmit={handleRepoConnect} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Repo Owner (e.g. facebook)</label>
                                <input
                                    required
                                    value={repoInfo.owner}
                                    onChange={e => setRepoInfo({ ...repoInfo, owner: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition-all"
                                    placeholder="Username or Org"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Repo Name (e.g. react)</label>
                                <input
                                    required
                                    value={repoInfo.repo}
                                    onChange={e => setRepoInfo({ ...repoInfo, repo: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition-all"
                                    placeholder="Repository name"
                                />
                            </div>
                        </div>
                        <button
                            disabled={connecting}
                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50"
                        >
                            {connecting ? 'Validating...' : 'Connect Repository'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="py-40 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Fetching repository insights...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black mb-1">{team.githubRepoName}</h2>
                    <p className="text-gray-500 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <a href={team.githubRepo} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{team.githubRepoOwner}/{team.githubRepoName}</a>
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={fetchStats} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Commit Activity */}
                <div className="glass-card p-8 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold mb-8 flex items-center">
                        <Target className="w-5 h-5 mr-3 text-blue-500" />
                        Commit Velocity
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={commitData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={4} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Contributor Contributions */}
                <div className="glass-card p-8 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold mb-8 flex items-center">
                        <Users className="w-5 h-5 mr-3 text-purple-500" />
                        Top Contributors
                    </h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contributorData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="contributions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Pull Requests */}
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold mb-8 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-3 text-green-500" />
                        Recent Pull Requests
                    </h3>
                    <div className="space-y-4">
                        {stats?.pullRequests?.length > 0 ? stats.pullRequests.map(pr => (
                            <div key={pr.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                <div>
                                    <h4 className="font-bold text-sm mb-1">{pr.title}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                        #{pr.number} by {pr.user.login} • {pr.state}
                                    </p>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                                    pr.state === 'open' ? "bg-green-500/10 text-green-500" : "bg-purple-500/10 text-purple-500"
                                )}>
                                    {pr.state}
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-gray-600 text-sm">No pull requests found.</p>
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold mb-8 flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-indigo-500" />
                        Recent Commits
                    </h3>
                    <div className="space-y-4">
                        {stats?.commits?.slice(0, 5).map(commit => (
                            <div key={commit.sha} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <img src={commit.author?.avatar_url} className="w-10 h-10 rounded-xl" alt="" />
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm truncate">{commit.commit.message}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest truncate">
                                        {commit.author?.login} committed {new Date(commit.commit.author.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
