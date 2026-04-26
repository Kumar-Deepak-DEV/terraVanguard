import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-terra-dark flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-terra-emerald/5 blur-[150px]"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-terra-neon/5 blur-[150px]"></div>
            </div>
            <Navbar />
            <main className="flex-grow pt-24 pb-12 relative">
                <Outlet />
            </main>
            <footer className="bg-terra-darker border-t border-terra-stone py-8 relative z-10 text-center">
                <p className="text-terra-light/60 text-sm font-display">© {new Date().getFullYear()} Terra Vanguard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default UserLayout;
