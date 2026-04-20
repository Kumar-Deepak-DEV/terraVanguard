const Idea = require('../models/Idea');
const User = require('../models/User');

exports.getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find().populate('createdBy', 'username name avatar').sort({ upvotes: -1, createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createIdea = async (req, res) => {
    try {
        const { title, description, rules } = req.body;
        if (!rules || rules.length === 0) {
            return res.status(400).json({ message: 'At least one rule is required.' });
        }
        const idea = await Idea.create({
            title,
            description,
            rules,
            createdBy: req.user._id
        });
        res.status(201).json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.upvoteIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });

        const alreadyVoted = idea.voters.some(v => v.toString() === req.user._id.toString());

        if (alreadyVoted) {
            // Remove vote
            idea.upvotes = Math.max(0, idea.upvotes - 1);
            idea.voters.pull(req.user._id);
            await idea.save();

            await User.findByIdAndUpdate(req.user._id, {
                $pull: { upvotedIdeas: idea._id }
            });

            const updatedIdea = await Idea.findById(idea._id).populate('createdBy', 'username name avatar');
            return res.json({ ...updatedIdea.toObject(), unvoted: true });
        }

        // Add vote
        idea.upvotes += 1;
        idea.voters.push(req.user._id);
        await idea.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: { upvotedIdeas: idea._id }
        });

        const updatedIdeaAdd = await Idea.findById(idea._id).populate('createdBy', 'username name avatar');
        res.json(updatedIdeaAdd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteIdea = async (req, res) => {
    try {
        await Idea.findByIdAndDelete(req.params.id);
        res.json({ message: 'Idea deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        
        idea.approved = !idea.approved;
        await idea.save();
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ idea: req.params.id })
            .populate('user', 'username name avatar role')
            .populate({
                path: 'replyTo',
                populate: { path: 'user', select: 'username name' }
            })
            .sort({ createdAt: 1 }); // Whatsapp style: oldest first, new appended at bottom
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text, replyTo, tags } = req.body;
        const ideaId = req.params.id;
        
        const comment = await Comment.create({
            idea: ideaId,
            user: req.user._id,
            text,
            replyTo: replyTo || null,
            tags: tags || []
        });

        const idea = await Idea.findById(ideaId);

        // Process tags/notifications
        if (tags && tags.length > 0) {
            for (let tag of tags) {
                if (tag === 'admin') {
                    await Notification.create({
                        recipientRole: 'admin',
                        sender: req.user._id,
                        type: 'tag',
                        ideaId,
                        commentId: comment._id,
                        message: `${req.user.username} tagged admins in an idea: ${idea.title}`
                    });
                } else {
                    // Assuming tag is a userId
                    if (tag.toString() !== req.user._id.toString()) {
                        await Notification.create({
                            recipient: tag,
                            sender: req.user._id,
                            type: 'tag',
                            ideaId,
                            commentId: comment._id,
                            message: `${req.user.username} tagged you in an idea: ${idea.title}`
                        });
                    }
                }
            }
        }

        // Process reply notification
        if (replyTo) {
            const parentComment = await Comment.findById(replyTo);
            if (parentComment && parentComment.user.toString() !== req.user._id.toString()) {
                await Notification.create({
                    recipient: parentComment.user,
                    sender: req.user._id,
                    type: 'reply',
                    ideaId,
                    commentId: comment._id,
                    message: `${req.user.username} replied to your comment in: ${idea.title}`
                });
            }
        }

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username name avatar role')
            .populate({
                path: 'replyTo',
                populate: { path: 'user', select: 'username name' }
            });

        // Emit to all connected clients in this idea's room
        const io = req.app.get('io');
        if (io) {
            io.to(ideaId).emit('new_comment', populatedComment);
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
