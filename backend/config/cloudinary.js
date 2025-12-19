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
  params: {
    folder: 'canva-store',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => {
      // Remove file extension from the original name
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      // Sanitize the name and append a timestamp
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
      return `${sanitizedName}_${Date.now()}`;
    },
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
