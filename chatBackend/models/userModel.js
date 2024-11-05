const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    } ,
    image:{
        type: String,
        required: [false,]
    },
    profilesetup: {
        type: Boolean,
        default: false
    },
    firstname: {
        type: String,
        required: [false],
    },
    lastname: {
        type: String,
        required: [false],
    },
    color: {
        type: Number,
        required: [false],
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    


})

module.exports = mongoose.model("user", userSchema);