import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Gamepad2 } from 'lucide-react';
import Countdown from '../components/events/Countdown';
import EventDetailModal from '../components/events/EventDetailModal';

const PublicEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [approvedIdeas, setApprovedIdeas] = useState([]);

    const fetchEvents = async (isBackground = false) => {
        try { const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`); setEvents(res.data); }
        catch (error) { if (!isBackground) console.error("Error fetching events", error); }
        finally { if (!isBackground) setLoading(false); }
    };
    
    const fetchIdeas = async (isBackground = false) => {
        try { const res = await axios.get(`${import.meta.env.VITE_API_URL}/ideas`); setApprovedIdeas(res.data.filter(idea => idea.approved)); }
        catch (error) { if (!isBackground) console.error("Error fetching ideas", error); }
    };

    useEffect(() => {
        fetchEvents(); fetchIdeas();
        const interval = setInterval(() => {
            fetchEvents(true);
            fetchIdeas(true);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const futureEvents = events.filter(e => new Date(e.date) >= new Date() && e.active).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = events.filter(e => new Date(e.date) < new Date() || !e.active).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>Events | Terra Vanguard</title>
                <meta name="description" content="Track upcoming class events, tournaments, and squad hangouts." />
            </Helmet>
            <div className="text-center mb-16">
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="w-20 h-20 mx-auto bg-gradient-to-br from-terra-emerald to-terra-neon rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                    <CalendarIcon size={40} className="text-terra-darker" />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-display font-bold text-white mb-4">
                    Vanguard <span className="text-terra-neon">Operations</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-terra-light/70 max-w-2xl mx-auto">
                    Prepare for deployment. Track upcoming tournaments, scrimmages, and community events.
                </motion.p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-terra-stone border-t-terra-neon rounded-full animate-spin"></div></div>
            ) : (
                <>
                    <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-terra-stone pb-4">Upcoming Deployments</h2>
                    {futureEvents.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                            {futureEvents.map((event, index) => (
                                <motion.div key={event._id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedEvent(event)} className="glass-card flex flex-col md:flex-row overflow-hidden group cursor-pointer hover:border-terra-neon/40 transition-colors">
                                    <div className="bg-gradient-to-br from-terra-darker to-terra-stone p-6 flex flex-col items-center justify-center md:w-40 border-b md:border-b-0 md:border-r border-terra-stone/50 group-hover:from-terra-darker group-hover:to-terra-neon/10 transition-colors">
                                        <span className="text-terra-neon font-bold uppercase tracking-wider text-sm mb-1">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                        <span className="text-5xl font-display font-bold text-white">{new Date(event.date).getDate()}</span>
                                        <span className="text-terra-light/50 text-xs mt-2">{new Date(event.date).getFullYear()}</span>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-terra-neon transition-colors">{event.title}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center text-xs bg-terra-darker text-terra-light/80 px-2 py-1 rounded border border-terra-stone"><Gamepad2 size={12} className="mr-1 text-terra-neon" /> {event.gameType || 'Esports'}</span>
                                                    <span className="inline-flex items-center text-xs bg-terra-darker text-terra-light/80 px-2 py-1 rounded border border-terra-stone">Organized by: {event.organizer}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-terra-light/70 text-sm mb-6 flex-grow">{event.description}</p>
                                        <div className="mt-auto">
                                            <p className="text-xs text-terra-light/50 uppercase tracking-wider mb-2 font-bold">Time to Deployment</p>
                                            <Countdown targetDate={event.countdown || event.date} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 glass-card mb-16">
                            <Clock size={48} className="mx-auto text-terra-stone mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No active operations</h3>
                            <p className="text-terra-light/60">Stand by for new orders from command.</p>
                        </div>
                    )}

                    {pastEvents.length > 0 && (
                        <>
                            <h2 className="text-2xl font-display font-bold text-terra-light/50 mb-6">Archived Operations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                                {pastEvents.map(event => (
                                    <div key={event._id} onClick={() => setSelectedEvent(event)} className="bg-terra-darker border border-terra-stone rounded-xl p-5 cursor-pointer hover:border-terra-neon/40 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-bold text-white truncate pr-4">{event.title}</h4>
                                            <span className="text-xs text-terra-stone font-bold whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-terra-light/40 text-xs line-clamp-2">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <EventDetailModal selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} approvedIdeas={approvedIdeas} />
        </div>
    );
};

export default PublicEvents;
