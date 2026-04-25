import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const UserModals = ({ showModal, setShowModal, modalAction, selectedUser, masterPassword, setMasterPassword, newRole, editForm, setEditForm, newUserForm, setNewUserForm, handleEditUser, handleDelete, handleRoleChange, handleCreateUser }) => {
    if (!showModal) return null;

    const close = () => { setShowModal(false); setMasterPassword(''); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass-card w-full max-w-md p-6 border-t-2 ${modalAction === 'delete' ? 'border-t-red-500' : 'border-t-terra-neon'}`}>

                {modalAction === 'edit' && selectedUser && (
                    <>
                        <h3 className="text-xl font-bold text-white mb-1">Edit Operative</h3>
                        <p className="text-terra-light/70 text-sm mb-5">Update details for <span className="font-bold text-terra-neon">{selectedUser.name || selectedUser.username}</span>.</p>
                        <div className="space-y-4 mb-6">
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Display Name</label><input type="text" className="input-field" placeholder="Full name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Callsign</label><input type="text" className="input-field" value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Avatar URL <span className="normal-case font-normal text-terra-light/40">(optional)</span></label><input type="text" className="input-field" placeholder="https://..." value={editForm.avatar} onChange={(e) => setEditForm({...editForm, avatar: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">New Password <span className="normal-case font-normal text-terra-light/40">(leave blank to keep)</span></label><input type="password" className="input-field" value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} /></div>
                            {selectedUser.role === 'admin' && (
                                <div className="pt-2 border-t border-terra-stone">
                                    <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">⚠ Master Password Required</label>
                                    <input type="password" className="input-field border-yellow-500/30 focus:border-yellow-500 bg-yellow-500/5" placeholder="Enter master password" value={editForm.masterPassword} onChange={(e) => setEditForm({...editForm, masterPassword: e.target.value})} />
                                    <p className="text-yellow-500/60 text-xs mt-1">This user is a Commander. Authorization required.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={close} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleEditUser} className="btn-primary text-sm px-4 py-2">Save Changes</button>
                        </div>
                    </>
                )}

                {modalAction === 'delete' && selectedUser && (
                    <>
                        <h3 className="text-xl font-bold text-white mb-2">Terminate Operative</h3>
                        <p className="text-terra-light/70 text-sm mb-4">Are you sure you want to permanently remove <span className="font-bold text-red-400">{selectedUser.name || selectedUser.username}</span> from the Vanguard network? This action cannot be undone.</p>
                        {selectedUser.role === 'admin' && (
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">⚠ Master Password Required</label>
                                <input type="password" className="input-field border-yellow-500/30 focus:border-yellow-500 bg-yellow-500/5" placeholder="Enter master password to remove Commander" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
                                <p className="text-yellow-500/60 text-xs mt-1">This user is a Commander. Authorization required.</p>
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button onClick={close} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-colors">Confirm Termination</button>
                        </div>
                    </>
                )}

                {modalAction === 'role' && selectedUser && (
                    <>
                        <h3 className="text-xl font-bold text-white mb-2">Modify Clearance Level</h3>
                        <p className="text-terra-light/70 text-sm mb-4">Promote <span className="font-bold text-white">{selectedUser.username}</span> to <span className="font-bold text-terra-neon uppercase">Commander</span>.</p>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-terra-neon uppercase tracking-wider mb-2">Master Code Required</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-neon/50" size={18} />
                                <input type="password" className="input-field pl-10 border-terra-neon/30 focus:border-terra-neon bg-terra-neon/5" placeholder="Enter master authorization" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={close} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleRoleChange} className="btn-primary text-sm px-4 py-2">Authorize Change</button>
                        </div>
                    </>
                )}

                {modalAction === 'create' && (
                    <>
                        <h3 className="text-xl font-bold text-white mb-2">Register New Personnel</h3>
                        <p className="text-terra-light/70 text-sm mb-4">Add a new operative or commander directly to the system.</p>
                        <div className="space-y-4 mb-6">
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Display Name</label><input type="text" className="input-field" placeholder="Enter full name" value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Callsign</label><input type="text" className="input-field" placeholder="Enter user id" value={newUserForm.username} onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Access Code</label><input type="password" className="input-field" placeholder="Enter password" value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-terra-light/80 uppercase tracking-wider mb-1">Rank</label>
                                <select className="input-field" value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}>
                                    <option value="user">Operative</option>
                                    <option value="admin">Commander (Admin)</option>
                                </select>
                            </div>
                            {newUserForm.role === 'admin' && (
                                <div>
                                    <label className="block text-xs font-bold text-terra-neon uppercase tracking-wider mb-1">Master Code Required</label>
                                    <div className="relative"><Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-neon/50" size={18} /><input type="password" className="input-field pl-10 border-terra-neon/30 focus:border-terra-neon bg-terra-neon/5" placeholder="Required to create admins" value={newUserForm.masterPassword} onChange={(e) => setNewUserForm({...newUserForm, masterPassword: e.target.value})} /></div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={close} className="px-4 py-2 text-sm font-medium text-terra-light/70 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleCreateUser} className="btn-primary text-sm px-4 py-2">Create Profile</button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default UserModals;
