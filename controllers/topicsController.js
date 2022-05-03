const topicsSchema = require('../models/topicsSchema')
const userSchema = require('../models/userSchema')
const commentsSchema = require('../models/commentsSchema')
const notificationsSchema = require('../models/notificationsSchema')

module.exports = {
    getTopics: async (req, res) => {
        const {page} = req.body
        try {
            const items = await topicsSchema.count({})
            const totalPages = Math.ceil(items / 10)
            const topics = await topicsSchema
                .find({})
                .sort({time: -1})
                .limit(10)
                .skip(10 * (page - 1))
            res.send({success: true, topics, totalPages})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getReplies: async (req, res) => {
        const {_id} = req.params

        try {
            const count = await commentsSchema.count({topicId: _id})
            const comments = await commentsSchema.find({topicId: _id})
            const lastComment = comments[comments.length - 1]

            res.send({success: true, count, lastComment})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    postTopic: async (req, res) => {
        const {username, title, comment, url} = req.body
        const findUser = await userSchema.findOne({username})
        try {
            if (findUser) {
                const createTopic = await new topicsSchema({
                    username,
                    title,
                    comment,
                    time: Date.now(),
                    url
                })
                await createTopic.save()

                return res.send({success: true})
            }
            res.send({success: false, message: "No such user or login please"})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getTopic: async (req, res) => {
        const {_id} = req.params
        const {username} = req.session

        try {
            const findTopic = await topicsSchema.findOne({_id})

            if (findTopic.username === username) await notificationsSchema.updateMany({topicId: _id}, {
                    $set:
                        {read: true}
                },
                {new: true})

            res.send({success: true, findTopic})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getComments: async (req, res) => {
        const {topicId, page} = req.body

        try {
            const items = await commentsSchema.count({topicId})
            const totalPages = Math.ceil(items / 10)
            const comments = await commentsSchema
                .find({topicId})
                .limit(10)
                .skip(10 * (page - 1))

            res.send({success: true, comments, totalPages})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    leaveComment: async (req, res) => {
        const {topicId, username, comment, url, page} = req.body

        try {
            const count = await commentsSchema.count({topicId})
            const newComment = await new commentsSchema({
                topicId,
                username,
                comment,
                url,
                count: count + 2,
                time: Date.now()
            })
            await newComment.save()

            const items = await commentsSchema.count({topicId})
            const totalPages = Math.ceil(items / 10)
            const comments = await commentsSchema
                .find({topicId})
                .limit(10)
                .skip(10 * (page - 1))

            const topic = await topicsSchema.findOne({_id: topicId})

            if (topic.username !== username) {
                const notification = await new notificationsSchema({
                    topicId,
                    username: topic.username,
                    title: topic.title,
                    commentLeftBy: username
                })
                await notification.save()
            }

            res.send({success: true, comments, totalPages})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getFavorites: async (req, res) => {
        const {favorites} = req.body
        try {
            const findFavorites = await topicsSchema.find({_id: favorites})

            res.send({success: true, topics: findFavorites})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    }
}