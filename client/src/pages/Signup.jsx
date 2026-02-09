import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to create an account. " + err.message);
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <AuthLayout title="Create Account" subtitle="Join HackTracker today">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center text-rose-400 text-sm font-medium animate-fade-in">
                        <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            required
                            className="input-field pl-12"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            required
                            className="input-field pl-12"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            required
                            className="input-field pl-12"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full btn-primary py-4 mt-6 text-lg font-bold shadow-xl shadow-primary/20 group relative overflow-hidden"
                >
                    <span className={`relative z-10 flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        Sign Up
                    </span>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:text-primary-hover hover:underline transition-all ml-1">
                    Log In
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Signup;
