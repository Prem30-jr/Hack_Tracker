import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 shadow-2xl shadow-black/50">
                    <div className="flex flex-col items-center mb-10">
                        <div
                            className="p-4 bg-primary/10 rounded-2xl mb-6 cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => navigate('/')}
                        >
                            <Rocket className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
                        <p className="text-gray-400 mt-2 text-center text-sm">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
