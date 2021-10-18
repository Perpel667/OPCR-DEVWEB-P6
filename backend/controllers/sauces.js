// importe dans une variable Sauce le schema mongoose du même nom
const Sauce = require('../models/Sauce');
// package file system 
const fs = require('fs');

//////////////////
// Middlewares //
////////////////

// middleware création de sauce
exports.createSauce = (req, res, next) => {
    // recuperation de la sauce dans le req.body
  const sauceObject = JSON.parse(req.body.sauce);
  // declaration des numbers & des arrays
  sauceObject.likes = 0;
  sauceObject.dislikes = 0;
  sauceObject.usersLiked = [];
  sauceObject.usersDisliked = [];
  // supression de l'id de base
  delete sauceObject._id;
  // creation de la sauce
  const sauce = new Sauce({
      // on envoi tout les elements de la sauce de la requete
    ...sauceObject,
    // resolution complete de l'URL de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // enregistrement de la sauce dans la base de données mongoDB
  sauce.save()
  // si la sauce de a été créer
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    // si la sauce n'a pas été creer
    .catch(error => res.status(400).json({ error }));
};