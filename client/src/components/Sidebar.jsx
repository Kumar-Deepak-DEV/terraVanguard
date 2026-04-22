import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Lightbulb, Trophy, User, Menu, X, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const navItems = [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Events', path: '/admin/events', icon: Calendar },
        { name: 'Ideas', path: '/admin/ideas', icon: Lightbulb },
        { name: 'Hall of Fame', path: '/admin/hall-of-fame', icon: Trophy },
    ];

    return (
        <>
            <div className="md:hidden p-4 bg-terra-darker flex justify-between items-center border-b border-terra-stone z-50 fixed w-full">
                <span className="font-display font-bold text-xl text-white">TERRA <span className="text-terra-neon">ADMIN</span></span>
                <button onClick={() => setIsOpen(!isOpen)} className="text-terra-neon">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-terra-darker border-r border-terra-stone transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="h-20 flex items-center justify-center border-b border-terra-stone hidden md:flex">
                    <span className="font-display font-bold text-2xl text-white tracking-wider">TERRA <span className="text-terra-neon">ADMIN</span></span>
                </div>

                <div className="flex-grow py-8 overflow-y-auto mt-16 md:mt-0">
                    <nav className="space-y-2 px-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-terra-neon/10 text-terra-neon border border-terra-neon/30' : 'text-terra-light/70 hover:bg-terra-stone/50 hover:text-white'}`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-terra-stone">
                    <NavLink to="/admin/profile" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${isActive ? 'bg-terra-stone text-white' : 'hover:bg-terra-stone/50 text-terra-light/80'}`}>
                        <div className="w-8 h-8 rounded-full bg-terra-stone flex items-center justify-center overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={16} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-none">{user?.username}</span>
                            <span className="text-xs text-terra-neon mt-1">Admin</span>
                        </div>
                    </NavLink>
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center justify-center space-x-2 w-full py-2 text-sm text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-lg transition-all border border-red-400/20 mt-2">
                        <LogOut size={15} />
                        <span className="font-bold">Logout</span>
                    </button>
                </div>
            </aside>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

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
        </>
    );
};

export default Sidebar;
