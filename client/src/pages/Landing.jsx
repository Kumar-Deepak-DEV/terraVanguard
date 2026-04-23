import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Trophy, ChevronRight } from 'lucide-react';
import RulesSection from '../components/RulesSection';
import LandingNav from '../components/LandingNav';

const Landing = () => {
    return (
        <div className="min-h-screen bg-terra-dark relative overflow-hidden flex flex-col">
            <Helmet>
                <title>Welcome | Terra Vanguard</title>
                <meta name="description" content="Welcome to the Terra Vanguard Class Portal. Access your dashboard, join the squad, and participate in fun activities." />
            </Helmet>
            <div className="absolute inset-0 bg-stars-pattern opacity-30 z-0"></div>
            <LandingNav />
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section id="hero" className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl z-10"
                >
                    <div className="inline-flex items-center space-x-2 bg-terra-stone/50 rounded-full px-4 py-1.5 mb-6 border border-terra-stone backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-terra-neon animate-pulse"></span>
                        <span className="text-sm font-medium text-terra-light/80">Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 tracking-tight leading-tight">
                        Forge Your Legacy With <br />
                        <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-terra-emerald to-terra-neon">TERRA VANGUARD</span>
                    </h1>
                    <p className="text-lg md:text-xl text-terra-light/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join the elite earth faction in the ultimate competitive esports league. We stand for power, resilience, and unyielding strength.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link to="/login" className="btn-primary w-full sm:w-auto">
                            Join the Vanguard <ChevronRight size={18} className="ml-1" />
                        </Link>
                        <Link to="/events" className="btn-secondary w-full sm:w-auto bg-terra-darker/50 backdrop-blur-md">
                            View Upcoming Events
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full max-w-7xl px-4 py-24 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">The <span className="text-terra-neon">Terra</span> Philosophy</h2>
                        <p className="text-terra-light/70 text-lg leading-relaxed mb-6">
                            As one of the four elite Vanguards, Terra represents the immovable object and the unstoppable force. We build strategies grounded in rock-solid fundamentals and execute them with earthquake-like intensity.
                        </p>
                        <p className="text-terra-light/70 text-lg leading-relaxed mb-8">
                            Our players are not just competitors; they are architects of victory, building fortresses of dominance in every game they play.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { icon: Shield, text: 'Impenetrable Defense & Strategy' },
                                { icon: Users, text: 'Unbreakable Team Cohesion' },
                                { icon: Trophy, text: 'Consistent Championship Contenders' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-3 text-terra-light">
                                    <div className="w-10 h-10 rounded-lg bg-terra-neon/10 flex items-center justify-center text-terra-neon border border-terra-neon/20">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-medium text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-terra-emerald/20 to-transparent rounded-2xl blur-2xl"></div>
                        <div className="glass-card p-2 relative h-[500px] overflow-hidden group">
                            <div className="absolute inset-0 bg-terra-darker/40 z-10 group-hover:bg-transparent transition-all duration-500"></div>
                            {/* Placeholder for actual vanguard image/video */}
                            <div className="w-full h-full bg-terra-stone flex items-center justify-center rounded-xl bg-[url('https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777638206/WhatsApp_Image_2026-04-24_at_4.33.33_PM_gaxwys.jpg')] bg-cover bg-center">
                                <h3 className="text-4xl font-display font-bold text-white z-20 mix-blend-overlay opacity-50">UNYIELDING</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Rules Section */}
            <div id="rules">
                <RulesSection />
            </div>
        </div>
        </div>
    );
};

export default Landing;
