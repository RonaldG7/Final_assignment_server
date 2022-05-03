const mongoose = require("mongoose")
const Schema = mongoose.Schema

const topicsSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    title: {
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
    time: {
        type: String,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("assignment-topics", topicsSchema)