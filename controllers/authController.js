const {User} = require('../models'); // Import the User model

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); // Use Sequelize's `findByPk` to get user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with user details, excluding sensitive fields like password
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Include the user's role
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};
