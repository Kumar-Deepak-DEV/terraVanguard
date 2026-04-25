import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ListChecks, MessageSquare } from 'lucide-react';
import CommentsSection from './CommentsSection';

const IdeaDetailModal = ({ selectedIdea, setSelectedIdea, handleUpvote, userId }) => {
    const [showComments, setShowComments] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!selectedIdea) {
            setShowComments(false);
        } else if (selectedIdea.autoOpenComments) {
            setShowComments(true);
        }
    }, [selectedIdea]);

    return (
        <AnimatePresence>
            {selectedIdea && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedIdea(null)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`glass-card w-full max-h-[90vh] flex flex-col overflow-hidden relative transition-all duration-300 ${showComments ? 'max-w-5xl' : 'max-w-2xl'}`}>
                        <button onClick={() => setSelectedIdea(null)} className="absolute top-4 right-4 text-terra-light/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-terra-stone/50 z-10"><X size={20} /></button>

                        <div className="flex flex-col md:flex-row flex-1 min-h-0">
                            {/* Idea Details - Left Side */}
                            <div className="flex-1 p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-terra-stone custom-scrollbar">
                                {selectedIdea.approved && (
                                    <span className="inline-block bg-terra-emerald/20 text-terra-emerald text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-terra-emerald/30 mb-3">✓ Approved by Command</span>
                                )}
                                <h2 className="text-3xl font-display font-bold text-white mb-3 pr-8">{selectedIdea.title}</h2>
                                <div className="flex items-center gap-3 text-xs text-terra-light/50 mb-6">
                                    <span>By <strong className="text-terra-light">{selectedIdea.createdBy?.name?.split(' ')[0] || selectedIdea.createdBy?.username || 'Unknown'}</strong></span>
                                    <span>•</span>
                                    <span>{new Date(selectedIdea.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><ThumbsUp size={11} className="text-terra-neon" /> {selectedIdea.upvotes}</span>
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-terra-neon mb-2">Description</h4>
                                    <p className="text-terra-light/80 leading-relaxed">{selectedIdea.description}</p>
                                </div>
                                {selectedIdea.rules?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-terra-neon mb-3 flex items-center gap-1.5"><ListChecks size={14} /> Rules & Guidelines</h4>
                                        <ul className="space-y-2">
                                            {selectedIdea.rules.map((rule, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-terra-light/80">
                                                    <span className="mt-0.5 w-5 h-5 rounded-full bg-terra-neon/10 border border-terra-neon/30 text-terra-neon text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-terra-stone">
                                    <button onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${showComments ? 'bg-terra-neon/20 text-terra-neon border-terra-neon/30' : 'bg-terra-darker text-terra-light/60 border border-terra-stone hover:border-terra-neon/40 hover:text-terra-neon'}`}>
                                        <MessageSquare size={16} /> Comments
                                    </button>
                                    <button onClick={(e) => handleUpvote(e, selectedIdea._id)}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-semibold ${selectedIdea.voters.includes(userId) ? 'bg-terra-neon/20 text-terra-neon border border-terra-neon/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/40' : 'bg-terra-darker text-terra-light/70 border border-terra-stone hover:border-terra-neon/50 hover:text-terra-neon'}`}>
                                        <ThumbsUp size={16} className={selectedIdea.voters.includes(userId) ? 'fill-current' : ''} />
                                        {selectedIdea.voters.includes(userId) ? 'Supported' : 'Support'} · {selectedIdea.upvotes}
                                    </button>
                                </div>
                            </div>

                            {/* Comments Section - Right Side */}
                            {showComments && (
                                <motion.div 
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    className="flex-[0.8] p-4 flex flex-col bg-terra-dark/30 min-w-[350px]"
                                >
                                    <h3 className="text-lg font-display font-bold text-white mb-2 ml-2">Discussion Hub</h3>
                                    <div className="flex-1 overflow-hidden relative">
                                        <CommentsSection ideaId={selectedIdea._id} userId={userId} />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IdeaDetailModal;
