const mongoose = require('mongoose');
// permet d'avoir une adresse mail seulement utilisable pour un utilisateur
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : { type: 'string', required: true, unique: true },
    password : { type: 'string', required: true}
});

userSchema.plugin(uniqueValidator);

// exporte le schema
module.exports = mongoose.model('User',userSchema);