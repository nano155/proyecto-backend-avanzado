import { PaginationDto, UpdateProductDto } from "../../domain/dtos";
import { ProductEntity } from "../../domain/entity";
import { ProductRepository } from "../../domain/repository";
import { PaginatedData } from "../../domain/shared/pagination-interface";
import { ProductService } from "../dao/mongo";



export class ProductReposotoryImpl implements ProductRepository{

    constructor(
        public readonly productService:ProductService
    ){}
    getProducts(paginationDto: PaginationDto): Promise<{ productEntity: ProductEntity[]; paginationData: PaginatedData; }> {
        return this.productService.getProducts(paginationDto)
    }
    getProductById(id: string): Promise<ProductEntity> {
        return this.productService.getProductById(id)
    }
    updateProductById(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
        return this.productService.updateProductById(id, updateProductDto)
    }
    deleteProductById(id: string): Promise<ProductEntity> {
        return this.deleteProductById(id)
    }

}