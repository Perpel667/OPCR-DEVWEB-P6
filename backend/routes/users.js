const express = require('express');
// creer un router
const router = express.Router();

// recupere le controller users
const userCtrl = require('../controllers/users');

// envoi au /signup et appelle le middleware signup du controller users
router.post('/signup',userCtrl.signup);
// envoi au /login et appelle le middleware login du controller users
router.post('/login',userCtrl.login);


//exporte le router
module.exports = router;