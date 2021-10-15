// creer la constante express qui a besoin du package express
const express = require('express');

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

// exporte le module app.js
module.exports = app;