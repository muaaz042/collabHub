const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel'); // Adjust path to your User model

exports.requireLogin = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, "collabHub"); // Make sure to match your JWT secret
            const user = await User.findById(decode._id);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.user = user;
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.log("Something went wrong:", error.message);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
