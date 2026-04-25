import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const EventModal = ({ showModal, setShowModal, isEditing, formData, handleInputChange, handleSubmit }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-2xl p-0 overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-terra-stone bg-terra-darker">
                    <h3 className="text-xl font-bold text-white">{isEditing ? 'Modify Operation Parameters' : 'Schedule New Operation'}</h3>
                    <button onClick={() => setShowModal(false)} className="text-terra-light/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Operation Title</label>
                            <input type="text" name="title" required className="input-field" value={formData.title} onChange={handleInputChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Strategic Description</label>
                            <textarea name="description" required className="input-field min-h-[100px] resize-none" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Execution Date</label>
                            <input type="datetime-local" name="date" required className="input-field" value={formData.date} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Countdown Target (Optional)</label>
                            <input type="datetime-local" name="countdown" className="input-field" value={formData.countdown} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Organizing Faction</label>
                            <input type="text" name="organizer" required className="input-field" value={formData.organizer} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Combat Simulator (Game)</label>
                            <input type="text" name="gameType" className="input-field" value={formData.gameType} onChange={handleInputChange} placeholder="e.g. Valorant, CS:GO" />
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleInputChange} className="w-4 h-4 rounded bg-terra-darker border-terra-stone text-terra-neon focus:ring-terra-neon focus:ring-offset-terra-darker" />
                        <label htmlFor="active" className="ml-2 text-sm font-medium text-white">Operation is Active</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-terra-stone mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="btn-primary text-sm px-6 py-2">{isEditing ? 'Update Parameters' : 'Authorize Operation'}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EventModal;
