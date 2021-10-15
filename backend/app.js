// declare dans des variables les modules dont l'app a besoin
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

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
  app.use(bodyParser.json());

// exporte le module app.js
module.exports = app;