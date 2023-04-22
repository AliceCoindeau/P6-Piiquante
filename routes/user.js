// Import d'Express
const express = require("express")

// on importe le middleware password
//const password = require("../middleware/password");
// Déclaration de la route utilisateur
const router = express.Router();
const limitRate = require("../middleware/rateLimiter");

// Import des controlleurs utilisateur
const userController = require("../controllers/user");

//Route pour s'inscrire
router.post("/signup", userController.signup);

//Route pour se connecter
router.post("/login", limitRate.loginRateLimiter, userController.login);

// Export de la route
module.exports = router;