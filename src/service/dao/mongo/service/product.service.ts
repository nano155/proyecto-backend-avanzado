import { ProductDatasource } from "../../../../domain/datasource";
import { PaginationDto, UpdateProductDto } from "../../../../domain/dtos";
import { ProductEntity } from "../../../../domain/entity";
import { PaginatedData } from "../../../../domain/shared/pagination-interface";


export class ProductService implements ProductDatasource{
    getProducts(paginationDto: PaginationDto): Promise<{ productEntity: ProductEntity[]; paginationData: PaginatedData; }> {
        throw new Error("Method not implemented.");
    }
    getProductById(id: string): Promise<ProductEntity> {
        throw new Error("Method not implemented.");
    }
    updateProductById(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
        throw new Error("Method not implemented.");
    }
    deleteProductById(id: string): Promise<ProductEntity> {
        throw new Error("Method not implemented.");
    }
}