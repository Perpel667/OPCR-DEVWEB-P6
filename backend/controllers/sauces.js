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

// middleware récuperation des sauces
exports.getAllSauces = (req, res, next) => {
  // on viens chercher toutes les sauces sur la page //
  Sauce.find().then(
    (sauces) => {
      // si des sauces sont trouvées on renvoi un status 200 et on converti la réponse sauces avec .json
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      // si il y a une erreur on renvoi un status 400 avec le message d'erreur
      res.status(400).json({
        error: error
      });
    }
  );
};

// middleware récuperation d'une sauce en particulier
exports.getOneSauce = (req, res, next) => {
  // on viens chercher une sauce en particulier avec son params.id//
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      // si on la trouve on renvoi un status 200 et on converti la reponse avec .json
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      // si il y a une erreur on renvoi un status 404 avec le message d'erreur
      res.status(404).json({
        error: error
      });
    }
  );
};
