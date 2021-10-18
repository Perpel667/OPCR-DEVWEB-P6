// recupere le package multer
const multer = require('multer');

// dictionnaire de mimetypes qui comprend les 3 differents mimetypes accepter par le frontend
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      // null pour pas d'erreur et le deuxieme parametre c'est le nom du dossier
    callback(null, 'images');
  },
  // quel nom de fichier a utiliser
  filename: (req, file, callback) => {
      // on utilise le nom d'origine du fichier et on supprime les espaces et on les remplaces par des underscore
    const name = file.originalname.split(' ').join('_');
    // creation l'extension de notre fichier
    const extension = MIME_TYPES[file.mimetype];
    // on apelle le callback avec null pour pas d'erreur + le name + une date (timestamp) + un point + l'extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// on exporte notre middleware
module.exports = multer({storage: storage}).single('image');