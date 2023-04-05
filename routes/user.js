// Import d'Express
const express = require("express")

// Déclaration de la route utilisateur
const router = express.Router();

// Import des controlleurs utilisateur
const userController = require("../controllers/user");

//Route pour s'inscrire
router.post("/signup", userController.signup);

//Route pour se connecter
router.post("/login", userController.login);

// Export de la route
module.exports = router;