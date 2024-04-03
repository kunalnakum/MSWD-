const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: true // Corrected 'require' to 'required'
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema); // Corrected 'UserSchem' to 'UserSchema'
