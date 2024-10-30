const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
