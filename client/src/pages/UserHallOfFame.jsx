import React from 'react';
import PublicHallOfFame from './PublicHallOfFame';
import { motion } from 'framer-motion';

// For the user dashboard, we'll reuse the PublicHallOfFame component 
// but we could wrap it in additional dashboard-specific UI if needed.
const UserHallOfFame = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <PublicHallOfFame />
        </motion.div>
    );
};

export default UserHallOfFame;
