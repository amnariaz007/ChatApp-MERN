const express = require('express');
const router = express.Router();
const {searchContacts, getAllContactMessages, getAllContacts, blockUser} = require('../controllers/contactController');
const isLoggedIn = require("../middlewares/isLoggedin");


const contactRoutes = router

contactRoutes.post('/searchContacts', isLoggedIn, searchContacts );
contactRoutes.get('/getAllContactMessages', isLoggedIn, getAllContactMessages );
contactRoutes.get('/getAllContacts', isLoggedIn, getAllContacts );


module.exports = contactRoutes;


