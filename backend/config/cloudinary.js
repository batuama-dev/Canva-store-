const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = 'canva-store';

    // For PDF files, explicitly set the format to 'pdf'
    if (file.fieldname === 'pdfFile') {
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const public_id = `${originalName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
      
      return {
        folder: folder,
        resource_type: 'raw',
        public_id: public_id,
        format: 'pdf' // Explicitly set the format to ensure .pdf extension
      };
    }

    // For image files, generate a custom public_id and convert to jpg
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

