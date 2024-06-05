import { Router } from "express";
import { ProductRepository } from '../../domain/repository/product.repository';
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
        router.get('/:id', productController.getProductById)
        router.put('/:id',[AuthRequired.authRequired], productController.updateProductById)
        router.delete('/:id',[AuthRequired.authRequired], productController.deleteProductById)


        return router
    }
}