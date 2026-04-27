import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lightbulb, Trash2, CheckCircle, XCircle, Search, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminIdeas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/ideas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIdeas(res.data);
        } catch (error) {
            toast.error("Failed to load proposals.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.put(`${import.meta.env.VITE_API_URL}/ideas/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Proposal status updated.");
            fetchIdeas();
        } catch (error) {
            toast.error("Status update failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this proposal?")) {
            try {
                const token = JSON.parse(sessionStorage.getItem('user'))?.token;
                await axios.delete(`${import.meta.env.VITE_API_URL}/ideas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Proposal deleted.");
                fetchIdeas();
            } catch (error) {
                toast.error("Deletion failed.");
            }
        }
    };

    const filteredIdeas = ideas.filter(idea => 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        idea.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Helmet>
                <title>Manage Proposals | Admin | Terra Vanguard</title>
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Proposal <span className="text-terra-neon">Review</span></h1>
                    <p className="text-terra-light/70 text-sm">Review, approve, or discard operative event suggestions.</p>
                </div>
            </div>

            <div className="glass-card p-4 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search proposals or operatives..." 
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-terra-stone border-t-terra-neon rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredIdeas.map((idea) => (
                        <motion.div 
                            key={idea._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`glass-card p-6 border-l-4 ${idea.approved ? 'border-l-terra-emerald' : 'border-l-terra-stone'}`}
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white">{idea.title}</h3>
                                        {idea.approved && (
                                            <span className="bg-terra-emerald/20 text-terra-emerald text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                Approved
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-terra-light/70 text-sm mb-4">{idea.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-terra-light/50">
                                        <span>Submitted by: <strong className="text-white">{idea.createdBy?.name?.split(' ')[0] || idea.createdBy?.username || 'Unknown'}</strong></span>
                                        <span>Date: {new Date(idea.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 min-w-[120px]">
                                    <div className="flex items-center space-x-1 bg-terra-darker px-3 py-1.5 rounded-full border border-terra-stone w-fit">
                                        <ThumbsUp size={14} className="text-terra-neon" />
                                        <span className="text-sm font-bold text-terra-neon">{idea.upvotes}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleApprove(idea._id)}
                                            className={`p-2 rounded-lg transition-colors ${idea.approved ? 'text-terra-emerald bg-terra-emerald/10' : 'text-terra-light/50 hover:text-terra-emerald hover:bg-terra-emerald/10'}`}
                                            title={idea.approved ? "Revoke Approval" : "Approve"}
                                        >
                                            {idea.approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(idea._id)}
                                            className="p-2 text-terra-light/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredIdeas.length === 0 && (
                        <div className="text-center py-10 glass-card">
                            <Lightbulb size={40} className="mx-auto text-terra-stone mb-3" />
                            <p className="text-terra-light/50">No proposals in the system.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminIdeas;
