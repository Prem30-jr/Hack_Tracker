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
    Check
} from 'lucide-react';

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
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Header */}
            <header className="px-8 py-6 h-24 flex items-center justify-between border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <LayoutGrid className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <span className="text-xl font-bold block leading-none">Dashboard</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">HackTracker Ecosystem</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-sm font-bold">{user?.displayName || user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-primary font-medium">Verified Builder</p>
                    </div>
                    <div className="h-10 w-px bg-white/10 mx-2" />
                    <button
                        onClick={handleLogout}
                        className="p-3 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16">
                {/* Error Banner */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center">
                        <X className="w-4 h-4 mr-2" onClick={() => setError('')} />
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                            Build <span className="gradient-text">Something Grand.</span>
                        </h2>
                        <p className="text-gray-400 text-lg">Create a new team or enter an existing workspace.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium flex items-center bg-white/5">
                            <Star className="w-4 h-4 text-yellow-500 mr-2" /> {myTeams.length} Active Teams
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
                    {/* Create Team Action */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="lg:col-span-7 group relative"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                        <div className="relative p-10 h-full rounded-[2.5rem] glass-card border-primary/20 hover:border-primary/50 cursor-pointer flex flex-col">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                                <Plus className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-4">Create Team</h3>
                            <p className="text-gray-400 text-lg mb-8 max-w-md">Launch a new workspace, define your goals, and generate your invite link.</p>

                            <div className="mt-auto flex items-center text-primary font-bold text-lg group-hover:translate-x-2 transition-transform">
                                New Workspace <ArrowRight className="ml-2 w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Join Team Action */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="p-10 rounded-[2.5rem] glass-card border-white/10 grow flex flex-col">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20">
                                <Users className="w-9 h-9 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Join Team</h3>
                            <p className="text-gray-400 mb-8">Enter the unique invite code shared by your team lead.</p>

                            <form onSubmit={handleJoinTeam} className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. A1B2C3D4"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary outline-none font-mono text-lg transition-all"
                                    value={inviteLink}
                                    onChange={(e) => setInviteLink(e.target.value.toUpperCase())}
                                />
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="absolute right-2 top-2 h-[calc(100%-1rem)] px-6 bg-primary hover:bg-blue-600 rounded-xl text-white font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Join'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* My Teams List */}
                {myTeams.length > 0 && (
                    <section className="mt-20">
                        <h3 className="text-2xl font-bold mb-8 flex items-center">
                            <Clock className="w-6 h-6 mr-3 text-gray-500" /> Your Workspaces
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myTeams.map((team) => (
                                <motion.div
                                    key={team._id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/workspace/${team._id}`)}
                                    className="p-6 rounded-3xl glass-card border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2 bg-white/5 px-2 py-1 rounded-lg">
                                            {team.members.length} Members
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-1 truncate">{team.name}</h4>
                                    <p className="text-sm text-gray-500 truncate">{team.hackathonName || 'Open Project'}</p>
                                    <div className="mt-8 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Enter Workspace <ChevronRight className="w-3 h-3 ml-1" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Create Team Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-card p-10 shadow-2xl overflow-hidden"
                        >
                            {!createdTeam ? (
                                <>
                                    <h3 className="text-3xl font-black mb-2">Create New Team</h3>
                                    <p className="text-gray-400 mb-8">Set up your workspace and invite your crew.</p>

                                    <form onSubmit={handleCreateTeam} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Team Name</label>
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                                placeholder="e.g. Neural Ninjas"
                                                value={newTeam.name}
                                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hackathon Name (Optional)</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                                placeholder="e.g. Global Hack 2024"
                                                value={newTeam.hackathonName}
                                                onChange={(e) => setNewTeam({ ...newTeam, hackathonName: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateModal(false)}
                                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all text-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={loading}
                                                type="submit"
                                                className="flex-2 py-4 bg-primary hover:bg-blue-600 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                            >
                                                {loading ? 'Creating...' : 'Initialize Team'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-2">Team Ready!</h3>
                                    <p className="text-gray-400 mb-10">Share this code with your teammates to join.</p>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 group relative">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Invite Code</p>
                                        <p className="text-5xl font-black font-mono tracking-tighter text-primary">{createdTeam.inviteCode}</p>
                                        <button
                                            onClick={() => copyToClipboard(createdTeam.inviteCode)}
                                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/workspace/${createdTeam._id}`)}
                                        className="w-full py-5 bg-primary hover:bg-blue-600 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center"
                                    >
                                        Enter Workspace <ChevronRight className="ml-2 w-5 h-5" />
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

const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
);

export default Dashboard;
