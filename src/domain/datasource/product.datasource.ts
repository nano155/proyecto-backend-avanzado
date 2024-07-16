import { CreateProductDto, PaginationDto, UpdateProductDto } from "../dtos";
import { ProductEntity } from "../entity";
import { PaginatedData } from "../shared/pagination-interface";



export abstract class ProductDatasource {
    abstract createProduct(productDto: CreateProductDto):Promise<ProductEntity>
    abstract uploadImages(id:string, image:string[]):Promise<ProductEntity>
    abstract getProducts(paginationDto:PaginationDto):Promise<{paginationData:PaginatedData}>
    abstract getProductById(id:string):Promise<ProductEntity>
    abstract updateProductById(id:string, updateProductDto:UpdateProductDto, uid:string):Promise<ProductEntity>
    abstract deleteProductById(id:string, uid:string):Promise<ProductEntity>
}