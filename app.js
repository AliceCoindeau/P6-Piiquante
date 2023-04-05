// Récupération des extensions
const express = require("express"); // import Framework JS
const bodyParser = require("body-parser"); // Import du package body-parser (parse automatiquement les requêtes en JSON)
// Pour mettre en place le chemin d'accès à un fichier téléchargé par l'utilisateur
const path = require('path');
// importation mongoose 
const mongoose = require('mongoose');
const cors  = require("cors") // cors
require("dotenv").config();

// Déclaration des routes pour les sauces et les utilisateurs
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

  
//connexion à la BD
mongoose.connect('mongodb+srv://alicepegie:Co010680@piiquantepegie.8u9blfd.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


 //cors

  var app = express();
 app.use(cors())
 
 /* app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });*/


  app.use(express.json());
  
  // Middleware de téléchargement de fichiers (images des sauces)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes pour accéder aux sauces et aux utilisateurs
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);



module.exports = app; // Exportation de l'application créée