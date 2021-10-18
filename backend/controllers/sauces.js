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
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
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

// middleware modification d'une sauce
exports.modifySauce = (req, res, next) => {
  // création d'un objet qui regarde si req.file existe 
  const sauceObject = req.file ?
    {
      // si il existe on recuperer avec parse et on genere l'imageUrl
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // si il n'existe pas on envoi tout le body de la requete
    } : { ...req.body };
    // on met la sauce a jour avec comme argument on met l'id envoyer par les parametre de requetes et le 2eme argument c'est le nouvel objet et on recupere l'id pour avoir les memes
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//middleware supression d'une sauce
exports.deleteSauce = (req, res, next) => {
  // on viens recuperer la sauce avec son id
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // on recupere le 2eme element du tableau retourner par split donc le nom de fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // on utilise unlink du package filesystem pour supprimer un fichier avec le chemin (images/${filename})
      fs.unlink(`images/${filename}`, () => {
        // et en callback on met la supression de l'image dans la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// midleware likes et dislikes
exports.likesDislikes = (req, res, next) => {
  // si le like dans la requete est = a 1 //
  if (req.body.like === 1) {
    // alors on update la sauce en incrementant le nombre dans la base de données et on pousse dans le tableau l'userId //
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Sauce Likée 👍🏽 !' }))
          .catch(error => res.status(400).json({ error }))
  // ou si le like dans la requete est = a -1 //
  } else if (req.body.like === -1) {
// alors on update la sauce en decrementant le nombre dans la base de données et on pousse dans le tableau usersDisliked l'userId
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Sauce Dislikée 👎🏽 !' }))
          .catch(error => res.status(400).json({ error }))
  } else {
    //  sinon ( donc si like = 0 ) on viens chercher les données de la sauce avec son id //
      Sauce.findOne({ _id: req.params.id })
      // qui nous donne reponse de promesse sauce //
          .then(sauce => {
            // si dans la le tableau des usersLiked on y trouve l'userId alors //
              if (sauce.usersLiked.includes(req.body.userId)) {
                // on viens retirer du tableau l'user id et decrementer de 1 les likes //
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
                      // ou si dans le tableau userDisliked on trouve l'userId alors //
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                // on viens retirer l'userID du tableau userDisliked et on viens decrementer de 1 les dislikes //
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}