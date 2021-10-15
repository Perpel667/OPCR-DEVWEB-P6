// declare dans des variables les packages dont l'app a besoin
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// recupere la chaîne secrete dans le dotenv
const WEBTOKEN = process.env.JWT_SECRET;

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, WEBTOKEN);
        const userId = decodeToken.userId;
        // si l'userId de la requete est different du userId
        if (req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{
            // sinon on passe au prochain middleware
            next();
        }
    }catch(error){
        res.status(403).json({ error: "« 403: unauthorized request." | 'Requete non authentifiée !'});
    }
};