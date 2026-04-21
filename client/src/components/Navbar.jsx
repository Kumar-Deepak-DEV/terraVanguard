import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const notifRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = async () => {
            try {
                const token = JSON.parse(sessionStorage.getItem('user'))?.token;
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(res.data);
            } catch (err) {}
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotifClick = async (notif) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${notif._id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, readBy: [...n.readBy, user._id] } : n));
        } catch (err) {}
        
        setNotificationsOpen(false);
        navigate(`/ideas?ideaId=${notif.ideaId}`);
    };

    const navLinks = user ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Event Ideas', path: '/ideas' },
        { name: 'Hall of Fame', path: '/dashboard/hall-of-fame' },
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Hall of Fame', path: '/hall-of-fame' },
        { name: 'Events', path: '/events' },
    ];

    const unreadCount = notifications.filter(n => !n.readBy.includes(user?._id)).length;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-terra-darker/90 backdrop-blur-md border-b border-terra-neon/20 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center">
                        <span 
                            className="text-5xl tracking-wide font-normal" 
                            style={{ 
                                fontFamily: "'Great Vibes', cursive", 
                                background: 'linear-gradient(to bottom, #8CE022, #477A0A)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0px 2px 4px rgba(104, 172, 17, 0.3))'
                            }}
                        >
                            Terra
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'text-terra-neon border-b-2 border-terra-neon' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="relative" ref={notifRef}>
                                    <button 
                                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        className="relative p-2 text-terra-light hover:text-terra-neon transition-colors"
                                    >
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-terra-darker">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {notificationsOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 bg-terra-darker border border-terra-stone rounded-xl shadow-2xl overflow-hidden z-50"
                                            >
                                                <div className="p-3 border-b border-terra-stone bg-terra-dark">
                                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-6 text-center text-terra-light/50 text-sm">No new notifications</div>
                                                    ) : (
                                                        notifications.map(notif => (
                                                            <div 
                                                                key={notif._id} 
                                                                onClick={() => handleNotifClick(notif)}
                                                                className={`p-3 border-b border-terra-stone/50 hover:bg-terra-stone/30 cursor-pointer transition-colors flex items-start gap-3 ${!notif.readBy.includes(user._id) ? 'bg-terra-neon/5' : ''}`}
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-terra-stone flex items-center justify-center shrink-0 overflow-hidden">
                                                                    {notif.sender?.avatar ? <img src={notif.sender.avatar} alt="avatar" /> : <User size={14} className="text-terra-light" />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-terra-light/90 leading-tight mb-1">{notif.message}</p>
                                                                    <p className="text-[10px] text-terra-light/40">{new Date(notif.createdAt).toLocaleString()}</p>
                                                                </div>
                                                                {!notif.readBy.includes(user._id) && <div className="w-2 h-2 bg-terra-neon rounded-full mt-1 shrink-0"></div>}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <Link to="/profile" className="flex items-center text-terra-light hover:text-terra-neon transition-colors" title="Profile">
                                    <div className="w-8 h-8 rounded-full bg-terra-stone flex items-center justify-center overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                                    </div>
                                </Link>
                                <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-lg transition-all border border-red-400/20">
                                    <LogOut size={15} />
                                    <span className="font-bold">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary text-sm px-6 py-2">Login</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-terra-neon focus:outline-none">
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-terra-darker border-b border-terra-neon/20 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block text-base font-medium text-white hover:text-terra-neon py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-terra-stone">
                                {user ? (
                                    <div className="flex flex-col space-y-4">
                                        <Link to="/profile" className="flex items-center space-x-2 text-terra-light" onClick={() => setMobileMenuOpen(false)}>
                                            <div className="w-8 h-8 rounded-full bg-terra-stone flex items-center justify-center overflow-hidden">
                                                {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                                            </div>
                                            <span>Profile</span>
                                        </Link>
                                        <button onClick={() => { setShowLogoutConfirm(true); setMobileMenuOpen(false); }} className="flex items-center justify-center space-x-2 w-full py-2.5 text-sm text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-lg transition-all border border-red-400/20 mt-2">
                                            <LogOut size={15} />
                                            <span className="font-bold">Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="w-full btn-primary flex justify-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </nav>
    );
};

export default Navbar;
