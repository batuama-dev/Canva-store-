const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = 'canva-store';

    // Pour les fichiers PDF, les traiter comme 'image' pour activer les transformations (ex: fl_attachment)
    if (file.fieldname === 'pdfFile') {
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
      const public_id = `${sanitizedName}_${Date.now()}`;
      
      return {
        folder: folder,
        public_id: public_id,
        resource_type: 'image', // Traiter comme une 'image' pour permettre les transformations d'URL
      };
    }

    // Pour les fichiers image, générer un public_id personnalisé et convertir en jpg
    const originalName = file.originalname.split('.').slice(0, -1).join('.');
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
    const public_id = `${sanitizedName}_${Date.now()}`;

    return {
      folder: folder,
      public_id: public_id,
      format: 'jpg',
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
