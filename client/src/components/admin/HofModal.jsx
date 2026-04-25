import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

const HofModal = ({ showModal, setShowModal, isEditing, formData, handleInputChange, handleSubmit }) => {
    if (!showModal) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-2xl p-0 overflow-hidden my-8">
                <div className="flex justify-between items-center p-6 border-b border-terra-stone bg-terra-darker">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-400" />
                        {isEditing ? 'Modify Record' : 'Add New Record'}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-terra-light/50 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Week Number</label>
                            <input type="number" name="week" required className="input-field" value={formData.week} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Operative Name</label>
                            <input type="text" name="playerName" required className="input-field" value={formData.playerName} onChange={handleInputChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Avatar URL (Optional)</label>
                            <input type="text" name="avatar" className="input-field" placeholder="https://example.com/avatar.jpg" value={formData.avatar} onChange={handleInputChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Achievement Description</label>
                            <input type="text" name="achievement" required className="input-field" placeholder="e.g. Most MVPs in Regional Tournament" value={formData.achievement} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Operation/Event Name</label>
                            <input type="text" name="eventName" required className="input-field" value={formData.eventName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Organizing Faction</label>
                            <input type="text" name="organizer" required className="input-field" value={formData.organizer} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Location / Platform</label>
                            <input type="text" name="location" className="input-field" placeholder="e.g. Discord, Online, Los Angeles" value={formData.location} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Date Achieved</label>
                            <input type="date" name="date" required className="input-field" value={formData.date} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-6 border-t border-terra-stone mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="btn-primary bg-yellow-500 hover:bg-yellow-400 text-black border-none text-sm px-6 py-2 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                            {isEditing ? 'Update Record' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default HofModal;
