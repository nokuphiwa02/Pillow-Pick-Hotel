import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Explicitly import Multer types to fix namespace merging issues
import 'multer'; 

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

// Use Express.Multer.File, but ensure 'multer' is imported above. 
// Alternatively, if it still complains, change `file: Express.Multer.File` to `file: any` or import `File` from multer.
const fileFilter = (req: Request, file: any, cb: any) => {
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