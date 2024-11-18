const express = require('express')
const { urlencoded } = require('express')
const jwt = require("jsonwebtoken")
const router = express.Router()
const bcrypt = require('bcryptjs')
require('dotenv').config()

const auth = require('../middleware/auth')

const { User } = require('../models/Schema')
const secretKey = process.env.secretKey
const createToken = (payload) => {
    return jwt.sign(payload, secretKey)
}

router.post('/', async (req, res) => {
    let token;
    try {
        const { email, password } = req.body;
        const user = new User({
            email,
            password,
        })
        await user.save();
        const payload = {
            user: {
                id: user.id,
            }
        }
        const token = createToken(payload)
        res.json({
            msg: "Registered Successfully",
            jwt: token,
        })

    } catch (error) {
        if (error.message.includes("email has already been taken")) {
            res.status(500).json({ err: "email has already been taken" });
        } else {
            res.status(500).json({ err: "Please fill all inputs" });
        }
    }
})