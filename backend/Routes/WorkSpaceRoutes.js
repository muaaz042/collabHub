const express = require('express');
const router = express.Router();
const Workspace = require('../models/WorkspaceModel');
const User = require('../Models/UserModel');
const { requireLogin } = require('../Middleware/auth');

// Create a new workspace (Admin only)
router.post('/create', requireLogin, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { name, teamLeadId } = req.body;
    try {
        const teamLead = await User.findById(teamLeadId);
        if (!teamLead || teamLead.role !== 'team lead') {
            return res.status(400).json({ error: 'Invalid team lead' });
        }
        const workspace = new Workspace({ name, admin: req.user._id, teamLead: teamLeadId });
        await workspace.save();
        res.status(201).json(workspace);
    } catch (err) {
        res.status(500).json({ error: 'Workspace creation failed', details: err.message });
    }
});

// Get all workspaces (Admin only)
router.get('/', requireLogin, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const workspaces = await Workspace.find().populate('admin teamLead members tasks');
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch workspaces', details: err.message });
    }
});

// Add a member to a workspace (Admin or Team Lead)
router.post('/:id/add-member', requireLogin, async (req, res) => {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace || (req.user.role !== 'admin' && req.user._id.toString() !== workspace.teamLead.toString())) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { memberId } = req.body;
    const member = await User.findById(memberId);
    if (!member || member.role !== 'team member') {
        return res.status(400).json({ error: 'Invalid member' });
    }
    if (workspace.members.includes(memberId)) {
        return res.status(400).json({ error: 'User is already a member' });
    }
    workspace.members.push(memberId);
    await workspace.save();
    res.status(200).json({ message: 'Member added' });
});

module.exports = router;
