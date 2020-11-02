const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Cannot include the word "password"')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Not a valid email ID')
            }
        }
    },
    profession: {
        type: String,
        trim: true,
    },
    gender: {
        type: String
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value<0){
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User