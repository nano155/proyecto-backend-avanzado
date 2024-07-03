import { Router } from "express";
import { ProductReposotoryImpl } from "../../service/repository";
import { ProductService } from "../../service/dao/mongo";
import { ProductController } from "./controller";
import { AuthRequired } from "../../middleware/auth-required";
import { MulterAdapter } from "../../config/multer-adapter";
import { cloudinary } from "../../config/cloudinary-config";
import { UploadApiResponse } from "cloudinary";


export class ProductRoutes{

    static get routes(){
        const router = Router()

        const upload = MulterAdapter.uploader();
        const productService = new ProductService()
        const productRepository = new ProductReposotoryImpl(productService)
        const productController = new ProductController(productRepository)


        router.get('/', productController.getProducts)
        router.post('/',[AuthRequired.authRequired], productController.createProduct)
        router.get('/:id', productController.getProductById)
        router.put('/:id',[AuthRequired.authRequired], productController.updateProductById)
        router.delete('/:id',[AuthRequired.authRequired], productController.deleteProductById)
        router.post('/upload', AuthRequired.uploadCloudinary, async (req, res) => {
            try { 
                if (!req.file) {
                    return res.status(400).json({ status: 'error', message: 'No se adjuntó ningún archivo' });
                }
                console.log(req.file);

                return res.json({ status: 'ok', message: 'Archivo subido exitosamente', url: req.file.path });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
        return router;
    }
}