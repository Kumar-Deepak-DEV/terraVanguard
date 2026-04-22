import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingLogo = () => {
    const location = useLocation();

    // Hide on the landing page
    if (location.pathname === '/') return null;

    return (
        <div className="fixed bottom-12 right-8 z-[150] pointer-events-none flex items-center justify-center">
            {/* Pulsing Aura Effect */}
            <div className="absolute w-20 h-20 rounded-full bg-terra-neon/40 blur-xl animate-pulse scale-150"></div>
            <div className="absolute w-20 h-20 rounded-full bg-terra-emerald/30 blur-2xl animate-pulse scale-[2]"></div>
            
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-terra-neon shadow-[0_0_30px_rgba(0,255,136,0.8),0_0_60px_rgba(0,255,136,0.4)] pointer-events-auto cursor-pointer hover:scale-105 transition-transform duration-300">
                <img 
                    src="https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777638206/WhatsApp_Image_2026-04-24_at_4.33.33_PM_gaxwys.jpg" 
                    alt="Vanguard Logo" 
                    className="w-full h-full object-cover scale-[1.25] translate-y-2" 
                />
            </div>
        </div>
    );
};

export default FloatingLogo;
