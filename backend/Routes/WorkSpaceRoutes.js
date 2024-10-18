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
router.get('/allWork', requireLogin, async (req, res) => {
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

// Add a member to a workspace by email (Admin or Team Lead)
router.post('/:id/add-member', requireLogin, async (req, res) => {
    const workspace = await Workspace.findById(req.params.id);
    
    // Check if the user is either admin or team lead
    if (!workspace || (req.user.role !== 'admin' && req.user._id.toString() !== workspace.teamLead.toString())) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { memberEmail } = req.body;
    
    try {
        // Find the user by email
        const member = await User.findOne({ email: memberEmail });

        if (!member || member.role !== 'team member') {
            return res.status(400).json({ error: 'Invalid member or member role' });
        }

        if (workspace.members.includes(member._id)) {
            return res.status(400).json({ error: 'User is already a member' });
        }

        // Add the member to the workspace
        workspace.members.push(member._id);
        await workspace.save();
        
        res.status(200).json({ message: 'Member added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add member', details: err.message });
    }
});


// Remove a member from a workspace by email (Admin or Team Lead)
router.delete('/:id/remove-member', requireLogin, async (req, res) => {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace || (req.user.role !== 'admin' && req.user._id.toString() !== workspace.teamLead.toString())) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { memberEmail } = req.body;

    try {
        // Find the member by email
        const member = await User.findOne({ email: memberEmail });

        if (!member || member.role !== 'team member') {
            return res.status(400).json({ error: 'Invalid member or member role' });
        }

        if (!workspace.members.includes(member._id)) {
            return res.status(400).json({ error: 'User is not a member of this workspace' });
        }

        // Remove the member from the members array
        workspace.members = workspace.members.filter(
            memberId => memberId.toString() !== member._id.toString()
        );
        await workspace.save();
        
        res.status(200).json({ message: 'Member removed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove member', details: err.message });
    }
});



// Delete a workspace (Admin only)
router.delete('/:id', requireLogin, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }

        // Only admins can delete the workspace
        await Workspace.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete workspace', details: err.message });
    }
});

module.exports = router;
