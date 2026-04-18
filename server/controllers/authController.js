const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { username, name, password, role, masterPassword } = req.body;
    
    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'User ID cannot be empty.' });
    }
    if (!password || password.trim() === '') {
        return res.status(400).json({ message: 'Password cannot be empty.' });
    }

    try {
        const userExists = await User.findOne({ username }); 
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        if (role === 'admin') {
            const validMaster = process.env.MASTER_PASSWORD ? process.env.MASTER_PASSWORD.trim() : '';
            console.log('Received masterPassword:', masterPassword, typeof masterPassword);
            console.log('Expected validMaster:', validMaster, typeof validMaster);
            console.log('Are they equal?', masterPassword === validMaster);
            if (masterPassword !== validMaster) {
                return res.status(401).json({ message: 'Invalid master password' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            name,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user',
            masterProtected: role === 'admin'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'User ID cannot be empty.' });
    }
    if (!password || password.trim() === '') {
        return res.status(400).json({ message: 'Password cannot be empty.' });
    }

    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
