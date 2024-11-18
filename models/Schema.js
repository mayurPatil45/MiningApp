const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    point: {
        type: Number,
        default: 1000,
    },
    lastMining: {
        type: Date,
        default: null,
    },
    claimed: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true
    }
)

userSchema.plugin(uniqueValidator, {
    message: "{PATH} has already been taken",
});

userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword
    next();
})

const User = mongoose.model("user", userSchema);
module.exports = { User };