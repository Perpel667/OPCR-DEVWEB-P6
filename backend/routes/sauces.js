const express = require('express');
const router = express.Router();
// recupere le middleware d'authentification et de multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

// creation de la sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
// recuperation de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
// recuperation d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
// modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;