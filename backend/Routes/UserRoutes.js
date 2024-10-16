const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const { requireLogin } = require('../Middleware/auth');

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            plainTextPassword: password,
            role
        });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, 'collabHub', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});


router.get('/me', requireLogin, (req, res) => {
    res.json(req.user);
});


router.get('/get-me', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('workspaces');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user details', details: err.message });
    }
});

router.put('/update', requireLogin, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            user.plainTextPassword = password;
            user.password = await bcrypt.hash(password, 10); 
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Update failed', details: err.message });
    }
});


router.delete('/delete', requireLogin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Deletion failed', details: err.message });
    }
});

module.exports = router;
