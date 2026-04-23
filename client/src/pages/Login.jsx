import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [masterPassword, setMasterPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const user = await login(username, password);
                if (user.role !== role) {
                    toast.error(`Access Denied. Identity mismatch for ${role === 'admin' ? 'Commander' : 'Operative'} terminal.`);
                    return;
                }
                toast.success("Welcome back to Terra Vanguard!");
                navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
            } else {
                const userData = { username, password, role };
                if (role === 'admin') userData.masterPassword = masterPassword;
                const user = await register(userData);
                toast.success("Registration successful! Welcome to the ranks.");
                navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-terra-dark flex items-center justify-center p-4 relative overflow-hidden">
            <Helmet>
                <title>{isLogin ? 'Access Terminal' : 'Request Entry'} | Terra Vanguard</title>
                <meta name="description" content="Login or register to access the Terra Vanguard class portal." />
            </Helmet>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-terra-neon/5 blur-[120px]"></div>
            </div>

            <Link to="/" className="absolute top-6 left-6 text-terra-light hover:text-terra-neon transition-colors flex items-center gap-2 font-medium">
                <ArrowRight size={20} className="rotate-180" /> Back to Base
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 relative">
                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${role === 'admin' ? 'from-yellow-400 to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'from-terra-emerald to-terra-neon shadow-[0_0_20px_rgba(0,255,136,0.3)]'} rounded-2xl flex items-center justify-center mb-4 transition-all duration-500`}>
                            <Shield size={32} className="text-terra-darker" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">
                            {role === 'admin' ? 'Commander Access' : 'Operative Access'}
                        </h2>
                        <p className="text-terra-light/60 text-sm">
                            {isLogin ? 'Initialize terminal link to proceed.' : 'Submit credentials for registration.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex bg-terra-darker/50 p-1 rounded-lg border border-terra-stone mb-4">
                            <button type="button" onClick={() => setRole('user')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'user' ? 'bg-terra-neon text-terra-dark shadow-sm' : 'text-terra-light/60 hover:text-white'}`}>Operative</button>
                            <button type="button" onClick={() => setRole('admin')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-yellow-500 text-terra-dark shadow-sm' : 'text-terra-light/60 hover:text-white'}`}>Commander</button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-terra-light/80 uppercase tracking-wider font-semibold ml-1">Callsign (Username)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-light/50">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    className="input-field pl-10" 
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-terra-light/80 uppercase tracking-wider font-semibold ml-1">Access Code (Password)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-light/50">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    className="input-field pl-10" 
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {!isLogin && role === 'admin' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-1"
                            >
                                <label className="text-xs text-terra-neon uppercase tracking-wider font-semibold ml-1">Master Override Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-neon/50">
                                        <Shield size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="input-field pl-10 border-terra-neon/30 focus:border-terra-neon bg-terra-neon/5" 
                                        placeholder="Required for admin role"
                                        value={masterPassword}
                                        onChange={(e) => setMasterPassword(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full mt-6 flex justify-center items-center"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-terra-dark border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                isLogin ? 'Initialize Uplink' : 'Forge Identity'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-terra-stone pt-6">
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className="text-sm text-terra-light/60 hover:text-terra-neon transition-colors"
                        >
                            {isLogin ? "Don't have an identity? Request entry." : "Already an operative? Access terminal."}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
