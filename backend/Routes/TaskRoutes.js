const express = require('express');
const router = express.Router();
const Task = require('../Models/TaskModel');
const Workspace = require('../models/WorkspaceModel');
const { requireLogin } = require('../Middleware/auth');


router.post('/create', requireLogin, async (req, res) => {
    if (req.user.role !== 'team lead') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { title, assignedTo, deadline, workspaceId } = req.body;
    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace || workspace.teamLead.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to create tasks in this workspace' });
        }
        const task = new Task({ title, assignedTo, deadline, status: 'Pending' });
        workspace.tasks.push(task._id);
        await task.save();
        await workspace.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Task creation failed', details: err.message });
    }
});


router.get('/workspace/:workspaceId', requireLogin, async (req, res) => {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || (!workspace.members.includes(req.user._id) && workspace.teamLead.toString() !== req.user._id.toString())) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const tasks = await Task.find({ _id: { $in: workspace.tasks } });
    res.json(tasks);
});


router.patch('/:id/status', requireLogin, async (req, res) => {
    const { status } = req.body;
    if (req.user.role !== 'team member') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to update this task' });
        }
        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task', details: err.message });
    }
});


router.delete('/:id', requireLogin, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const workspace = await Workspace.findOne({ tasks: task._id });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }

        if (req.user.role !== 'admin' && workspace.teamLead.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        workspace.tasks = workspace.tasks.filter(taskId => taskId.toString() !== task._id.toString());
        await workspace.save();

        await Task.findByIdAndDelete(task._id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task', details: err.message });
    }
});

module.exports = router;
