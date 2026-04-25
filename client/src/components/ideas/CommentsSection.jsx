import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Reply, X, AtSign, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const CommentsSection = ({ ideaId, userId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [users, setUsers] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [mentionIndex, setMentionIndex] = useState(0);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [hasMentions, setHasMentions] = useState(false);
    
    const commentsEndRef = useRef(null);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const socketRef = useRef(null);

    // Initial fetch and Socket setup
    useEffect(() => {
        fetchComments();
        fetchUsers();

        // Setup Socket.IO
        socketRef.current = io(import.meta.env.VITE_API_URL.replace('/api', ''));
        
        socketRef.current.on('connect', () => {
            socketRef.current.emit('join_idea_room', ideaId);
        });

        socketRef.current.on('new_comment', (newComment) => {
            setComments(prev => {
                // Check if we already have this comment (if we sent it)
                if (prev.some(c => c._id === newComment._id)) return prev;
                
                // Check for mentions
                if (newComment.tags?.includes(userId)) setHasMentions(true);
                setNewMessagesCount(count => count + 1);
                
                return [...prev, newComment];
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_idea_room', ideaId);
                socketRef.current.disconnect();
            }
        };
    }, [ideaId]);

    const fetchComments = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/ideas/${ideaId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(res.data);
        } catch (error) {
            toast.error("Failed to load comments");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/basic`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to load users for mentions");
        }
    };

    const scrollToBottom = (behavior = 'smooth') => {
        commentsEndRef.current?.scrollIntoView({ behavior });
        setNewMessagesCount(0);
    };

    // Scroll to bottom on first load
    useEffect(() => {
        if (comments.length > 0 && !newMessagesCount) {
            scrollToBottom('auto');
        }
    }, [comments.length === 0]); // only on initial load

    const handleTextChange = (e) => {
        const value = e.target.value;
        setText(value);

        // Check for '@' to trigger mentions
        const lastWord = value.split(' ').pop();
        if (lastWord.startsWith('@')) {
            setShowMentions(true);
            setMentionFilter(lastWord.slice(1).toLowerCase());
            setMentionIndex(0);
        } else {
            setShowMentions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (showMentions) {
            const filtered = filteredUsers();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % filtered.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + filtered.length) % filtered.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                if (filtered.length > 0) {
                    insertMention(filtered[mentionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowMentions(false);
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    };

    const filteredUsers = () => {
        // Remove current user from autocomplete suggestions
        const otherUsers = users.filter(u => u._id !== userId);
        const base = [{ _id: 'admin', username: 'admin', name: 'All Admins' }, ...otherUsers];
        return base.filter(u => u.username.toLowerCase().includes(mentionFilter) || u.name.toLowerCase().includes(mentionFilter));
    };

    const insertMention = (user) => {
        const words = text.split(' ');
        words.pop(); // Remove the typing @
        const newText = [...words, `@${user.username} `].join(' ');
        setText(newText);
        setTaggedUsers(prev => [...prev, user._id]);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const submitComment = async () => {
        if (!text.trim()) return;
        
        try {
            const token = JSON.parse(sessionStorage.getItem('user'))?.token;
            // Clean up tags list to only include ones that actually appear in text
            const finalTags = taggedUsers.filter(id => {
                const user = users.find(u => u._id === id);
                if (id === 'admin') return text.includes('@admin');
                return user && text.includes(`@${user.username}`);
            });

            await axios.post(`${import.meta.env.VITE_API_URL}/ideas/${ideaId}/comments`, {
                text: text.trim(),
                replyTo: replyTo?._id || null,
                tags: finalTags
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setText('');
            setReplyTo(null);
            setTaggedUsers([]);
            fetchComments();
            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const scrollToMentions = () => {
        const mentionEls = containerRef.current?.querySelectorAll('.mention-me');
        if (mentionEls && mentionEls.length > 0) {
            mentionEls[mentionEls.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHasMentions(false);
        }
    };

    const renderTextWithMentions = (text) => {
        // Highlight @mentions in text
        return text.split(/(@[\w.-]+)/g).map((part, i) => {
            if (part.startsWith('@')) {
                const username = part.slice(1);
                const isMe = username === users.find(u=>u._id===userId)?.username || (username === 'admin' && users.find(u=>u._id===userId)?.role === 'admin');
                const isKnownUser = users.some(u => u.username === username) || username === 'admin';
                
                if (isKnownUser) {
                    return <span key={i} className={`font-bold px-1 rounded ${isMe ? 'bg-terra-neon/20 text-terra-neon mention-me' : 'text-blue-400'}`}>{part}</span>;
                }
                // If it starts with @ but isn't a known user, still format it slightly differently or just return normally
                return <span key={i} className="text-blue-400/70">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="flex flex-col h-[500px] border border-terra-stone rounded-xl overflow-hidden bg-terra-dark/50 mt-6 relative" ref={containerRef}>
            {/* Header */}
            <div className="bg-terra-darker p-3 border-b border-terra-stone flex justify-between items-center shadow-md z-10">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                    Discussion
                </span>
                <div className="flex gap-2">
                    {hasMentions && (
                        <button onClick={scrollToMentions} className="bg-terra-neon/20 text-terra-neon p-1.5 rounded-full hover:bg-terra-neon/30 transition-colors animate-pulse" title="Jump to mention">
                            <AtSign size={16} />
                        </button>
                    )}
                    {newMessagesCount > 0 && (
                        <button onClick={() => scrollToBottom()} className="bg-terra-stone text-terra-light p-1.5 rounded-full hover:bg-terra-stone/80 transition-colors flex items-center gap-1 text-xs" title="Scroll to bottom">
                            <ChevronDown size={16} /> <span className="pr-1">{newMessagesCount}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {comments.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-terra-light/40 text-sm">
                        No messages yet. Start the discussion!
                    </div>
                ) : (
                    comments.map(comment => {
                        const isMine = comment.user._id === userId;
                        return (
                            <div key={comment._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 ${isMine ? 'bg-terra-neon/10 border border-terra-neon/20 text-white rounded-tr-sm' : 'bg-terra-darker border border-terra-stone text-terra-light rounded-tl-sm'}`}>
                                    {!isMine && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-terra-neon">{comment.user.name}</span>
                                            {comment.user.role === 'admin' && <span className="text-[9px] uppercase bg-yellow-500/20 text-yellow-500 px-1 rounded">Admin</span>}
                                        </div>
                                    )}
                                    
                                    {comment.replyTo && (
                                        <div className={`text-[11px] p-2 rounded mb-2 border-l-2 ${isMine ? 'bg-black/20 border-terra-neon/50 text-terra-light/70' : 'bg-black/20 border-terra-stone text-terra-light/50'}`}>
                                            <div className="font-bold mb-0.5">{comment.replyTo.user.name}</div>
                                            <div className="truncate">{comment.replyTo.text}</div>
                                        </div>
                                    )}
                                    
                                    <div className="text-sm whitespace-pre-wrap word-break">
                                        {renderTextWithMentions(comment.text)}
                                    </div>
                                    
                                    <div className={`flex items-center justify-between mt-2 gap-4 ${isMine ? 'text-terra-light/40' : 'text-terra-light/40'}`}>
                                        <span className="text-[10px]">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        <button onClick={() => setReplyTo(comment)} className="hover:text-terra-neon opacity-0 transition-opacity" style={{opacity: 1}}><Reply size={12} /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Reply Indicator */}
            {replyTo && (
                <div className="bg-terra-stone/50 px-4 py-2 flex items-center justify-between border-t border-terra-stone text-sm">
                    <div className="flex items-center gap-2 text-terra-light truncate">
                        <Reply size={14} className="text-terra-neon" />
                        Replying to <span className="font-bold text-terra-neon">{replyTo.user.name}</span>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-terra-light/50 hover:text-white"><X size={16} /></button>
                </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-terra-darker border-t border-terra-stone relative">
                {/* Mentions Dropdown */}
                {showMentions && filteredUsers().length > 0 && (
                    <div className="absolute bottom-full left-0 w-64 max-h-48 overflow-y-auto bg-terra-darker border border-terra-stone rounded-t-lg shadow-xl z-20">
                        {filteredUsers().map((u, i) => (
                            <button key={u._id} onClick={() => insertMention(u)} 
                                className={`w-full text-left px-4 py-2 text-sm flex flex-col hover:bg-terra-stone/50 ${i === mentionIndex ? 'bg-terra-stone/80' : ''}`}>
                                <span className="font-bold text-terra-neon">@{u.username}</span>
                                <span className="text-xs text-terra-light/60">{u.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                
                <div className="flex items-end gap-2 relative">
                    <textarea
                        ref={inputRef}
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Use @ to tag)"
                        className="flex-1 bg-terra-dark border border-terra-stone rounded-xl px-4 py-3 text-sm text-white placeholder-terra-light/30 focus:outline-none focus:border-terra-neon/50 resize-none min-h-[44px] max-h-[120px]"
                        rows={1}
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = (e.target.scrollHeight) + 'px';
                        }}
                    />
                    <button 
                        onClick={submitComment}
                        disabled={!text.trim()}
                        className="bg-terra-neon text-terra-dark p-3 rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsSection;
