import { PaginationDto, UpdateProductDto } from "../dtos";
import { ProductEntity } from "../entity";
import { PaginatedData } from "../shared/pagination-interface";



export abstract class ProductDatasource {
    abstract getProducts(paginationDto:PaginationDto):Promise<{productEntity:ProductEntity[]; paginationData:PaginatedData}>
    abstract getProductById(id:string):Promise<ProductEntity>
    abstract updateProductById(id:string, updateProductDto:UpdateProductDto):Promise<ProductEntity>
    abstract deleteProductById(id:string):Promise<ProductEntity>
}