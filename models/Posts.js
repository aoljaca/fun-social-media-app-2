const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
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

module.exports = mongoose.model('Posts', PostsSchema)