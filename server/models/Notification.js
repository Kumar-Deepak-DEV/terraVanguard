const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null if for all admins
    recipientRole: { type: String }, // 'admin' if targeting all admins
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['tag', 'reply'], required: true },
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    message: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track which users read it
    createdAt: { type: Date, default: Date.now, expires: 15 * 24 * 60 * 60 } // Automatically expires after 15 days
});

module.exports = mongoose.model('Notification', NotificationSchema);
