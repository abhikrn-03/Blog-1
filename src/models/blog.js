const mongoose = require('mongoose');

const Blog = mongoose.model('Blog', {
    body: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = Blog
