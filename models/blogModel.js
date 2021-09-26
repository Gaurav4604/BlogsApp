const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'A blog must have a title'],
        minlength: [5, 'Title should be atleast of 5 letters'],
        maxlength: [200, 'Title cannot be longer than 200 letters']
    },
    body: {
        type: String,
        trim: true,
        required: [true, 'A blog must have a body']
    },
    keywords: {
        type: [String],
        trim: true,
    },
    userID: {
        type: String,
        trim: true,
        required: [true, 'A blog must be linked to a user']
    },
    public: {
        type: Boolean,
        default: true,
        required: [true, 'A blog must be public or private']
    },
    createdAt: {
        type: Date,
        required: [true, 'A blog needs to be created at some time'],
        default: Date.now()
    }
});

const Blog = mongoose.model('Blog', blogSchema);

exports.Blog = Blog;