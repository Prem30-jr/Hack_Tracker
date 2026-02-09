import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import {
    Plus,
    Users,
    ArrowRight,
    LogOut,
    LayoutGrid,
    Star,
    Clock,
    X,
    Trophy,
    Copy,
    Check,
    ChevronRight,
    Sparkles,
    Code2,
    Calendar
} from 'lucide-react';
import { cn } from '../utils/cn';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [inviteLink, setInviteLink] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', hackathonName: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdTeam, setCreatedTeam] = useState(null);
    const [copied, setCopied] = useState(false);
    const [myTeams, setMyTeams] = useState([]);

    useEffect(() => {
        fetchMyTeams();
    }, []);

    const fetchMyTeams = async () => {
        try {
            const res = await api.get('/teams');
            setMyTeams(res.data);
        } catch (err) {
            console.error("Failed to fetch teams", err);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/teams', newTeam);
            setCreatedTeam(res.data);
            fetchMyTeams();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create team");
        }
        setLoading(false);
    };

    const handleJoinTeam = async (e) => {
        e.preventDefault();
        if (!inviteLink) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.post(`/teams/join/${inviteLink}`);
            navigate(`/workspace/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid invite code");
        }
        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] opacity-30" />
            </div>

            {/* Header */}
            <header className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-[#030712]/60 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-colors">HackTracker</span>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-3 bg-white/5 px-1.5 py-1.5 pr-4 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                            {user?.email?.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-gray-300">{user?.displayName || 'Builder'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Hero / Welcome */}
                <div className="mb-16 relative overflow-hidden rounded-[2rem] bg-[#0f172a]/40 border border-white/5 p-10 md:p-16 isolate">
                    <div className="absolute inset-0 bg-hero-glow opacity-50" />
                    <div className="absolute top-0 right-0 p-20 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20 opacity-30" />

                    <div className="relative z-10 max-w-3xl">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Mission Control</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">ship?</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                            Manage your hackathon projects, track progress with real-time analytics, and collaborate with your squad in one unified workspace.
                        </motion.p>
                    </div>
                </div>

                {/* Main Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {/* Create Team Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => setShowCreateModal(true)}
                        className="lg:col-span-2 group relative cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-[2rem] duration-500" />
                        <div className="relative h-full glass-card p-10 flex flex-col items-start justify-between border-primary/20 hover:border-primary/50 bg-[#0f172a]/60">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mb-8 shadow-2xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-black mb-3">Initialize New Project</h2>
                                <p className="text-gray-400 max-w-lg text-lg">Spin up a new collaborative workspace with built-in task tracking, AI assistance, and GitHub sync.</p>
                            </div>
                            <div className="mt-10 flex items-center text-primary font-black group-hover:translate-x-2 transition-transform text-lg">
                                Create Workspace <ArrowRight className="ml-3 w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Join Team Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-10 flex flex-col justify-center bg-[#0f172a]/60"
                    >
                        <div className="flex items-center space-x-5 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Users className="w-7 h-7 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Join Squad</h3>
                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Via Invite Code</p>
                            </div>
                        </div>

                        <form onSubmit={handleJoinTeam} className="relative">
                            <input
                                type="text"
                                placeholder="A1B2C3"
                                className="input-field pr-24 font-mono text-xl uppercase tracking-widest text-center"
                                value={inviteLink}
                                onChange={(e) => setInviteLink(e.target.value.toUpperCase())}
                            />
                            <button
                                disabled={loading}
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:text-white text-gray-400"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : 'Join'}
                            </button>
                        </form>
                        {error && <p className="text-rose-400 text-xs mt-4 font-bold flex items-center justify-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20"><X className="w-3 h-3 mr-2" /> {error}</p>}
                    </motion.div>
                </div>

                {/* Projects Section */}
                <div>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black flex items-center tracking-tight">
                            <LayoutGrid className="w-6 h-6 mr-4 text-primary" />
                            Active Projects
                            <span className="ml-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 font-bold">{myTeams.length}</span>
                        </h2>
                    </div>

                    {myTeams.length === 0 ? (
                        <div className="glass-panel p-20 text-center border-dashed border-white/10 flex flex-col items-center justify-center bg-transparent">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600 animate-pulse">
                                <Trophy className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-300">No active projects</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Your dashboard is empty. Create a new team or join an existing one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myTeams.map((team, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    key={team._id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/workspace/${team._id}`)}
                                    className="glass-card p-8 cursor-pointer group hover:bg-[#1e293b]/60 border-white/5 hover:border-primary/30 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center border border-white/10 shadow-lg group-hover:border-primary/30 transition-colors">
                                            <Trophy className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            team.hackathonName ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-primary/10 text-primary border-primary/20"
                                        )}>
                                            {team.hackathonName ? 'Hackathon' : 'Project'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors tracking-tight">{team.name}</h3>
                                    <div className="flex flex-col space-y-1 mb-6">
                                        <p className="text-sm text-gray-400 font-medium truncate">{team.hackathonName || 'General Development'}</p>
                                        {team.hackathonStartDate && (
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center">
                                                <Calendar className="w-3 h-3 mr-1.5 text-secondary" />
                                                {new Date(team.hackathonStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                                        <div className="flex items-center -space-x-2">
                                            {team.members.slice(0, 3).map((m, idx) => (
                                                <div key={idx} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                    {m.user?.displayName?.charAt(0) || '?'}
                                                </div>
                                            ))}
                                            {team.members.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                    +{team.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors flex items-center uppercase tracking-wider">
                                            Open <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create Team Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg glass-card p-10 shadow-2xl relative border-t border-white/10"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            {!createdTeam ? (
                                <>
                                    <div className="mb-10 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary-hover rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-primary/20 mx-auto">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-2 tracking-tight">Create Workspace</h3>
                                        <p className="text-gray-400">Set up a new space for your squad to collaborate.</p>
                                    </div>

                                    <form onSubmit={handleCreateTeam} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Team Name</label>
                                            <input
                                                required
                                                className="input-field bg-[#0f172a]/50 focus:bg-[#0f172a]"
                                                placeholder="e.g. Neural Ninjas"
                                                value={newTeam.name}
                                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Event Name</label>
                                            <input
                                                required
                                                className="input-field bg-[#0f172a]/50 focus:bg-[#0f172a]"
                                                placeholder="e.g. HackMIT 2024"
                                                value={newTeam.hackathonName}
                                                onChange={(e) => setNewTeam({ ...newTeam, hackathonName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Start Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    className="input-field bg-[#0f172a]/50 focus:bg-[#0f172a]"
                                                    value={newTeam.hackathonStartDate}
                                                    onChange={(e) => setNewTeam({ ...newTeam, hackathonStartDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Team Size</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="input-field bg-[#0f172a]/50 focus:bg-[#0f172a]"
                                                    value={newTeam.memberSize}
                                                    onChange={(e) => setNewTeam({ ...newTeam, memberSize: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full btn-primary py-4 text-lg mt-4 shadow-xl shadow-primary/20"
                                        >
                                            {loading ? 'Creating...' : 'Launch Workspace'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                                        <Check className="w-12 h-12 text-emerald-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-3 text-white">All Set!</h3>
                                    <p className="text-gray-400 mb-10 max-w-xs mx-auto">Your workspace has been successfully initialized. Here's your invite code:</p>

                                    <div className="bg-[#020617] border border-white/10 rounded-2xl p-6 mb-10 relative group hover:border-white/20 transition-colors">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Invite Code</p>
                                        <p className="text-5xl font-black font-mono tracking-tighter text-white">{createdTeam.inviteCode}</p>
                                        <button
                                            onClick={() => copyToClipboard(createdTeam.inviteCode)}
                                            className="absolute top-1/2 -translate-y-1/2 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5"
                                        >
                                            {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6 text-gray-400 group-hover:text-white" />}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/workspace/${createdTeam._id}`)}
                                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/20"
                                    >
                                        Enter Workspace
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
