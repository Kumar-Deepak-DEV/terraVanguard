import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lightbulb, ThumbsUp, Calendar, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        myIdeasCount: 0,
        myUpvotesCount: 0,
        topIdeas: [],
        upcomingEvent: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, you'd have specific endpoints for this.
                // For now, we'll fetch general data and filter it.
                const token = JSON.parse(sessionStorage.getItem('user'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [ideasRes, eventsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/ideas`, config),
                    axios.get(`${import.meta.env.VITE_API_URL}/events`)
                ]);

                const ideas = ideasRes.data;
                const events = eventsRes.data;

                const myIdeas = ideas.filter(i => i.createdBy._id === user._id);
                const myUpvotes = ideas.filter(i => i.voters.includes(user._id));
                const topIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
                
                const futureEvents = events.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
                const nextEvent = futureEvents.length > 0 ? futureEvents[0] : null;

                setStats({
                    myIdeasCount: myIdeas.length,
                    myUpvotesCount: myUpvotes.length,
                    topIdeas,
                    upcomingEvent: nextEvent
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchDashboardData();
    }, [user]);

    const statCards = [
        { title: 'My Proposals', value: stats.myIdeasCount, icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { title: 'Upvotes Given', value: stats.myUpvotesCount, icon: ThumbsUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { title: 'Rank Level', value: 'Operative', icon: Activity, color: 'text-terra-neon', bg: 'bg-terra-neon/10' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Helmet>
                <title>Dashboard | Terra Vanguard</title>
                <meta name="description" content="View your operations, proposals, and class activities on the Terra Vanguard dashboard." />
            </Helmet>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome Back, <span className="text-terra-neon">{user.name || user.username}</span></h1>
                <p className="text-terra-light/70 text-sm">Vanguard Headquarters Control Panel.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-terra-light/60 text-sm font-medium uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-display font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trending Ideas */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-terra-stone pb-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                            <Activity className="text-terra-neon" /> Trending Proposals
                        </h2>
                        <Link to="/ideas" className="text-sm text-terra-neon hover:text-white transition-colors flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        {stats.topIdeas.length > 0 ? stats.topIdeas.map((idea, i) => (
                            <motion.div 
                                key={idea._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-5 group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-terra-neon transition-colors">{idea.title}</h3>
                                    <div className="flex items-center space-x-1 bg-terra-darker px-3 py-1 rounded-full border border-terra-stone">
                                        <ThumbsUp size={14} className="text-terra-neon" />
                                        <span className="text-sm font-bold text-terra-neon">{idea.upvotes}</span>
                                    </div>
                                </div>
                                <p className="text-terra-light/70 text-sm line-clamp-2 mb-4">{idea.description}</p>
                                <div className="flex items-center justify-between text-xs text-terra-light/50">
                                    <span>By {idea.createdBy.name || idea.createdBy.username}</span>
                                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-10 glass-card">
                                <p className="text-terra-light/60">No proposals available. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Next Event */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2 border-b border-terra-stone pb-4">
                        <Calendar className="text-terra-emerald" /> Next Operation
                    </h2>
                    
                    {stats.upcomingEvent ? (
                        <div className="glass-card p-6 border-terra-emerald/30 bg-gradient-to-br from-terra-darker to-terra-emerald/10">
                            <div className="inline-block px-3 py-1 bg-terra-emerald/20 text-terra-emerald text-xs font-bold rounded-full mb-4 border border-terra-emerald/30">
                                UPCOMING
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{stats.upcomingEvent.title}</h3>
                            <div className="text-terra-neon font-display font-bold text-xl mb-4">
                                {new Date(stats.upcomingEvent.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <p className="text-terra-light/80 text-sm mb-6">{stats.upcomingEvent.description}</p>
                            <Link to="/events" className="btn-secondary w-full flex justify-center text-sm">
                                View Intelligence
                            </Link>
                        </div>
                    ) : (
                        <div className="glass-card p-6 text-center">
                            <Calendar className="w-12 h-12 text-terra-stone mx-auto mb-3" />
                            <p className="text-terra-light/60">No upcoming operations scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
