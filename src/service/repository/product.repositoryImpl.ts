import { CreateProductDto, PaginationDto, UpdateProductDto } from "../../domain/dtos";
import { ProductEntity } from "../../domain/entity";
import { ProductRepository } from "../../domain/repository";
import { PaginatedData } from "../../domain/shared/pagination-interface";
import { ProductService } from "../dao/mongo";



export class ProductReposotoryImpl implements ProductRepository{

    constructor(
        public readonly productService:ProductService
    ){}
    createProduct(productDto: CreateProductDto): Promise<ProductEntity> {
        return this.productService.createProduct(productDto)
    }
    getProducts(paginationDto:PaginationDto):Promise<{paginationData:PaginatedData}> {
        return this.productService.getProducts(paginationDto)
    }
    getProductById(id: string): Promise<ProductEntity> {
        return this.productService.getProductById(id)
    }
    updateProductById(id: string, updateProductDto: UpdateProductDto, uid:string): Promise<ProductEntity> {
        return this.productService.updateProductById(id, updateProductDto, uid)
    }
    deleteProductById(id: string, uid:string): Promise<ProductEntity> {
        return this.productService.deleteProductById(id, uid)
    }

}