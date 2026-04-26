import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, LogOut, Shield, Image, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || '',
    });
    const [loading, setLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedUser = { ...res.data, token };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            updateUser(res.data);
            toast.success("Profile updated!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-terra-dark overflow-hidden flex flex-col z-40">
            <Helmet>
                <title>My Profile | Terra Vanguard</title>
                <meta name="description" content="Manage your Terra Vanguard class portal profile." />
            </Helmet>
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-terra-emerald/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[40%] rounded-full bg-terra-neon/5 blur-[120px]" />
            </div>

            {/* Back Button */}
            <div className="relative z-10 px-6 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-terra-light/60 hover:text-terra-neon transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Go Back</span>
                </button>
            </div>

            {/* Content — centered, no scroll */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-3xl font-display font-bold text-white">Operative <span className="text-terra-neon">Dossier</span></h1>
                        <p className="text-terra-light/70 text-sm">Manage your identity and display information.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full border-4 border-terra-darker bg-terra-stone flex items-center justify-center overflow-hidden shadow-xl mb-4">
                                {formData.avatar || user?.avatar ? (
                                    <img src={formData.avatar || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={36} className="text-terra-light/50" />
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">{user?.name || user?.username}</h2>
                            <p className="text-terra-light/50 text-xs font-mono mb-3">@{user?.username}</p>
                            <div className="flex items-center space-x-1 mb-5">
                                <Shield size={13} className={user?.role === 'admin' ? 'text-yellow-400' : 'text-terra-light/50'} />
                                <span className={`text-xs font-medium uppercase tracking-wider ${user?.role === 'admin' ? 'text-yellow-400' : 'text-terra-light/50'}`}>
                                    {user?.role === 'admin' ? 'Commander' : 'Operative'}
                                </span>
                            </div>

                            <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center justify-center space-x-2 w-full py-2.5 text-sm text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-lg transition-all border border-red-400/20">
                                <LogOut size={15} />
                                <span className="font-bold">Terminate Session</span>
                            </button>
                        </motion.div>

                        {/* Edit Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="md:col-span-2 glass-card p-6"
                        >
                            <h3 className="text-lg font-bold text-white mb-1 border-b border-terra-stone pb-3">Update Profile</h3>
                            <p className="text-terra-light/50 text-xs mb-5 pt-2">To change your Callsign or Password, contact an administrator.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-2">Display Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={16} />
                                            <input
                                                type="text"
                                                name="name"
                                                className="input-field pl-9"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-2">Avatar URL <span className="text-terra-light/40 normal-case font-normal">(optional)</span></label>
                                        <div className="relative">
                                            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={16} />
                                            <input
                                                type="text"
                                                name="avatar"
                                                className="input-field pl-9"
                                                placeholder="https://example.com/photo.jpg"
                                                value={formData.avatar}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <p className="text-terra-light/40 text-xs mt-1 ml-1">Paste an image URL to set your avatar.</p>
                                    </div>
                                </div>

                                {/* Read-only info */}
                                <div className="pt-3 border-t border-terra-stone">
                                    <p className="text-xs font-bold text-terra-light/60 uppercase tracking-wider mb-3">Account Info (Read-Only)</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-terra-darker/60 rounded-lg p-3 border border-terra-stone">
                                            <p className="text-[10px] text-terra-light/40 uppercase tracking-wider mb-1">Callsign</p>
                                            <p className="text-sm font-mono font-bold text-terra-light">{user?.username}</p>
                                        </div>
                                        <div className="bg-terra-darker/60 rounded-lg p-3 border border-terra-stone">
                                            <p className="text-[10px] text-terra-light/40 uppercase tracking-wider mb-1">Clearance</p>
                                            <p className={`text-sm font-bold uppercase ${user?.role === 'admin' ? 'text-yellow-400' : 'text-terra-neon'}`}>{user?.role === 'admin' ? 'Commander' : 'Operative'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-1 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-terra-dark border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <><Save size={16} /> <span>Save Changes</span></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card w-full max-w-sm p-6 relative border border-red-500/30"
                        >
                            <div className="flex items-center gap-3 mb-4 text-red-400">
                                <LogOut size={24} />
                                <h3 className="text-xl font-bold font-display uppercase tracking-wider">Terminate Session?</h3>
                            </div>
                            <p className="text-terra-light/70 text-sm mb-6">Are you sure you want to disconnect from the Vanguard network?</p>
                            <div className="flex gap-3">
                                <button onClick={() => { logout(); setShowLogoutConfirm(false); }} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 font-bold py-2 px-4 rounded-lg transition-all text-sm">
                                    Yes, Disconnect
                                </button>
                                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-terra-darker text-terra-light/70 hover:text-white border border-terra-stone hover:border-terra-light/30 font-bold py-2 px-4 rounded-lg transition-all text-sm">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
