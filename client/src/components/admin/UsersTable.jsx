import React from 'react';
import { Users, Edit, Shield, Trash2 } from 'lucide-react';

const UsersTable = ({ filteredUsers, currentUser, onEdit, onRole, onDelete }) => (
    <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-terra-darker/80 border-b border-terra-stone">
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Display Name</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Callsign (ID)</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Rank</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-bold text-terra-light/60 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-terra-stone">
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-terra-stone/20 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-terra-stone flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {user.avatar ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" /> : <span className="text-sm font-bold text-terra-light">{(user.name || user.username).charAt(0).toUpperCase()}</span>}
                                    </div>
                                    <span className="font-bold text-white">{user.name || user.username}</span>
                                    {user._id === currentUser._id && <span className="text-[10px] bg-terra-neon/20 text-terra-neon px-2 py-0.5 rounded border border-terra-neon/30 ml-2">YOU</span>}
                                </div>
                            </td>
                            <td className="p-4 font-mono text-sm text-terra-light/80">{user.username}</td>
                            <td className="p-4">
                                {user.role === 'admin' ? (
                                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-terra-neon bg-terra-neon/10 px-2 py-1 rounded border border-terra-neon/20"><Shield size={12} /><span>Commander</span></span>
                                ) : (
                                    <span className="inline-flex items-center text-xs font-medium text-terra-light/70 bg-terra-stone px-2 py-1 rounded border border-terra-light/10">Operative</span>
                                )}
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>Active</span>
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => onEdit(user)} className="p-2 rounded-lg transition-colors text-terra-light/60 hover:text-blue-400 hover:bg-blue-400/10" title="Edit Details"><Edit size={18} /></button>
                                    <button onClick={() => onRole(user)} disabled={user.role === 'admin'} className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-terra-light/20 cursor-not-allowed' : 'text-terra-light/60 hover:text-terra-neon hover:bg-terra-neon/10'}`} title={user.role === 'admin' ? 'Already a Commander' : 'Promote to Commander'}><Shield size={18} /></button>
                                    <button onClick={() => onDelete(user)} disabled={user._id === currentUser._id} className={`p-2 rounded-lg transition-colors ${user._id === currentUser._id ? 'text-terra-light/20 cursor-not-allowed' : 'text-terra-light/60 hover:text-red-400 hover:bg-red-400/10'}`} title="Terminate"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredUsers.length === 0 && <div className="text-center py-10"><p className="text-terra-light/50">No operatives found.</p></div>}
    </div>
);

export default UsersTable;
