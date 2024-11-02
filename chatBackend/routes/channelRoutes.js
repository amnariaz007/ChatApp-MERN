const express = require('express');
const router = express.Router();
const {createChannel,GetUserChannel} = require('../controllers/channelController');
const isLoggedIn = require("../middlewares/isLoggedin");


const channelRoutes = router

channelRoutes.post('/createChannel', isLoggedIn, createChannel );
channelRoutes.get('/GetUserChannel', isLoggedIn, GetUserChannel );





module.exports = channelRoutes;


 