const express = require('express');
// creer un router
const router = express.Router();

// recupere le controller users
const userCtrl = require('../controllers/users');
// importe le middleware password-validator
const password = require('../middleware/password')

// envoi au /signup et appelle le middleware password qui si est bon continu sur le middleware signup du controller users
router.post('/signup',password ,userCtrl.signup);
// envoi au /login et appelle le middleware login du controller users
router.post('/login',userCtrl.login);


//exporte le router
module.exports = router;