const express = require('express');
const router = express.Router();
const {getMessages, fileUpload, voiceNote } = require('../controllers/messageController');
const isLoggedIn = require("../middlewares/isLoggedin");

const multer = require('multer');
const upload = multer({dest:"uploads/files"})
const upload1 = multer({dest:"uploads/voiceNotes"})

const messageRoutes = router

messageRoutes.post('/getMessages', isLoggedIn, getMessages );
messageRoutes.post('/fileUpload', isLoggedIn,  upload.single("file")  , fileUpload );
messageRoutes.post('/voiceNote', isLoggedIn,  upload1.single("voiceNotes")  , voiceNote );





module.exports = messageRoutes;

