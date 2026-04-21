const mongoose = require('mongoose');

const HallOfFameSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true
    },
    playerName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    organizer: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    achievement: {
        type: String,
        required: true
    },
    eventName: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('HallOfFame', HallOfFameSchema);
