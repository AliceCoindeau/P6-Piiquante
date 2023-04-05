// on importe express
const express = require('express');


// on importe le controller sauce

// Déclaration des routes
const router = express.Router();
//controlleur pour associer les fonctions aux différentes routes

// Import du middleware d'authentification
const auth = require("../middleware/auth"); // middleware qui permet d'authentifier les pages de l'application

// Import du middleware de gestion de fichiers entrants
const multer = require("../middleware/multer-config"); // middleware qui définit la destination et le nom de fichier des images

// Import du middleware de gestion de fichiers entrants
const sauceController = require("../controllers/sauce"); 


// Ajout des controllers aux routes (incluant le middleware d'authentification et la gestion de fichiers)

// Route pour ajouter une nouvelle sauce
router.post('/', auth, multer, sauceController.createSauce);

// Route pour récupérer une sauce de l'api
router.get('/:id', auth, sauceController.getOneSauce);

// Route pour récupérer toutes les sauces de l'api
router.get("/", auth, sauceController.getAllSauces);

// Route pour mettre à jour une sauce depuis l'api
router.put("/:id", auth, multer, sauceController.modifySauce);

// Route pour supprimer une sauce de l'api
router.delete("/:id", auth, sauceController.deleteSauce);

// Route pour ajouter un like/dislike à la sauce
router.post("/:id/like", auth, sauceController.likeDislikeSauce);

// Export et exploitation des routes
module.exports = router;