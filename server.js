const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

require('dotenv').config();

connectDB();
const app = express();

// CORS configuration
app.use(
    cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true,
    })
);

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', async (req, res) => {
    res.json({ msg: "Gotten successfully" });
});

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/mine', require('./routes/mining'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
