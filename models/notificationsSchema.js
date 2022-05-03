const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationsSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    topicId: {
        type: String,
        required: true
    },
    commentLeftBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    },
    time: {
        type: String,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("assignment-notifications", notificationsSchema)