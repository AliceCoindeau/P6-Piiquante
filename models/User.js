// création d'un schéma de données qui contient les champs souhaités pour chaque user
// + export de ce schéma en tant que modèle Mongoose le rendant disponible pour notre application Express.

const mongoose = require("mongoose");

// connexion email unique
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email : {type: String, required : true, unique : true},
    password : {type: String, required : true}
  });

  
// Création du modèle (Méthode pour avoir un seul mail par utilisateur)
userSchema.plugin(uniqueValidator);

// Export et exploitation du modèle
module.exports = mongoose.model("User", userSchema);