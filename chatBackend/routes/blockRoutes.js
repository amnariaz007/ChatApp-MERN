const express = require('express');
const router = express.Router();
const { Block, Unblock} = require('../controllers/blockControllers');
const isLoggedIn = require("../middlewares/isLoggedin");


const blockRoutes = router

blockRoutes.post('/block', isLoggedIn, Block );
blockRoutes.post('/unBlock', isLoggedIn, Unblock );


module.exports = blockRoutes;


