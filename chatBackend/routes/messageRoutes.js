const express = require('express');
const router = express.Router();
const {getMessages, fileUpload } = require('../controllers/messageController');
const isLoggedIn = require("../middlewares/isLoggedin");

const multer = require('multer');
const upload = multer({dest:"uploads/files/"})

const messageRoutes = router

messageRoutes.post('/getMessages', isLoggedIn, getMessages );
messageRoutes.post('/fileUpload',   upload.single("file")   , isLoggedIn, fileUpload );




fileUpload
module.exports = messageRoutes;

