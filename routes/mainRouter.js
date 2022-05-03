const express = require('express')
const router = express.Router()

const {
    regValidator,
    loginValidator,
    userLoggedInValidation,
    postTopicValidation,
    leaveCommentValidator,
    changeUserImgValidation
} = require('../middleware/validator')

const {
    loggedIn,
    login,
    register,
    logout,
    getUserImg,
    getOtherUser,
    getMyTopics,
    getMyComments,
    changeUserImg,
    getNotifications
} = require('../controllers/userController')

const {
    getTopics,
    getReplies,
    postTopic,
    getTopic,
    getComments,
    leaveComment,
    getFavorites
} = require('../controllers/topicsController')

router.get('/loggedIn', loggedIn)
router.post('/register', regValidator, register)
router.post('/login', loginValidator, login)
router.get('/logout', logout)
router.get('/getUserImg/:username', getUserImg)
router.get('/getOtherUser/:username', getOtherUser)
router.get('/getMyTopics', userLoggedInValidation, getMyTopics)
router.get('/getMyComments', userLoggedInValidation, getMyComments)
router.post('/changeUserImg', userLoggedInValidation, changeUserImgValidation, changeUserImg)
router.get('/getNotifications', userLoggedInValidation, getNotifications)

router.post('/getTopics', getTopics)
router.get('/getReplies/:_id', getReplies)
router.post('/postTopic', userLoggedInValidation, postTopicValidation, postTopic)
router.get('/getTopic/:_id', getTopic)
router.post('/getComments', getComments)
router.post('/leaveComment', userLoggedInValidation, leaveCommentValidator, leaveComment)
router.post('/getFavorites', getFavorites)

module.exports = router