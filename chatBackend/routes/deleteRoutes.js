const express = require('express');
const router = express.Router();
const { DeleteAll, DeleteOne} = require('../controllers/deleteChatController');
const isLoggedIn = require("../middlewares/isLoggedin");


const deleteRoutes = router

deleteRoutes.post('/deleteAll', isLoggedIn, DeleteAll );
deleteRoutes.post('/deleteOne', isLoggedIn, DeleteOne );


module.exports = deleteRoutes;


