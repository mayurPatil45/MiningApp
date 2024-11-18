const jwt = require('jsonwebtoken')
require('dotenv').config();

const secretKey = process.env.secretKey;

module.exports = async function (req, res, next){
    const token = req.header("auth-token")
    if(!token){
        return res.status(500).json({ msg: "No token, Invalid credentials" });
    }
    try {
        const decoded = await jwt.verify(token, secretKey);
        req.user = decoded.user
    } catch (error) {
        res.status(500).json({ msg: "Token is not valid" })
    }
    next();
}