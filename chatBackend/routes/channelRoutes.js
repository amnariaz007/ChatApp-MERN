const express = require('express');
const router = express.Router();
const {createChannel} = require('../controllers/channelController');
const isLoggedIn = require("../middlewares/isLoggedin");


const channelRoutes = router

channelRoutes.post('/createChannel', isLoggedIn, createChannel );





module.exports = channelRoutes;


 