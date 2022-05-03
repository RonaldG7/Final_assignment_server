const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentsSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    topicId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    count: {
        type: Number
    },
    time: {
        type: String,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("assignment-comments", commentsSchema)