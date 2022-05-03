const userSchema = require('../models/userSchema')
const topicsSchema = require('../models/topicsSchema')
const commentsSchema = require('../models/commentsSchema')
const notificationsSchema = require('../models/notificationsSchema')
const bcrypt = require('bcrypt')

module.exports = {
    loggedIn: async (req, res) => {
        const {username} = req.session
        try {
            if (username) {
                const findUser = await userSchema.findOne({username})
                const user = {
                    username,
                    joined: findUser.joined,
                    image: findUser.image,
                    comments: findUser.comments
                }
                return res.send({success: true, user})
            }
            res.send({success: false})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    register: async (req, res) => {
        const {username, email, password} = req.body
        try {
            const hash = await bcrypt.hash(password, 10)
            const user = await new userSchema({
                username,
                email,
                joined: Date.now(),
                password: hash
            })
            await user.save()

            res.send({success: true})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    login: async (req, res) => {
        const {username, password} = req.body
        try {
            const findUser = await userSchema.findOne({username})
            if (findUser) {
                const compareResult = await bcrypt.compare(password, findUser.password)
                if (compareResult) {
                    req.session.username = username
                    const user = {
                        username,
                        image: findUser.image,
                        joined: findUser.joined,
                        comments: findUser.comments
                    }
                    return res.send({success: true, user})
                }
            }
            res.send({success: false, message: 'Bad credentials'})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    logout: async (req, res) => {
        try {
            req.session.username = null
            res.send({success: true})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getUserImg: async (req, res) => {
        const {username} = req.params

        try {
            const findUser = await userSchema.findOne({username})
            const userImg = findUser.image
            res.send({success: true, userImg})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getOtherUser: async (req, res) => {
        const {username} = req.params

        try {
            const findOtherUser = await userSchema.findOne({username})
            if (findOtherUser) {
                const repliesCount = await commentsSchema.count({username})
                const topicsCount = await topicsSchema.count({username})
                return res.send({success: true, otherUser: findOtherUser, repliesCount, topicsCount})
            }
            res.send({success: false, message: "No such user"})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getMyTopics: async (req, res) => {
        const {username} = req.session

        try {
            const findTopics = await topicsSchema.find({username})
            res.send({success: true, topics: findTopics})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getMyComments: async (req, res) => {
        const {username} = req.session

        try {
            const findComments = await commentsSchema.find({username})
            res.send({success: true, comments: findComments})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    changeUserImg: async (req, res) => {
        const {url} = req.body
        const {username} = req.session

        try {
            const findUser = await userSchema.findOneAndUpdate(
                {username},
                {$set: {image: url}},
                {new: true})
            const user = {
                username,
                image: findUser.image,
                joined: findUser.joined,
                comments: findUser.comments
            }

            res.send({success: true, user})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    },
    getNotifications: async (req, res) => {
        const {username} = req.session

        try {
            const findNotifications = await notificationsSchema.find({username, read: false})

            res.send({success: true, findNotifications})
        } catch (err) {
            res.send({success: false, message: "Error message " + err})
        }
    }
}