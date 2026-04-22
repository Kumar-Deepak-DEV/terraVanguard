import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Home, BookOpen, ScrollText } from 'lucide-react';

const sections = [
    { id: 'hero',  label: 'Home',       icon: Home       },
    { id: 'about', label: 'About',      icon: BookOpen   },
    { id: 'rules', label: 'Directives', icon: ScrollText },
];

const LandingNav = () => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateActive = useCallback(() => {
        const mid = window.innerHeight / 2;
        let idx = 0;
        sections.forEach(({ id }, i) => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= mid) idx = i;
        });
        setActiveIndex(idx);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
        return () => window.removeEventListener('scroll', updateActive);
    }, [updateActive]);

    const scrollTo = (id) => {
        if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const el = document.getElementById(id);
            if (el) {
                const navbarHeight = 80;
                const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
        // Do NOT close the nav
    };

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-center">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${open
                        ? 'bg-terra-neon text-terra-darker border-terra-neon shadow-[0_0_20px_rgba(0,255,136,0.7)]'
                        : 'bg-terra-darker text-terra-neon border-terra-neon/50 shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)]'
                    }`}
            >
                <Navigation size={20} className={open ? 'fill-terra-darker' : ''} />
            </button>

            {/* String + Icon Nodes */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col items-center overflow-hidden"
                    >
                        {sections.map((section, i) => {
                            const isActive    = i === activeIndex;
                            const isPassed    = i <= activeIndex;
                            const threadGreen = i <= activeIndex; // thread above node is green if this section is reached

                            return (
                                <div key={section.id} className="flex flex-col items-center">
                                    {/* Thread segment connecting toggle/previous node to this node */}
                                    <div
                                        className="w-[3px] rounded-full transition-all duration-500"
                                        style={{
                                            height: '36px',
                                            background: threadGreen
                                                ? 'linear-gradient(to bottom, #00ff88, #10b981)'
                                                : 'rgba(255,255,255,0.25)',
                                            boxShadow: threadGreen ? '0 0 8px rgba(0,255,136,0.5)' : 'none'
                                        }}
                                    />

                                    {/* Icon Node */}
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => scrollTo(section.id)}
                                        title={section.label}
                                        className={`
                                            w-[42px] h-[42px] rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${isActive
                                                ? 'bg-terra-neon text-terra-darker border-terra-neon shadow-[0_0_22px_rgba(0,255,136,0.9)]'
                                                : isPassed
                                                    ? 'bg-terra-emerald/20 text-terra-neon border-terra-emerald/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                                                    : 'bg-terra-darker/80 text-white/40 border-white/20 hover:border-white/50 hover:text-white/70'}
                                        `}
                                    >
                                        <section.icon size={17} />
                                    </motion.button>
                                </div>
                            );
                        })}

                        {/* Trailing thread below last node */}
                        <div
                            className="w-[3px] h-8 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingNav;

