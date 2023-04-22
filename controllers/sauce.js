const Sauce = require('../models/Sauce'); // import du modèle Sauce
const fs = require('fs'); // file system, package qui permet de modifier et/ou supprimer des fichiers


// création, modification, suppression et récupération sauce
// on crée la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ // un nouvel objet sauce est crée avec le model Sauce
        ...sauceObject,
        userId: req.auth.userId,
        // l'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd      
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    });
    sauce.save() // la sauce est sauvegardée dans la bdd
    .then( () => res.status(201).json({ message: 'Sauce sauvegardée'}))
    .catch( error => res.status(400).json({ error }))
    console.log(sauce);
};

// Controlleur de la route PUT
exports.modifySauce = (req, res, next) => {
    // l'id de la sauce est l'id inscrit dans l'url
    Sauce.findOne({ _id: req.params.id })
      // si la sauce existe
      .then((sauce) => {
         const immuable = {
          userId: req.auth.userId,
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        };
        // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
        if (sauce.userId !== req.auth.userId) {
          // reponse en status 403 Forbidden avec message json
          return res.status(403).json("requête non authorisée!");
          // si il y a un fichier avec la demande de modification
        } else if (req.file) {
          // on vérifie que c'est bien une image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
          if (
            req.file.mimetype === "image/jpeg" ||
            req.file.mimetype === "image/png" ||
            req.file.mimetype === "image/jpg" ||
            req.file.mimetype === "image/bmp" ||
            req.file.mimetype === "image/gif" ||
            req.file.mimetype === "image/ico" ||
            req.file.mimetype === "image/svg" ||
            req.file.mimetype === "image/tiff" ||
            req.file.mimetype === "image/tif" ||
            req.file.mimetype === "image/webp"
          ) {
            // on détermine le nom de l'ancien fichier image
            const filename = sauce.imageUrl.split("/images/")[1];
            // si ceci correspond à une partie du nom de l'image par defaut
            const testImage = 'defaut/imagedefaut.png';
            // si le nom de l'image ne correspont pas à l'image defaut
            if(testImage != filename){
            // on efface le fichier image qui doit se faire remplacer
            fs.unlink(`images/${filename}`, () => {});
            }
            // on extrait le sauce de la requete via le parse
            // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
            const sauceObject = {
              ...JSON.parse(req.body.sauce),
              // on ajoute l'image avec ce nom
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
              ...immuable,
            };
             // si le fichier n'est pas une image
          } else {
            // on détermine le nom de l'ancien fichier image
            const filename = sauce.imageUrl.split("/images/")[1];
            // si ceci correspond à une partie du nom de l'image par defaut
            const testImage = 'defaut/imagedefaut.png';
            // si le nom de l'image ne correspont pas à l'image defaut
            if(testImage != filename){
            // on efface le fichier image qui doit se faire remplacer
            fs.unlink(`images/${filename}`, () => {});
            }
            // on récupère avec le parse req.body.sauce et on y ajoute la nouvelle image
            // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
            const sauceObject = {
              ...JSON.parse(req.body.sauce),
              // l'image sera l'image par defaut
              imageUrl: `${req.protocol}://${req.get(
                "host"
              )}/images/defaut/imagedefaut.png`,
              ...immuable,
            };
                     }
          // si il n'y a pas de fichier avec la modification (ps: il garde son image injectée à la création)
        } else {
          // puisqu'il n'y a pas de fichier image, l'imageUrl de la requete sera par defaut l'ancienne imageUrl même si on modifie l'entrée avec postman
          req.body.imageUrl = sauce.imageUrl;
          // la sauce sera la requete
          const sauceObject = {
            ...req.body,
            ...immuable,
          };
                }
         // modifie un sauce dans la base de donnée, 1er argument c'est l'objet qu'on modifie avec id correspondant à l'id de la requete
        // et le deuxième argument c'est la nouvelle version de l'objet qui contient le sauce qui est dans le corp de la requete et que _id correspond à celui des paramètres
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceBot, _id: req.params.id }
        )
          // retourne une promesse avec status 201 Created et message en json
          .then(() =>
            res
              .status(201)
              .json({ message: "modified sauce (FR)Objet modifié !" })
          )
          // en cas d'erreur un status 400 Bad Request et l'erreur en json
          .catch((error) => res.status(400).json({ error }));
      })
      // en cas d'erreur
      .catch((error) => {
        // si il y a un fichier avec la requete
        if (req.file) {
          // le fichier de la requete a été créé avec multer donc on l'éfface
          fs.unlink(`images/${req.file.filename}`, () => {});
        }
        // erreur 404 Not Found indique l'erreur en json
        res.status(404).json({ error });
      });
  };
// Controlleur de la route DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // on identifie la sauce
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image
    fs.unlink(`images/${filename}`, () => { /// on la supprime du serveur
    Sauce.deleteOne({_id: req.params.id}) // on supprime la sauce de la bdd
    .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

// Controlleur de la route GET (récupération de toutes les sauces)
exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};


// Controlleur de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {  
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};


// Contrôleur de la fonction like des sauces
exports.likeDislikeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // bouton j'aime
        Sauce.updateOne(
            {_id: req.params.id}, 
            { 
                $inc: { likes: 1}, 
                $push: { usersLiked: req.body.userId}, _id: req.params.id 
            }
        )
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else if(like === -1) { // bouton je n'aime pas
        Sauce.updateOne(
            {_id: req.params.id}, 
            { 
                $inc: { dislikes: 1}, 
                $push: { usersDisliked: req.body.userId}, _id: req.params.id 
            }
        )
        .then( () => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else {    // annulation du bouton j'aime ou alors je n'aime pas
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne(
                    {_id: req.params.id}, 
                    { 
                        $inc: { likes: -1},
                        $pull: { usersLiked: req.body.userId}, _id: req.params.id 
                    }
                )
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( 
                    {_id: req.params.id}, 
                    { 
                        $inc: { dislikes: -1 }, 
                        $pull: { usersDisliked: req.body.userId}, _id: req.params.id
                    }
                )
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};
