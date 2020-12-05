const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    likes: {
        type: Number,
        default: 0
    },
    whoLiked: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', CommentSchema)