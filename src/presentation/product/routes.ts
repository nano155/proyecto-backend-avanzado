import { Request, Router } from "express";
import { ProductReposotoryImpl } from "../../service/repository";
import { ProductService } from "../../service/dao/mongo";
import { ProductController } from "./controller";
import { AuthRequired } from "../../middleware/auth-required";

export class ProductRoutes{

    static get routes(){
        const router = Router()

        const productService = new ProductService()
        const productRepository = new ProductReposotoryImpl(productService)
        const productController = new ProductController(productRepository)

        

        router.get('/', productController.getProducts)
        router.post('/',[AuthRequired.authRequired], productController.createProduct)
        router.post('/upload/:id',[AuthRequired.uploadCloudinary('products')], productController.uploadImages)
        router.post('/uploads/:id', [AuthRequired.uploadCloudinaryMultiple('products')], productController.uploadImages)
        router.get('/:id', productController.getProductById)
        router.put('/:id',[AuthRequired.authRequired], productController.updateProductById)
        router.delete('/:id',[AuthRequired.authRequired], productController.deleteProductById)
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