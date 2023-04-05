// Package pour gérer les fichiers téléchargé par les utilisateurs
const multer = require("multer"); 

// Types de fichier pour les photos téléchargés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png"
};

// Enregistrement de la photo sur notre disk
const storage = multer.diskStorage({
// destination des fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
// Création du nom du fichier avec le type et la date/heure
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Enlève l'espace des fichiers pour mettre un '_' à la place
    const extension = MIME_TYPES[file.mimetype]; // Génération du type du fichier
    callback(null, name + Date.now() + "." + extension); // resultat = name_dateHour.extension
  },
});

module.exports = multer({storage: storage}).single("image");