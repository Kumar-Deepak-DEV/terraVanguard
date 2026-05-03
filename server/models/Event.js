const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    countdown: {
        type: Date // target date for countdown
    },
    organizer: {
        type: String,
        required: true
    },
    gameType: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
