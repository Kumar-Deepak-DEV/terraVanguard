import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, X, Gamepad2, Lightbulb, CheckCircle2 } from 'lucide-react';
import Countdown from './Countdown';

const EventDetailModal = ({ selectedEvent, setSelectedEvent, approvedIdeas }) => (
    <AnimatePresence>
        {selectedEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 relative flex flex-col md:flex-row">
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-terra-light/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-terra-stone/50 z-10 bg-terra-darker/50"><X size={24} /></button>

                    {/* Left: Event Details */}
                    <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-terra-stone/50 flex flex-col">
                        <div className="mb-6 flex items-center gap-3 text-terra-neon"><CalendarIcon size={24} /><span className="font-bold tracking-wider uppercase text-sm">Operation Brief</span></div>
                        <h2 className="text-4xl font-display font-bold text-white mb-4">{selectedEvent.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="inline-flex items-center text-xs bg-terra-darker text-terra-light/80 px-2 py-1 rounded border border-terra-stone">
                                {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="inline-flex items-center text-xs bg-terra-darker text-terra-light/80 px-2 py-1 rounded border border-terra-stone"><Gamepad2 size={12} className="mr-1 text-terra-neon" /> {selectedEvent.gameType || 'Esports'}</span>
                            <span className="inline-flex items-center text-xs bg-terra-darker text-terra-light/80 px-2 py-1 rounded border border-terra-stone">Org: {selectedEvent.organizer}</span>
                        </div>
                        <div className="text-terra-light/80 text-base leading-relaxed mb-8 flex-grow">{selectedEvent.description}</div>
                        {selectedEvent.active && new Date(selectedEvent.date) >= new Date() && (
                            <div className="mt-auto bg-terra-darker/50 p-4 rounded-xl border border-terra-stone/50">
                                <p className="text-xs text-terra-light/50 uppercase tracking-wider mb-3 font-bold">Time to Deployment</p>
                                <Countdown targetDate={selectedEvent.countdown || selectedEvent.date} />
                            </div>
                        )}
                    </div>

                    {/* Right: Approved Ideas */}
                    <div className="p-8 md:w-1/2 bg-terra-darker/30 flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-terra-emerald"><Lightbulb size={24} /><span className="font-bold tracking-wider uppercase text-sm">Approved Tactical Proposals</span></div>
                            <span className="text-xs font-bold text-terra-light/50 bg-terra-darker px-2 py-1 rounded-full border border-terra-stone">{approvedIdeas.length} Active</span>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                            {approvedIdeas.length > 0 ? approvedIdeas.map(idea => (
                                <div key={idea._id} className="bg-terra-darker border border-terra-emerald/20 rounded-xl p-5 hover:border-terra-emerald/50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-lg font-bold text-white pr-4">{idea.title}</h4>
                                        <CheckCircle2 size={16} className="text-terra-emerald shrink-0 mt-1" />
                                    </div>
                                    <p className="text-terra-light/60 text-sm mb-4">{idea.description}</p>
                                    {idea.rules?.length > 0 && (
                                        <div className="bg-terra-stone/10 rounded-lg p-3 border border-terra-stone/30">
                                            <p className="text-xs font-bold text-terra-neon mb-2 uppercase tracking-wider">Guidelines:</p>
                                            <ul className="space-y-1">{idea.rules.map((rule, idx) => (
                                                <li key={idx} className="text-xs text-terra-light/70 flex items-start gap-2"><span className="text-terra-neon/50 mt-0.5">•</span><span>{rule}</span></li>
                                            ))}</ul>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-terra-stone/50 rounded-xl">
                                    <Lightbulb size={32} className="text-terra-stone mb-3" />
                                    <p className="text-sm text-terra-light/50">No approved proposals at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default EventDetailModal;
