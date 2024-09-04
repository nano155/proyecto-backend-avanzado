"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterAdapter = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary-config");
class MulterAdapter {
}
exports.MulterAdapter = MulterAdapter;
_a = MulterAdapter;
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
MulterAdapter.storageCloudinary = (folder) => {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_config_1.cloudinary,
        params: async (req, file) => {
            return {
                folder: folder,
                resource_type: 'auto'
            };
        }
    });
    return storage;
};
MulterAdapter.uploader = (folder) => {
    const storage = _a.storageCloudinary(folder);
    const uploader = (0, multer_1.default)({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // Opcional: Limitar tamaño de archivo a 5MB
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Tipo de archivo no permitido'), false);
            }
        },
    });
    return uploader;
};
MulterAdapter.delete = async (publicId) => {
    try {
        if (typeof publicId === "string") {
            const result = await cloudinary_config_1.cloudinary.uploader.destroy(publicId);
            console.log(result);
        }
        else {
            const results = await Promise.all(publicId.map((id) => cloudinary_config_1.cloudinary.uploader.destroy(id)));
            console.log(results);
        }
    }
    catch (error) {
        console.error("Error al eliminar el archivo:", error);
        throw error;
    }
};
MulterAdapter.update = () => { };
