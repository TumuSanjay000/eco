const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret);

        res.send({
            success: true,
            message: 'User logged in successfully',
            data: token
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "user fetched successfully",
            data: user,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;