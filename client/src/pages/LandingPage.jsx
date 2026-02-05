import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, Zap, Github, Shield, Cpu, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] selection:bg-primary/30">
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Rocket className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">HackTracker</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span>Now in Beta for Hackathon Teams</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
                            Build the future <br />
                            <span className="gradient-text">faster, together.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            The ultimate collaboration hub for hackathon teams.
                            Manage tasks, track progress, and leverage AI insights—all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center group"
                            >
                                Launch Your Team <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all">
                                View Sample Project
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-blue-400" />}
                            title="Team Dashboard"
                            description="A central hub for your team to stay aligned and focused on the goal."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Sprint Tasks"
                            description="Agile task tracking optimized for 24-48 hour hackathon cycles."
                        />
                        <FeatureCard
                            icon={<Github className="w-6 h-6 text-white" />}
                            title="Repo Analytics"
                            description="Keep an eye on commit velocity and project health in real-time."
                        />
                        <FeatureCard
                            icon={<Cpu className="w-6 h-6 text-purple-400" />}
                            title="AI Generation"
                            description="Instantly generate boilerplate or debug code with our built-in assistant."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            title="Protected Workspace"
                            description="Private spaces for your team with role-based access control."
                        />
                        <FeatureCard
                            icon={<Rocket className="w-6 h-6 text-red-400" />}
                            title="Vibrant UI"
                            description="A stunning interface designed to keep morale high under pressure."
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-6 py-32">
                    <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 p-12 md:p-20 text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to win?</h2>
                            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                                Join 500+ teams already using HackTracker to build award-winning projects.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                            >
                                Create Account Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Rocket className="w-5 h-5 text-primary" />
                        <span className="font-bold text-white">HackTracker</span>
                    </div>
                    <p>© 2024 HackTracker. Built for builders.</p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Discord</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all text-left group"
    >
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;
