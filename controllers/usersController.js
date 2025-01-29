// controllers/userController.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const PurchaseOrder = require('../models/PurchaseOrder');
const Commission = require('../models/Commission');
const { sendEmailNewUser } = require('../utils/mailer');

// Create a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, identification } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            identification,
            type: 'user',
        });

        // Generate a JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hour
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        await sendEmailNewUser({ to: newUser });

        res.status(201).json({
            message: 'User created successfully.',
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 1 hour
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return the token to the client
        res.status(200).json({
            message: 'User logged successfully.',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: PurchaseOrder,
                    as: 'purchaseOrders',
                    include: [
                        {
                            model: Commission,
                            as: 'commissions',
                        },
                    ],
                },
            ],
            order: [['id', 'ASC']],
        });

        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ name, email, password });
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ status: 'inactive' });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
exports.activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ status: 'active' });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
