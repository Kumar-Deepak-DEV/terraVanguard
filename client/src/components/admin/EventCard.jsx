import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2 } from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete }) => (
    <div className={`glass-card p-6 border-l-4 ${event.active ? 'border-l-terra-emerald' : 'border-l-terra-stone opacity-70'}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                <span className="text-xs text-terra-neon uppercase tracking-wider">{event.organizer} • {event.gameType || 'General'}</span>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(event)} className="p-2 text-terra-light/60 hover:text-terra-neon hover:bg-terra-neon/10 rounded-lg transition-colors">
                    <Edit size={16} />
                </button>
                <button onClick={() => onDelete(event._id)} className="p-2 text-terra-light/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
        <p className="text-sm text-terra-light/70 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center text-terra-light/80">
                <Calendar size={14} className="mr-2 text-terra-stone" />
                <span>{new Date(event.date).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-terra-stone">
                <span className={`text-xs font-bold px-2 py-1 rounded ${event.active ? 'bg-emerald-400/10 text-emerald-400' : 'bg-terra-stone text-terra-light/50'}`}>
                    {event.active ? 'ACTIVE' : 'ARCHIVED'}
                </span>
            </div>
        </div>
    </div>
);

export default EventCard;
