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
    // Common logic for public_id
    const originalName = file.originalname.split('.').slice(0, -1).join('.');
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
    const public_id = `${sanitizedName}_${Date.now()}`;
    const folder = 'canva-store';

    // For PDF files, upload as a raw file without format conversion
    if (file.fieldname === 'pdfFile') {
      return {
        folder: folder,
        public_id: public_id,
        resource_type: 'raw',
        // By not specifying `format`, we preserve the original format (pdf)
      };
    }

    // For image files, process them as images and convert to jpg
    return {
      folder: folder,
      public_id: public_id,
      format: 'jpg',
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
