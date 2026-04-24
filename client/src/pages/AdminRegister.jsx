import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRegister = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [masterPassword, setMasterPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !username || !password || !masterPassword) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const userData = { name, username, password, role: 'admin', masterPassword };
            const user = await register(userData);
            toast.success("Commander Registration successful!");
            navigate('/admin', { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-terra-dark flex items-center justify-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Admin Setup | Terra Vanguard</title>
                <meta name="description" content="Register as an administrator for the Terra Vanguard class portal." />
            </Helmet>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-yellow-500/5 blur-[120px]"></div>
            </div>

            <Link to="/login" className="absolute top-6 left-6 text-terra-light hover:text-yellow-400 transition-colors flex items-center gap-2 font-medium">
                <ArrowRight size={20} className="rotate-180" /> Back to Standard Login
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 relative border-t-4 border-t-yellow-500">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <Shield size={32} className="text-terra-darker" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Commander Initialization</h2>
                        <p className="text-terra-light/60 text-sm">Temporary backdoor for new admins.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs text-terra-light/80 uppercase tracking-wider font-semibold ml-1">Display Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-light/50">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    className="input-field pl-10 focus:border-yellow-500 focus:ring-yellow-500" 
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-terra-light/80 uppercase tracking-wider font-semibold ml-1">Commander Callsign</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-light/50">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    className="input-field pl-10 focus:border-yellow-500 focus:ring-yellow-500" 
                                    placeholder="Enter admin username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-terra-light/80 uppercase tracking-wider font-semibold ml-1">Access Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-terra-light/50">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    className="input-field pl-10 focus:border-yellow-500 focus:ring-yellow-500" 
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-terra-stone">
                            <label className="text-xs text-yellow-500 uppercase tracking-wider font-bold ml-1">Master Override Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/50">
                                    <Shield size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    className="input-field pl-10 border-yellow-500/30 focus:border-yellow-500 focus:ring-yellow-500 bg-yellow-500/5" 
                                    placeholder="Required master password"
                                    value={masterPassword}
                                    onChange={(e) => setMasterPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-6 flex justify-center items-center py-3 font-semibold text-terra-dark bg-yellow-500 rounded-lg transition-all hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-terra-dark border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                'Establish Command Link'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
