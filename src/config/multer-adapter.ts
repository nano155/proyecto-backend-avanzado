import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import { cloudinary } from './cloudinary-config';

export class MulterAdapter {
    
    // private static createStorage = () => {
    //     const storage = multer.diskStorage({
    //         destination(req, file, cb) {
    //             const uploadPath = path.resolve(__dirname, '../public/img');
    //             cb(null, uploadPath);
    //         },
    //         filename(req, file, cb) {
    //             cb(null, `${Date.now()}-${file.originalname}`);
    //         },
    //     });

    //     return storage;
    // }

    // static uploader = () => {
    //     const storage = MulterAdapter.createStorage();
    //     const uploader = multer({
    //         storage,
    //         limits: { fileSize: 5 * 1024 * 1024 }, // Opcional: Limitar tamaño de archivo a 5MB
    //         fileFilter: (req, file, cb) => {
    //             const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    //             if (allowedMimeTypes.includes(file.mimetype)) {
    //                 cb(null, true);
    //             } else {
    //                 cb(new Error('Tipo de archivo no permitido') as unknown as null, false);
    //             }
    //         },
    //     });

    //     return uploader;
    // }

    private static storageCloudinary = () => {
        const storage = new CloudinaryStorage({
          cloudinary: cloudinary,
          params: async (req: Request, file: Express.Multer.File): Promise<any> => {
            return {
              folder: 'uploads',
              resource_type: 'auto' 
            };
          }
        });
    
        return storage;
      }
    
      static uploader = () => {
        const storage = MulterAdapter.storageCloudinary();
        const uploader = multer({
          storage,
          limits: { fileSize: 5 * 1024 * 1024 }, // Opcional: Limitar tamaño de archivo a 5MB
          fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedMimeTypes.includes(file.mimetype)) {
              cb(null, true);
            } else {
              cb(new Error('Tipo de archivo no permitido') as unknown as null, false);
            }
          },
        });
    
        return uploader;
      }
}