"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequired = void 0;
const config_1 = require("../config");
const multer_adapter_1 = require("../config/multer-adapter");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage(); // Usamos memoryStorage para propósitos de prueba
const upload = (0, multer_1.default)({ storage });
class AuthRequired {
}
exports.AuthRequired = AuthRequired;
_a = AuthRequired;
AuthRequired.authRequired = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            return res
                .status(401)
                .json({ message: "No token, autorization denied!" });
        const validToken = await config_1.JwtAdapter.validateToken(token);
        if (!validToken) {
            return res
                .status(401)
                .json({ message: "Invalid Token, autorization denied!" });
        }
        req.user = validToken;
        next();
    }
    catch (error) {
        return res.status(500).send("Internal server error!");
    }
};
AuthRequired.mongoIdValidate = (req, res, next) => {
    try {
        const validateId = config_1.Validators.validatorMongoId(req.params.id);
        if (!validateId)
            return res.status(400).send("Id not valid!");
        next();
    }
    catch (error) {
        return res.status(500).send("Internal server error!");
    }
};
AuthRequired.uploadCloudinary = (folder) => (req, res, next) => {
    const upload = multer_adapter_1.MulterAdapter.uploader(folder).single('thumbnails');
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ status: 'error', message: 'El tamaño del archivo excede el límite permitido' });
            }
            return res.status(400).json({ status: 'error', message: err.message });
        }
        else if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        next();
    });
};
AuthRequired.uploadCloudinaryMultiple = (folder) => (req, res, next) => {
    const upload = multer_adapter_1.MulterAdapter.uploader(folder).array('thumbnails', 10); // Hasta 10 archivos
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ status: 'error', message: 'El tamaño del archivo excede el límite permitido' });
            }
            return res.status(400).json({ status: 'error', message: err.message });
        }
        else if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        next();
    });
};
