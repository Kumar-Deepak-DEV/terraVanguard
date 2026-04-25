import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        if (difference <= 0) return {};
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 60000);
        return () => clearTimeout(timer);
    });

    if (Object.keys(timeLeft).length === 0) {
        return <span className="text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">EVENT STARTED</span>;
    }

    return (
        <div className="flex space-x-3">
            {Object.keys(timeLeft).map((interval, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-terra-darker rounded-lg border border-terra-neon/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.1)]">
                        <span className="text-xl font-display font-bold text-terra-neon">{timeLeft[interval]}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-terra-light/50 mt-1">{interval}</span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
