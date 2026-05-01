const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    tags: [{ type: String }] // Can store 'admin' or user objectIds as strings
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
