const express = require('express');
const router = express.Router();
const TimerLog = require('../Models/TimerModel');
const Task = require('../models/TaskModel');
const { requireLogin } = require('../Middleware/auth');

// Start a timer (Team Member)
router.post('/:taskId/start', requireLogin, async (req, res) => {
    if (req.user.role !== 'team member') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to start the timer for this task' });
        }
        
        const timerLog = new TimerLog({
            user: req.user._id,
            task: task._id,
            startTime: new Date()
        });
        
        await timerLog.save();
        res.status(200).json({ message: 'Timer started', timerLog });
    } catch (err) {
        res.status(500).json({ error: 'Failed to start timer', details: err.message });
    }
});

// Stop a timer (Team Member)
router.post('/:taskId/stop', requireLogin, async (req, res) => {
    if (req.user.role !== 'team member') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to stop the timer for this task' });
        }
        
        const timerLog = await TimerLog.findOne({ task: task._id, user: req.user._id }).sort({ startTime: -1 });
        if (!timerLog || timerLog.endTime) {
            return res.status(400).json({ error: 'No active timer found' });
        }
        
        timerLog.endTime = new Date();
        await timerLog.save();
        res.status(200).json({ message: 'Timer stopped', timerLog });
    } catch (err) {
        res.status(500).json({ error: 'Failed to stop timer', details: err.message });
    }
});

// Get timer logs for a specific task (Admin or Team Lead)
router.get('/task/:taskId/logs', requireLogin, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const logs = await TimerLog.find({ task: task._id }).populate('user', 'name');
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch timer logs', details: err.message });
    }
});

module.exports = router;
