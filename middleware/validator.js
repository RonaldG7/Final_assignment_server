const userSchema = require('../models/userSchema');
const emailValidator = require('email-validator')

module.exports = {
    regValidator: async (req, res, next) => {
        const {username, email, password, passwordTwo} = req.body


        const findUsername = await userSchema.findOne({username})
        const findEmail = await userSchema.findOne({email})

        if (findUsername) return res.send({success: false, message: 'Username in use'})
        if (findEmail) return res.send({success: false, message: 'Email in use'})

        if (!emailValidator.validate(email)) return res.send({success: false, message: 'Check email please'})
        if (4 > username.length) return res.send({success: false, message: 'Username too short'})
        if (username.length > 20) return res.send({success: false, message: 'Username too long'})
        if (4 > password.length) return res.send({success: false, message: 'Password too short'})
        if (password !== passwordTwo) return res.send({success: false, message: 'Passwords don`t match'})

        next()
    },
    loginValidator: async (req, res, next) => {
        const {username, password} = req.body

        if (username.length === 0) return res.send({success: false, message: 'Username field is empty'})
        if (password.length === 0) return res.send({success: false, message: 'Password field is empty'})

        next()
    },
    userLoggedInValidation: (req, res, next) => {
        const {username} = req.session

        if (!username) return res.send({success: false, message: 'You have to log in to use application'})

        next()
    },
    postTopicValidation: (req, res, next) => {
        const {username, title, comment, url} = req.body

        if (username.length === 0) return res.send({success: false, message: "You have to log in"})
        if (title.length === 0) return res.send({success: false, message: 'Title field is empty'})
        if (title.length < 4) return res.send({success: false, message: 'Title is too short. 4 symbols min.'})
        if (title.length > 50) return res.send({success: false, message: 'Title is too long. 50 symbols max.'})
        if (comment.length === 0) return res.send({success: false, message: 'Description field is empty'})
        if (url.length > 0 && !url.startsWith('http')) return res.send({success: false, message: 'Url has to start with http'})

        next()
    },
    leaveCommentValidator: (req, res, next) => {
        const {username, comment, url} = req.body

        if (username.length === 0) return res.send({success: false, message: "You have to log in"})
        if (comment.length === 0) return res.send({success: false, message: 'Comment field is empty'})
        if (url.length > 0 && !url.startsWith('http')) return res.send({success: false, message: 'Url has to start with http'})

        next()
    },
    changeUserImgValidation: (req, res, next) => {
        const {url} = req.body

        if (!url.includes('http')) return res.send({success: false, message: "Has to be an HTTP Url"})

        next()
    }
}