const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout, userInfo, profileUpdate, profilePicture, deleteProfile } = require('../controllers/authController')
const isLoggedIn = require("../middlewares/isLoggedin");
const multer = require('multer');
const upload = multer({dest:"uploads/profiles/"})


const authRoutes = router

authRoutes.get('/', async (req, res) => {
    res.send('user router working');
});
authRoutes.post('/register', registerUser )

authRoutes.post('/login', loginUser )

authRoutes.get("/userInfo", isLoggedIn,  userInfo);

authRoutes.post('/profileUpdate',isLoggedIn,  profileUpdate )

authRoutes.post('/profilePicture',isLoggedIn, 
   upload.single("profile-image") ,
    profilePicture );

authRoutes.delete('/deleteProfile',isLoggedIn,  deleteProfile );

authRoutes.get("/logout", logout);



module.exports = authRoutes;