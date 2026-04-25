import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ListChecks } from 'lucide-react';

const IdeaFormModal = ({ showForm, setShowForm, newIdea, setNewIdea, handleSubmit, addRule, updateRule, removeRule }) => (
    <AnimatePresence>
        {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { setShowForm(false); setNewIdea({ title: '', description: '', rules: [''] }); }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 relative">
                    <button type="button" onClick={() => { setShowForm(false); setNewIdea({ title: '', description: '', rules: [''] }); }}
                        className="absolute top-4 right-4 text-terra-light/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-terra-stone/50"><X size={20} /></button>

                    <h2 className="text-2xl font-display font-bold text-white mb-1">New Tactical <span className="text-terra-neon">Proposal</span></h2>
                    <p className="text-terra-light/50 text-sm mb-6">Submit your operation idea for the Vanguard to review and vote on.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-terra-light/80 mb-1">Operation Title</label>
                            <input type="text" className="input-field" placeholder="e.g., Regional CS:GO Tournament" value={newIdea.title} onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-terra-light/80 mb-1">Strategic Details</label>
                            <textarea className="input-field min-h-[110px] resize-none" placeholder="Provide operational details and objectives..." value={newIdea.description} onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}></textarea>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-terra-light/80">
                                    <ListChecks size={15} className="inline mr-1.5 text-terra-neon" />
                                    Rules <span className="text-terra-neon text-xs ml-1">(min. 1 required)</span>
                                </label>
                                <button type="button" onClick={addRule} className="flex items-center gap-1 text-xs text-terra-neon border border-terra-neon/30 hover:bg-terra-neon/10 px-2 py-1 rounded-md transition-colors">
                                    <Plus size={12} /> Add Rule
                                </button>
                            </div>
                            <div className="space-y-2">
                                {newIdea.rules.map((rule, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-terra-neon text-xs font-bold w-5 text-right shrink-0">{idx + 1}.</span>
                                        <input type="text" className="input-field flex-1" placeholder={`Rule ${idx + 1}...`} value={rule} onChange={(e) => updateRule(idx, e.target.value)} />
                                        {newIdea.rules.length > 1 && (
                                            <button type="button" onClick={() => removeRule(idx)} className="text-red-400/60 hover:text-red-400 transition-colors p-1"><Trash2 size={15} /></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-terra-stone">
                            <button type="submit" className="btn-primary flex-1">Transmit Proposal</button>
                            <button type="button" onClick={() => { setShowForm(false); setNewIdea({ title: '', description: '', rules: [''] }); }} className="btn-secondary flex-1">Cancel</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default IdeaFormModal;
