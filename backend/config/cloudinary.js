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

    // For PDF files, upload as a raw file and let Cloudinary generate the public_id
    // This ensures the file extension is correctly preserved.
    if (file.fieldname === 'pdfFile') {
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      return {
        folder: folder,
        resource_type: 'raw',
        public_id: originalName, // Use original name to preserve extension
        transformation: [{ flags: 'attachment' }] // Add attachment flag
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
