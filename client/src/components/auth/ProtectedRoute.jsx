import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse-slow" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-6" />
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-sm animate-pulse">Initializing Interface...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
