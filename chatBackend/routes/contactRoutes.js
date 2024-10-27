const express = require('express');
const router = express.Router();
const {searchContacts} = require('../controllers/contactController');
const isLoggedIn = require("../middlewares/isLoggedin");


const contactRoutes = router

contactRoutes.post('/searchContacts', isLoggedIn, searchContacts );

module.exports = contactRoutes;

