const multer = require('multer');
const sharp = require('sharp');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const AVATAR_SIZE = 200;

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const processAvatar = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const resized = await sharp(req.file.buffer)
            .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toBuffer();

        const url = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'avatars',
                    public_id: `avatar_${req.user.userId}`,
                    overwrite: true,
                    resource_type: 'image',
                },
                (error, result) => (error ? reject(error) : resolve(result.secure_url))
            );
            stream.end(resized);
        });

        req.file.savedPath = url;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { upload, processAvatar };
