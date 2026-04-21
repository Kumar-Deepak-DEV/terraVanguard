const HallOfFame = require('../models/HallOfFame');

exports.getEntries = async (req, res) => {
    try {
        const entries = await HallOfFame.find().sort({ week: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const entry = await HallOfFame.create(req.body);
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await HallOfFame.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        await HallOfFame.findByIdAndDelete(req.params.id);
        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
