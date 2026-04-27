import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import UsersTable from '../../components/admin/UsersTable';
import UserModals from '../../components/admin/UserModals';

const AdminUsers = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [masterPassword, setMasterPassword] = useState('');
    const [newRole] = useState('admin');
    const [newUserForm, setNewUserForm] = useState({ name: '', username: '', password: '', role: 'user', masterPassword: '' });
    const [editForm, setEditForm] = useState({ name: '', username: '', avatar: '', password: '', masterPassword: '' });

    useEffect(() => { 
        fetchUsers(); 
        const interval = setInterval(() => fetchUsers(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchUsers = async (isBackground = false) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
            
            setSelectedUser(prev => {
                if (!prev) return null;
                const updatedUser = res.data.find(u => u._id === prev._id);
                return updatedUser || prev;
            });
        } catch { 
            if (!isBackground) toast.error("Failed to load operatives."); 
        } finally { 
            if (!isBackground) setLoading(false); 
        }
    };

    const handleCreateUser = async () => {
        if (!newUserForm.name || !newUserForm.username || !newUserForm.password) { toast.error("Name, Callsign, and Access Code are required."); return; }
        if (newUserForm.role === 'admin' && !newUserForm.masterPassword) { toast.error("Master code required to create Commander."); return; }
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, newUserForm);
            toast.success(`${newUserForm.role === 'admin' ? 'Commander' : 'Operative'} created successfully.`);
            setShowModal(false); setNewUserForm({ name: '', username: '', password: '', role: 'user', masterPassword: '' }); fetchUsers();
        } catch (error) { toast.error(error.response?.data?.message || "Failed to create user."); }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;
        if (!editForm.username?.trim()) { toast.error("Callsign cannot be empty."); return; }
        if (selectedUser.role === 'admin' && !editForm.masterPassword) { toast.error("Master password required to edit a Commander."); return; }
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser._id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Operative details updated.");
            setShowModal(false); setEditForm({ name: '', username: '', avatar: '', password: '', masterPassword: '' }); fetchUsers();
        } catch (error) { toast.error(error.response?.data?.message || "Update failed."); }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        if (selectedUser.role === 'admin' && !masterPassword) { toast.error("Master password required to remove a Commander."); return; }
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${selectedUser._id}`, { headers: { Authorization: `Bearer ${token}` }, data: { masterPassword } });
            toast.success("Operative terminated."); setShowModal(false); setMasterPassword(''); fetchUsers();
        } catch (error) { toast.error(error.response?.data?.message || "Termination failed"); }
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !newRole) return;
        if (newRole === 'admin' && !masterPassword) { toast.error("Master code required for Commander rank."); return; }
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser._id}/role`, { role: newRole, masterPassword }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Rank updated successfully."); setShowModal(false); setMasterPassword(''); fetchUsers();
        } catch (error) { toast.error(error.response?.data?.message || "Rank update failed"); }
    };

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())));

    return (
        <div>
            <Helmet>
                <title>Manage Users | Admin | Terra Vanguard</title>
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Operative <span className="text-terra-neon">Management</span></h1>
                    <p className="text-terra-light/70 text-sm">Manage user access and clearance levels.</p>
                </div>
                <button onClick={() => { setModalAction('create'); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Operative
                </button>
            </div>
            <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 relative z-20">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input type="text" placeholder="Search operative name or callsign..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-stone border-t-terra-neon rounded-full animate-spin"></div></div>
            ) : (
                <UsersTable filteredUsers={filteredUsers} currentUser={currentUser}
                    onEdit={(user) => { setSelectedUser(user); setEditForm({ name: user.name || '', username: user.username, avatar: user.avatar || '', password: '', masterPassword: '' }); setModalAction('edit'); setShowModal(true); }}
                    onRole={(user) => { setSelectedUser(user); setModalAction('role'); setShowModal(true); }}
                    onDelete={(user) => { setSelectedUser(user); setModalAction('delete'); setShowModal(true); }}
                />
            )}
            <UserModals showModal={showModal} setShowModal={setShowModal} modalAction={modalAction} selectedUser={selectedUser}
                masterPassword={masterPassword} setMasterPassword={setMasterPassword} newRole={newRole}
                editForm={editForm} setEditForm={setEditForm} newUserForm={newUserForm} setNewUserForm={setNewUserForm}
                handleEditUser={handleEditUser} handleDelete={handleDelete} handleRoleChange={handleRoleChange} handleCreateUser={handleCreateUser}
            />
        </div>
    );
};

export default AdminUsers;
