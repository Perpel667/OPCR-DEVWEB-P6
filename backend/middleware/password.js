// recupere le package password-validator
const passwordValidator = require('password-validator');

//création du schéma
const passwordSchema = new passwordValidator();
 
// Les propriétés que le mdp doit respecter
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// vérification du password via le schéma

module.exports = (req, res, next) => {
    // si le mdp est bon
    if(passwordSchema.validate(req.body.password)){
        next();
    }else{
        // si le mdp n'est pas bon renvoi les élements qui ne sont pas corrects
        res.status(400).json({error: "le mot de passe n'est pas assez fort :" + passwordSchema.validate('req.body.password',{ list : true})})
    }
}