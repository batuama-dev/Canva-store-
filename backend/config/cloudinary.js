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

    // For PDF files, just ensure they are uploaded as raw resources.
    // Cloudinary will generate a random public_id, and we will handle the filename on download.
    // This avoids the 401 Unauthorized error.
    if (file.fieldname === 'pdfFile') {
      return {
        folder: folder,
        resource_type: 'raw',
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


