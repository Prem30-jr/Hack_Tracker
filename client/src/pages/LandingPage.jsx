import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, Zap, Github, Shield, Cpu, ArrowRight, Code2 } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] selection:bg-primary/30 relative overflow-hidden text-white">
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full opacity-40 animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full opacity-40 animate-pulse-slow delay-1000" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/60 backdrop-blur-xl transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <Code2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-colors">HackTracker</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-full"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-primary py-2.5 px-6 rounded-xl shadow-lg shadow-primary/25"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black text-primary mb-8 uppercase tracking-widest backdrop-blur-md shadow-lg">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span>v2.0 Beta Live</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
                            Build the future <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">faster, together.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                            The ultimate collaboration hub for hackathon teams.
                            Manage tasks, track progress, and leverage AI insights—all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center group active:scale-95 hover:-translate-y-1"
                            >
                                Launch Your Team <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all active:scale-95 hover:-translate-y-1 backdrop-blur-md">
                                View Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-primary" />}
                            title="Team Dashboard"
                            description="A central hub for your team to stay aligned and focused on the goal."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Sprint Tasks"
                            description="Agile task tracking optimized for 24-48 hour hackathon cycles."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Github className="w-6 h-6 text-white" />}
                            title="Repo Analytics"
                            description="Keep an eye on commit velocity and project health in real-time."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Cpu className="w-6 h-6 text-purple-400" />}
                            title="AI Architect"
                            description="Instantly generate boilerplate or debug code with our built-in assistant."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-emerald-400" />}
                            title="Protected Workspace"
                            description="Private spaces for your team with role-based access control."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Rocket className="w-6 h-6 text-rose-400" />}
                            title="Vibrant UI"
                            description="A stunning interface designed to keep morale high under pressure."
                            delay={0.6}
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <div className="relative rounded-[3rem] overflow-hidden bg-[#0f172a] border border-white/10 p-12 md:p-24 text-center shadow-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none animate-pulse-slow" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none animate-pulse-slow delay-700" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Ready to win?</h2>
                            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join 500+ teams already using HackTracker to build award-winning projects at hackathons worldwide.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-10 py-5 bg-white text-[#0f172a] rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 active:scale-95 hover:-translate-y-1"
                            >
                                Create Free Account
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 bg-[#020617] relative z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <Code2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="font-bold text-gray-300">HackTracker</span>
                    </div>
                    <p className="font-medium">© 2024 HackTracker. Built for builders.</p>
                    <div className="flex items-center space-x-8 mt-4 md:mt-0 font-bold">
                        <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                        <a href="#" className="hover:text-primary transition-colors">Discord</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay, duration: 0.5 }}
        whileHover={{ y: -8 }}
        className="glass-card p-8 group hover:bg-[#1e293b]/40 border-white/5 hover:border-primary/30 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[30px] -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-0" />
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-white/5 group-hover:bg-white/10 relative z-10">
            {icon}
        </div>
        <h3 className="text-xl font-black mb-3 text-gray-100 group-hover:text-primary transition-colors relative z-10">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm font-medium relative z-10">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;
