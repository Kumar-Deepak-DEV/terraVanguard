import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import HofTable from '../../components/admin/HofTable';
import HofModal from '../../components/admin/HofModal';

const AdminHallOfFame = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        _id: '', week: '', playerName: '', avatar: '',
        organizer: 'Terra Vanguard', location: '', achievement: '',
        eventName: '', date: new Date().toISOString().slice(0, 10)
    });

    useEffect(() => { 
        fetchEntries(); 
        const interval = setInterval(() => fetchEntries(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchEntries = async (isBackground = false) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/hall-of-fame`);
            setEntries(res.data);
        } catch { 
            if (!isBackground) toast.error("Failed to load records."); 
        } finally { 
            if (!isBackground) setLoading(false); 
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const openModal = (entry = null) => {
        if (entry) {
            setIsEditing(true);
            setFormData({ ...entry, date: new Date(entry.date).toISOString().slice(0, 10) });
        } else {
            setIsEditing(false);
            const nextWeek = entries.length > 0 ? Math.max(...entries.map(e => e.week)) + 1 : 1;
            setFormData({ _id: '', week: nextWeek, playerName: '', avatar: '', organizer: 'Terra Vanguard', location: '', achievement: '', eventName: '', date: new Date().toISOString().slice(0, 10) });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/hall-of-fame/${formData._id}`, formData, config);
                toast.success("Record updated successfully.");
            } else {
                const payload = { ...formData }; delete payload._id;
                await axios.post(`${import.meta.env.VITE_API_URL}/hall-of-fame`, payload, config);
                toast.success("New record added to Hall of Fame.");
            }
            setShowModal(false); fetchEntries();
        } catch (error) { toast.error(error.response?.data?.message || "Action failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to scrub this record from the Hall of Fame?")) {
            try {
                const token = JSON.parse(sessionStorage.getItem('user'))?.token;
                await axios.delete(`${import.meta.env.VITE_API_URL}/hall-of-fame/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Record deleted."); fetchEntries();
            } catch { toast.error("Failed to delete record"); }
        }
    };

    const filteredEntries = entries.filter(e =>
        e.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Helmet>
                <title>Manage Hall of Fame | Admin | Terra Vanguard</title>
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Hall of Fame <span className="text-yellow-400">Records</span></h1>
                    <p className="text-terra-light/70 text-sm">Manage the legacy of elite operatives.</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black border-none shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                    <Plus size={18} /> Add Record
                </button>
            </div>
            <div className="glass-card p-4 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input type="text" placeholder="Search operative or operation..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-stone border-t-yellow-400 rounded-full animate-spin"></div></div>
            ) : (
                <HofTable filteredEntries={filteredEntries} onEdit={openModal} onDelete={handleDelete} />
            )}
            <HofModal showModal={showModal} setShowModal={setShowModal} isEditing={isEditing} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
        </div>
    );
};

export default AdminHallOfFame;
