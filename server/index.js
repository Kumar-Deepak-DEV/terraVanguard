require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://team-terra.vercel.app'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ideas', require('./routes/ideaRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/hall-of-fame', require('./routes/hallOfFameRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Basic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://team-terra.vercel.app'],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Make io accessible to our router
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_idea_room', (ideaId) => {
        socket.join(ideaId);
        console.log(`User joined room: ${ideaId}`);
    });

    socket.on('leave_idea_room', (ideaId) => {
        socket.leave(ideaId);
        console.log(`User left room: ${ideaId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
