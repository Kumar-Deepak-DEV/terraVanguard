import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare } from 'lucide-react';

const IdeaCard = ({ idea, index, userId, onSelect, onUpvote }) => {
    const hasVoted = idea.voters.includes(userId);
    return (
        <motion.div
            key={idea._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(idea)}
            className="glass-card p-6 flex flex-col h-full relative overflow-hidden group cursor-pointer hover:border-terra-neon/40 transition-colors"
        >
            {idea.approved && (
                <div className="absolute top-0 right-0 bg-terra-emerald/20 text-terra-emerald text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-lg border-b border-l border-terra-emerald/30">
                    Approved by Command
                </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2 pr-12 group-hover:text-terra-neon transition-colors">{idea.title}</h3>
            <p className="text-terra-light/70 text-sm flex-grow mb-4 line-clamp-3">{idea.description}</p>
            <div className="flex items-center justify-between border-t border-terra-stone pt-4 mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-terra-light/50">Submitted by</span>
                    <span className="text-sm font-medium text-white">{idea.createdBy?.name?.split(' ')[0] || idea.createdBy?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onSelect({...idea, autoOpenComments: true}); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-terra-darker text-terra-light/50 border border-terra-stone hover:border-terra-neon/40 hover:text-terra-neon transition-all text-sm" title="Comments">
                        <MessageSquare size={15} />
                    </button>
                    <button onClick={(e) => onUpvote(e, idea._id)} title={hasVoted ? 'Click to withdraw support' : 'Support this proposal'}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${hasVoted ? 'bg-terra-neon/20 text-terra-neon border border-terra-neon/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/40' : 'bg-terra-darker text-terra-light/70 border border-terra-stone hover:border-terra-neon/50 hover:text-terra-neon'}`}>
                        <ThumbsUp size={16} className={hasVoted ? 'fill-current' : ''} />
                        <span className="font-bold">{idea.upvotes}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default IdeaCard;
