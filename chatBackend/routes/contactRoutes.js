const express = require('express');
const router = express.Router();
const {searchContacts, getAllContactMessages} = require('../controllers/contactController');
const isLoggedIn = require("../middlewares/isLoggedin");


const contactRoutes = router

contactRoutes.post('/searchContacts', isLoggedIn, searchContacts );
contactRoutes.get('/getAllContactMessages', isLoggedIn, getAllContactMessages );

module.exports = contactRoutes;

