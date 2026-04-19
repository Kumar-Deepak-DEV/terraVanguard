const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBasicUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('_id username name avatar role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.username = req.body.username || user.username;
            user.name = req.body.name || user.name;
            user.avatar = req.body.avatar || user.avatar;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                name: updatedUser.name,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If the target is an admin, require master password
        if (user.role === 'admin') {
            const { masterPassword } = req.body;
            const validMaster = process.env.MASTER_PASSWORD ? process.env.MASTER_PASSWORD.trim() : '';
            if (!masterPassword || masterPassword !== validMaster) {
                return res.status(401).json({ message: 'Master password required to remove a Commander.' });
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If the target is an admin, require master password
        if (user.role === 'admin') {
            const { masterPassword } = req.body;
            const validMaster = process.env.MASTER_PASSWORD ? process.env.MASTER_PASSWORD.trim() : '';
            if (!masterPassword || masterPassword !== validMaster) {
                return res.status(401).json({ message: 'Master password required to edit a Commander.' });
            }
        }

        // Build update object - only include fields that were actually sent
        const updateFields = {};

        if (req.body.name !== undefined) updateFields.name = req.body.name;
        if (req.body.avatar !== undefined) updateFields.avatar = req.body.avatar;

        if (req.body.username && req.body.username.trim() !== '' && req.body.username !== user.username) {
            const exists = await User.findOne({ username: req.body.username });
            if (exists) return res.status(400).json({ message: 'Callsign already in use by another operative.' });
            updateFields.username = req.body.username;
        }

        if (req.body.password && req.body.password.trim() !== '') {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(req.body.password, salt);
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: false }
        ).select('-password');

        res.json({ _id: updated._id, username: updated.username, name: updated.name, role: updated.role, avatar: updated.avatar });
    } catch (error) {
        console.error('updateUserDetails error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role, masterPassword } = req.body;
        const validMaster = process.env.MASTER_PASSWORD ? process.env.MASTER_PASSWORD.trim() : '';
        if (role === 'admin' && masterPassword !== validMaster) {
            return res.status(401).json({ message: 'Invalid master password' });
        }
        
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = role;
            user.masterProtected = role === 'admin';
            await user.save();
            res.json({ message: 'User role updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
