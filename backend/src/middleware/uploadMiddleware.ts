import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 1. Fix typo in api_secret
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET 
});

// 2. Properly initialize CloudinaryStorage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Extract filename without extension safely
    const nameWithoutExt = path.parse(file.originalname).name;
    
    return {
      folder: 'PillowPick_accommodations',
      format: undefined, // Cloudinary will maintain the original or allowed format automatically
      public_id: `${nameWithoutExt}-${uniqueSuffix}`,
    };
  },
});

// 3. Reusable File Filter for Images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// 4. Export a single, clean upload middleware
export const uploadImage = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default uploadImage;