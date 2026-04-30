const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        const orConditions = [{ recipient: userId }];
        if (userRole === 'admin') {
            orConditions.push({ recipientRole: 'admin' });
        }

        const query = {
            $and: [
                { sender: { $ne: userId } },
                { $or: orConditions }
            ]
        };

        const notifications = await Notification.find(query)
            .populate('sender', 'name username avatar')
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (!notification.readBy.includes(req.user._id)) {
            notification.readBy.push(req.user._id);
            await notification.save();
        }

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
