// declare dans des variables les packages nécéssaires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// recupere la chaîne secrete dans le dotenv
const WEBTOKEN = SECRET_TOKEN;

// importe dans une variable User le schema mongoose du même nom
const User = require('../models/User');

//////////////////
// Middlewares //
////////////////

// middleware inscription utilisateur

exports.signup = (req, res, next) => {
    // fonction pour crypter mdp et en parametre on passe le mdp du corp de la requete et on le sale 10*
bcrypt.hash(req.body.password,10)
// on recupere le mdp hashé qu'on enregistre dans un nouveau User (grace au modele mongoose) ainsi que l'adresse email
.then(hash => {
    const user = new User ({
        email : req.body.email,
        password : hash
    });
    // on enregistre l'utilisateur creer dans la base de données mongodb
    user.save()
    // status 201 si l'utilisateur est créer
    .then(() => res.status(201).json({message: 'Utilisateur crée !'}))
    // status 400 si il y a une erreur + message d'erreur
    .catch(error => res.status(400).json({error}));
})
// erreur serveur + on envoi l'erreur dans un objet
.catch(error => res.status(500).json({error}))
};

// middleware connexion utilisateur

exports.login = (req, res, next) => {
    // on viens trouver l'utilisateur dans la base de données
    User.findOne({ email: req.body.email })
      .then(user => {
          // si il n'existe pas erreur 401 non autorisé
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // on compare avec bcrypt le mdp rentré par l'utilisateur et celui qui est enregistrer dans la base de données
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
              // si pas le bon mdp erreur 401 non autorisé
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            /* si mdp est bon status 200  + un objet JSON avec l'userID + le token. 
            le token creer avec la fonction de jwt qui a comme parametre l'userId + la clé secrete + l'expiration*/
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                WEBTOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          // si il y a un probleme serveur status 500
          .catch(error => res.status(500).json({ error }));
      })
      // si il y a un probleme serveur status 500
      .catch(error => res.status(500).json({ error }));
  };

