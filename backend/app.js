// declare dans des variables les packages dont l'app a besoin
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
// recupere les routes users
const usersRoutes = require('./routes/users');
// recupere les routes sauces
 const saucesRoutes = require('./routes/sauces');


dotenv.config();

const app = express();

app.use(helmet());
// recuperation de l'URI de connexion a mongoDB depuis le dotenv
const url = process.env.MONGOLAB_URI;

// connexion a mongoDB
mongoose.connect(url,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// definition des headers
app.use((req, res, next) => {
    // nous permet d'acceder a l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // nous permet d'ajouter les headers mentionnés aux requetes envoyés a l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // nous permet d'envoyer des requetes avec les methodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // transforme le corp de la requete en JSON
  app.use(express.json());
  // utilisation du path pour pouvoir recuperer les images
  app.use('/images', express.static(path.join(__dirname, 'images')));
  // importe usersRoutes et appliquer a la route définie (/api/auth/)
  app.use('/api/auth/', usersRoutes);
  //importe saucesRoutes et applique a la route définie (/api/sauces)
  app.use('/api/sauces',saucesRoutes);

// exporte le module app.js
module.exports = app;