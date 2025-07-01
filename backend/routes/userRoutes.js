const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const User = require("../models/User")

router.post('/add-user', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/getUserDetails', userController.getUserDetails)
router.post('/logout', userController.logout)
router.get('/allusers', userController.getUsers)

module.exports = router