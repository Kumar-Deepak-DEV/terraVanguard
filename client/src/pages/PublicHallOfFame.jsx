import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Search, Filter } from 'lucide-react';

const PublicHallOfFame = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVanguard, setSelectedVanguard] = useState('All');

    const fetchEntries = async (isBackground = false) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/hall-of-fame`);
            setEntries(res.data);
        } catch (error) {
            if (!isBackground) console.error("Error fetching hall of fame", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
        const interval = setInterval(() => fetchEntries(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const vanguards = ['All', ...new Set(entries.map(e => e.organizer))];

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.playerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              entry.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVanguard = selectedVanguard === 'All' || entry.organizer === selectedVanguard;
        return matchesSearch && matchesVanguard;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>Hall of Fame | Terra Vanguard</title>
                <meta name="description" content="Check out the best of the best! The Hall of Fame for our class operations." />
            </Helmet>
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
                >
                    <Trophy size={40} className="text-white" />
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-display font-bold text-white mb-4"
                >
                    Hall of <span className="text-yellow-400">Fame</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-terra-light/70 max-w-2xl mx-auto"
                >
                    Honoring the elite operatives who have demonstrated exceptional skill, strategy, and dominance in the field.
                </motion.p>
            </div>

            <div className="glass-card p-4 mb-12 flex flex-col md:flex-row gap-4 relative z-20">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search operative or operation name..." 
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-terra-light/50 hidden md:block" size={18} />
                    <select 
                        className="input-field min-w-[200px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300ff88%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.65rem_auto]"
                        value={selectedVanguard}
                        onChange={(e) => setSelectedVanguard(e.target.value)}
                    >
                        {vanguards.map(v => (
                            <option key={v} value={v} className="bg-terra-darker text-white">{v === 'All' ? 'All Vanguards' : v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-terra-stone border-t-yellow-400 rounded-full animate-spin"></div>
                </div>
            ) : filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEntries.map((entry, index) => (
                        <motion.div
                            key={entry._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card overflow-hidden group"
                        >
                            <div className="h-32 bg-gradient-to-br from-terra-darker to-terra-stone relative">
                                <div className="absolute top-4 right-4 bg-yellow-400/20 border border-yellow-400/50 text-yellow-400 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-md">
                                    <Trophy size={12} /> Week {entry.week}
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6 relative">
                                <div className="w-24 h-24 mx-auto -mt-12 mb-4 rounded-xl border-4 border-terra-darker bg-terra-stone flex items-center justify-center overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                                    {entry.avatar ? (
                                        <img src={entry.avatar} alt={entry.playerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-display font-bold text-terra-light">{entry.playerName.charAt(0)}</span>
                                    )}
                                </div>
                                
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{entry.playerName}</h3>
                                    <div className="inline-flex items-center justify-center space-x-1 text-xs font-medium bg-terra-neon/10 text-terra-neon px-2 py-1 rounded border border-terra-neon/20">
                                        <span>Organized by: {entry.organizer}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-terra-darker/50 p-3 rounded-lg border border-terra-stone">
                                        <p className="text-xs text-terra-light/50 uppercase tracking-wider mb-1">Achievement</p>
                                        <p className="font-bold text-yellow-400">{entry.achievement}</p>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-terra-light/70 gap-2">
                                        <Trophy size={14} className="text-terra-stone flex-shrink-0" />
                                        <span className="truncate">{entry.eventName}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-terra-light/70 gap-2">
                                        <MapPin size={14} className="text-terra-stone flex-shrink-0" />
                                        <span className="truncate">{entry.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-terra-light/70 gap-2">
                                        <Calendar size={14} className="text-terra-stone flex-shrink-0" />
                                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card">
                    <Trophy size={48} className="mx-auto text-terra-stone mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No records found</h3>
                    <p className="text-terra-light/60">No operatives match your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default PublicHallOfFame;
