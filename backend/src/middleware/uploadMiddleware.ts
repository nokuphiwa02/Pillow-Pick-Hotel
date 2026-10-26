import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET 
});


const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const nameWithoutExt = path.parse(file.originalname).name;
    
    return {
      folder: 'PillowPick_accommodations',
      format: undefined, 
      public_id: `${nameWithoutExt}-${uniqueSuffix}`,
    };
  },
});


const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

export const uploadImage = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 
  }
});

export default uploadImage;