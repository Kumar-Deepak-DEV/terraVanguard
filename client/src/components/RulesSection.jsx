import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Hourglass, Gavel, Lock, Zap } from 'lucide-react';

const RulesSection = () => {
    const rules = [
        {
            id: "01",
            title: "Exclusive Deployment",
            desc: "Operatives may only be deployed once per active cycle. No individual is permitted to engage in multiple combat scenarios within the same operational round.",
            icon: Crosshair
        },
        {
            id: "02",
            title: "Absolute Time Constraints",
            desc: "Every conflict is bound by an unyielding clock. Failure to execute within the designated time frame results in immediate tactical forfeiture.",
            icon: Hourglass
        },
        {
            id: "03",
            title: "Supreme Adjudication",
            desc: "The decrees of the Vanguard Referees are absolute and final. Any appeals must be officially lodged before the subsequent phase commences, or be forever silenced.",
            icon: Gavel
        },
        {
            id: "04",
            title: "Unbreakable Allegiance",
            desc: "Operatives are permanently bound to their declared faction for the duration of the campaign. Desertion or mid-conflict transfers are strictly prohibited.",
            icon: Lock
        }
    ];

    return (
        <section className="w-full max-w-5xl px-4 pt-24 pb-8 relative z-10 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center"
            >
                <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">Directives of <span className="text-terra-neon">Combat</span></h2>
                <p className="text-terra-light/80 text-lg font-medium max-w-2xl mx-auto">Laws that govern the battlefield. Read. Obey. Compete.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card relative border border-terra-neon/20 p-8 md:p-12 overflow-hidden"
            >
                {/* Background faint glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-terra-emerald/5 to-transparent"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    {rules.map((rule, index) => (
                        <div key={rule.id} className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-full border border-terra-neon/50 flex items-center justify-center mb-4 bg-terra-darker/80 shadow-[0_0_15px_rgba(0,255,136,0.2)] text-terra-neon">
                                <rule.icon size={20} />
                            </div>
                            
                            {/* Title Area */}
                            <h3 className="text-xl font-display font-bold text-terra-neon mb-2 flex items-center justify-center gap-2">
                                <span className="text-terra-emerald/80 text-sm font-mono tracking-widest">{rule.id}</span>
                                {rule.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-terra-light/70 max-w-2xl">{rule.desc}</p>
                            
                            {/* Divider (except last) */}
                            {index !== rules.length - 1 && (
                                <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-terra-stone/50 to-transparent mt-8"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-8 pt-6 border-t border-terra-stone/30 flex flex-col md:flex-row items-center justify-center gap-3 text-terra-emerald/80 text-sm font-medium text-center">
                    <Zap size={16} className="text-terra-neon hidden md:block" />
                    <p>Non-compliance triggers immediate expulsion. The authority of the Terra Vanguard Council is absolute.</p>
                </div>
            </motion.div>
        </section>
    );
};

export default RulesSection;
