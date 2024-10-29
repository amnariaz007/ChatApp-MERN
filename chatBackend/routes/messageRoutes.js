const express = require('express');
const router = express.Router();
const {getMessages, geAllContactMessages} = require('../controllers/messageController');
const isLoggedIn = require("../middlewares/isLoggedin");


const messageRoutes = router

messageRoutes.post('/getMessages', isLoggedIn, getMessages );





module.exports = messageRoutes;

