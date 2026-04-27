import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import EventCard from '../../components/admin/EventCard';
import EventModal from '../../components/admin/EventModal';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        _id: '', title: '', description: '', date: '',
        countdown: '', organizer: '', gameType: '', active: true
    });

    useEffect(() => { 
        fetchEvents(); 
        const interval = setInterval(() => fetchEvents(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchEvents = async (isBackground = false) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
            setEvents(res.data);
        } catch { 
            if (!isBackground) toast.error("Failed to load operations."); 
        } finally { 
            if (!isBackground) setLoading(false); 
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const openModal = (event = null) => {
        if (event) {
            setIsEditing(true);
            setFormData({
                _id: event._id, title: event.title, description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16),
                countdown: event.countdown ? new Date(event.countdown).toISOString().slice(0, 16) : '',
                organizer: event.organizer, gameType: event.gameType || '', active: event.active
            });
        } else {
            setIsEditing(false);
            setFormData({ _id: '', title: '', description: '', date: '', countdown: '', organizer: 'Terra Vanguard', gameType: '', active: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...formData };
            if (!payload.countdown) delete payload.countdown;
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/events/${formData._id}`, payload, config);
                toast.success("Operation updated successfully.");
            } else {
                delete payload._id;
                await axios.post(`${import.meta.env.VITE_API_URL}/events`, payload, config);
                toast.success("New operation scheduled.");
            }
            setShowModal(false);
            fetchEvents();
        } catch (error) { toast.error(error.response?.data?.message || "Action failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to scrub this operation from the records?")) {
            try {
                const token = JSON.parse(sessionStorage.getItem('user'))?.token;
                await axios.delete(`${import.meta.env.VITE_API_URL}/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Operation scrubbed.");
                fetchEvents();
            } catch { toast.error("Failed to delete operation"); }
        }
    };

    const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <Helmet>
                <title>Manage Events | Admin | Terra Vanguard</title>
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Operations <span className="text-terra-neon">Command</span></h1>
                    <p className="text-terra-light/70 text-sm">Schedule and manage Vanguard deployments.</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Schedule Operation
                </button>
            </div>

            <div className="glass-card p-4 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input type="text" placeholder="Search operations..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-stone border-t-terra-neon rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event._id} event={event} onEdit={openModal} onDelete={handleDelete} />
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-span-full text-center py-10 glass-card"><p className="text-terra-light/50">No operations found.</p></div>
                    )}
                </div>
            )}

            <EventModal showModal={showModal} setShowModal={setShowModal} isEditing={isEditing} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
        </div>
    );
};

export default AdminEvents;
