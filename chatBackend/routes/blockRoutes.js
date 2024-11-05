const express = require('express');
const router = express.Router();
const { Block, Unblock} = require('../controllers/blockControllers');
const isLoggedIn = require("../middlewares/isLoggedin");


const blockRoutes = router

blockRoutes.post('/Block', isLoggedIn, Block );
blockRoutes.post('/UnblockUnblock', isLoggedIn, Unblock );


module.exports = blockRoutes;


