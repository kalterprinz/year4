const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    userstatus:{
        type: String,
        required: true,
        enum: ['driver', 'officer', 'admin'],
        default: 'driver'
    },
    password:{
        type: String,
        required: true
    },
})

const UserModel = mongoose.model ("users", UserSchema)

module.exports = UserModel;