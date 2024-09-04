"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const repository_1 = require("../../service/repository");
const mongo_1 = require("../../service/dao/mongo");
const controller_1 = require("./controller");
const auth_required_1 = require("../../middleware/auth-required");
class ProductRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const productService = new mongo_1.ProductService();
        const productRepository = new repository_1.ProductReposotoryImpl(productService);
        const productController = new controller_1.ProductController(productRepository);
        router.get('/', productController.getProducts);
        router.post('/', [auth_required_1.AuthRequired.authRequired], productController.createProduct);
        router.post('/upload/:id', [auth_required_1.AuthRequired.uploadCloudinary('products')], productController.uploadImages);
        router.post('/uploads/:id', [auth_required_1.AuthRequired.uploadCloudinaryMultiple('products')], productController.uploadImages);
        router.get('/:id', productController.getProductById);
        router.put('/:id', [auth_required_1.AuthRequired.authRequired], productController.updateProductById);
        router.delete('/:id', [auth_required_1.AuthRequired.authRequired], productController.deleteProductById);
        // router.post('/upload', AuthRequired.uploadCloudinary, async (req, res) => {
        //     try { 
        //         if (!req.file) {
        //             return res.status(400).json({ status: 'error', message: 'No se adjuntó ningún archivo' });
        //         }
        //         console.log(req.file);
        //         return res.json({ status: 'ok', message: 'Archivo subido exitosamente', url: req.file.path });
        //     } catch (error) {
        //         console.error(error);
        //         return res.status(500).json({ message: 'Error interno del servidor' });
        //     }
        // });
        // router.post('/uploads', AuthRequired.uploadCloudinaryMultiple, async (req, res) => {
        //     try {
        //       if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        //         return res.status(400).json({ status: 'error', message: 'No se adjuntaron archivos' });
        //       }
        //       console.log(req.files);
        //       const urls = (req.files as Express.Multer.File[]).map(file => file.path);
        //       return res.json({ status: 'ok', message: 'Archivos subidos exitosamente', urls });
        //     } catch (error) {
        //       console.error(error);
        //       return res.status(500).json({ message: 'Error interno del servidor' });
        //     }
        //   });
        return router;
    }
}
exports.ProductRoutes = ProductRoutes;
