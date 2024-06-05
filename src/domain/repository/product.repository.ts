import { CreateProductDto, PaginationDto, UpdateProductDto } from "../dtos";
import { ProductEntity } from "../entity";
import { PaginatedData } from "../shared/pagination-interface";



export abstract class ProductRepository {
    abstract createProduct(productDto: CreateProductDto):Promise<ProductEntity>
    abstract getProducts(paginationDto:PaginationDto):Promise<{paginationData:PaginatedData}>
    abstract getProductById(id:string):Promise<ProductEntity>
    abstract updateProductById(id:string, updateProductDto:UpdateProductDto, uid:string):Promise<ProductEntity>
    abstract deleteProductById(id:string, uid:string):Promise<ProductEntity>
}