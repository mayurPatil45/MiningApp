const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')

const connectDB = require('./config/db')

require('dotenv').config();

connectDB();
const app = express();
app.use(
    cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true,
    })
)

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', async(req, res) => {
    res.json({ msg: "Gotten successfully" })
})

app.use('/api/user', require('./routes/user'))
app.use('/api/mine', require('./routes/mining'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})