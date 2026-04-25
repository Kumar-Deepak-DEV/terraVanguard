import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const HofTable = ({ filteredEntries, onEdit, onDelete }) => (
    <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-terra-darker/80 border-b border-terra-stone">
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Week</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Operative</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Achievement</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Operation</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-terra-stone">
                    {filteredEntries.map((entry) => (
                        <tr key={entry._id} className="hover:bg-terra-stone/20 transition-colors">
                            <td className="p-4">
                                <span className="inline-flex justify-center items-center w-8 h-8 rounded bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/20">
                                    {entry.week}
                                </span>
                            </td>
                            <td className="p-4 font-bold text-white">{entry.playerName}</td>
                            <td className="p-4 text-sm text-terra-light/80 line-clamp-1">{entry.achievement}</td>
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-terra-light">{entry.eventName}</span>
                                    <span className="text-[10px] text-terra-light/50">{entry.organizer}</span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => onEdit(entry)} className="p-2 text-terra-light/60 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => onDelete(entry._id)} className="p-2 text-terra-light/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredEntries.length === 0 && (
            <div className="text-center py-10"><p className="text-terra-light/50">No records found.</p></div>
        )}
    </div>
);

export default HofTable;
