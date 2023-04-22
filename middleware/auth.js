// Import du package de création de token
const jwt = require('jsonwebtoken');

// Dans ce middleware qui permet de vérifier le token de l'utilisateur:
//Étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch.
module.exports= (req, res, next) => {
    try {
        // extraction du token du header Authorization de la requête entrante. Utilisation de la fonction split pour
        // tout récupérer après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch.
        const token = req.headers.authorization.split(' ')[1];
        //Vérifier la validité du token en utilisant la clé secrète partagée entre le serveur et le client
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        //extraction du user ID de notre token et ajout à l’objet Request afin que nos différentes routes 
        //puissent l’exploiter.
        const userId = decodedToken.userId;
       req.auth = {
         userId : userId
       };
        // Pour vérifier si l'utilisateur est le même que celui qui envoyé la requête
        if (req.body.userId && req.body.userId !== userId) {
         throw 'Invalid user ID';
        } else {
          next();
        }
    } catch(error) {
        res.status(401).json({error : "user not recognized"});
    }
}