const express = require('express');
const { urlencoded } = require('express');
const router = express.Router();
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const auth = require('../middleware/auth')

const { User } = require('../models/Schema')

// MINE & CLAIM
const MINE_HOURS = 6;
router.post('/', async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ err: "User not found!" });
        }
        const currentDate = new Date();
        const lastMiningDate = new Date(user.lastMining);
        if (!user.lastMining) {
            await User.findByIdAndUpdate(user.id, {
                $set: { lastMining: currentDate },
            });
            return res.json({ msg: "Yoo minig just started🤭 " })
        }
        if (user.claimed) {
            return res.status(400).json({ msg: "Sorry, No minig going on. Already claimed" })
        }

        // Calculate total hours for current date and last mining date
        const currentTotalHours = currentDate.getHours() + currentDate.getMinutes() / 60;
        const lastMiningTotalHours = lastMiningDate.getHours() + lastMiningDate.getMinutes() / 60;

        // Check if mining period has passed
        const hoursPassed = (currentTotalHours - lastMiningTotalHours + 24) % 24;
        if (user.lastMining && !user.claimed && hoursPassed < MINE_HOURS) {
            return res.status(400).json({ err: "Sorry, Mining still going on 🤭" })
        }
        if (hoursPassed >= MINE_HOURS && !user.claimed) {
            await User.findByIdAndUpdate(user.id, {
                $inc: { point: 600 },
                $set: { lastMining: null },
            })
            return res.json({ msg: "Just claimed successfully🤭" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
})

module.exports = router;