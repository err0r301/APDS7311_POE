const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    IDNumber: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);