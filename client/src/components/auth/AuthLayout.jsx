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
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, -30, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-secondary/20 blur-[120px] rounded-full"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-10 shadow-2xl shadow-black/50 border-white/10 backdrop-blur-2xl bg-[#0f172a]/60">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 bg-gradient-to-tr from-primary to-primary-hover rounded-2xl flex items-center justify-center mb-6 cursor-pointer shadow-lg shadow-primary/20 border border-white/10"
                            onClick={() => navigate('/')}
                        >
                            <Rocket className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tight text-center">{title}</h1>
                        <p className="text-gray-400 mt-2 text-center text-sm font-medium">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
