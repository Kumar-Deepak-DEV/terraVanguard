import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, MessageSquare, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import IdeaCard from '../components/ideas/IdeaCard';
import IdeaFormModal from '../components/ideas/IdeaFormModal';
import IdeaDetailModal from '../components/ideas/IdeaDetailModal';

const Ideas = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [ideas, setIdeas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('votes');
    const [showForm, setShowForm] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [newIdea, setNewIdea] = useState({ title: '', description: '', rules: [''] });

    useEffect(() => { 
        fetchIdeas(); 
        const interval = setInterval(() => fetchIdeas(true), 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const urlIdeaId = searchParams.get('ideaId');
        if (urlIdeaId && ideas.length > 0) {
            const targetIdea = ideas.find(i => i._id === urlIdeaId);
            if (targetIdea) {
                setSelectedIdea({ ...targetIdea, autoOpenComments: true });
                searchParams.delete('ideaId');
                setSearchParams(searchParams);
            }
        }
    }, [searchParams, ideas]);

    const fetchIdeas = async (isBackground = false) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/ideas`, { headers: { Authorization: `Bearer ${token}` } });
            setIdeas(res.data);
            
            setSelectedIdea(prev => {
                if (!prev) return null;
                const updatedIdea = res.data.find(i => i._id === prev._id);
                // Preserve autoOpenComments if it was set
                return updatedIdea ? { ...updatedIdea, autoOpenComments: prev.autoOpenComments } : prev;
            });
        } catch { 
            if (!isBackground) toast.error("Failed to load operations data."); 
        }
    };

    const handleUpvote = async (e, id) => {
        e.stopPropagation();
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/ideas/${id}/upvote`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.unvoted) toast('Support withdrawn.', { icon: '↩️' });
            else toast.success("Support registered.");
            if (selectedIdea?._id === id) setSelectedIdea(res.data);
            fetchIdeas();
        } catch (error) { toast.error(error.response?.data?.message || "Action failed"); }
    };

    const addRule = () => setNewIdea(prev => ({ ...prev, rules: [...prev.rules, ''] }));
    const updateRule = (index, value) => { const updated = [...newIdea.rules]; updated[index] = value; setNewIdea(prev => ({ ...prev, rules: updated })); };
    const removeRule = (index) => { if (newIdea.rules.length === 1) return; setNewIdea(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newIdea.title || !newIdea.description) { toast.error("Complete all fields to submit proposal."); return; }
        const cleanedRules = newIdea.rules.map(r => r.trim()).filter(Boolean);
        if (cleanedRules.length === 0) { toast.error("At least one rule is required."); return; }
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            await axios.post(`${import.meta.env.VITE_API_URL}/ideas`, { ...newIdea, rules: cleanedRules }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Proposal submitted successfully.");
            setNewIdea({ title: '', description: '', rules: [''] });
            setShowForm(false); fetchIdeas();
        } catch (error) { toast.error(error.response?.data?.message || "Submission failed"); }
    };

    const filteredIdeas = ideas
        .filter(idea => idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortBy === 'votes' ? b.upvotes - a.upvotes : new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Helmet>
                <title>Proposals | Terra Vanguard</title>
                <meta name="description" content="Submit, discuss, and vote on class activities and proposals." />
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Tactical <span className="text-terra-neon">Proposals</span></h1>
                    <p className="text-terra-light/70">Submit and vote on future Vanguard operations.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> Submit Proposal</button>
            </div>

            <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terra-light/50" size={18} />
                    <input type="text" placeholder="Search proposals..." className="input-field pl-10 bg-terra-darker/80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2 bg-terra-darker/80 p-1 rounded-lg border border-terra-stone">
                    <Filter className="text-terra-light/50 ml-2" size={16} />
                    <button onClick={() => setSortBy('votes')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === 'votes' ? 'bg-terra-neon text-terra-dark' : 'text-terra-light/70 hover:text-white'}`}>Top Rated</button>
                    <button onClick={() => setSortBy('latest')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === 'latest' ? 'bg-terra-neon text-terra-dark' : 'text-terra-light/70 hover:text-white'}`}>Recent</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea, index) => (
                    <IdeaCard key={idea._id} idea={idea} index={index} userId={user._id} onSelect={setSelectedIdea} onUpvote={handleUpvote} />
                ))}
            </div>

            {filteredIdeas.length === 0 && (
                <div className="text-center py-20">
                    <MessageSquare size={48} className="mx-auto text-terra-stone mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No data found</h3>
                    <p className="text-terra-light/60">No proposals match your current filters.</p>
                </div>
            )}

            <IdeaFormModal showForm={showForm} setShowForm={setShowForm} newIdea={newIdea} setNewIdea={setNewIdea} handleSubmit={handleSubmit} addRule={addRule} updateRule={updateRule} removeRule={removeRule} />
            <IdeaDetailModal selectedIdea={selectedIdea} setSelectedIdea={setSelectedIdea} handleUpvote={handleUpvote} userId={user._id} />
        </div>
    );
};

export default Ideas;
