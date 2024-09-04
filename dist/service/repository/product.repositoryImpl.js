"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReposotoryImpl = void 0;
class ProductReposotoryImpl {
    constructor(productService) {
        this.productService = productService;
    }
    uploadImages(id, image) {
        return this.productService.uploadImages(id, image);
    }
    createProduct(productDto) {
        return this.productService.createProduct(productDto);
    }
    getProducts(paginationDto) {
        return this.productService.getProducts(paginationDto);
    }
    getProductById(id) {
        return this.productService.getProductById(id);
    }
    updateProductById(id, updateProductDto, uid) {
        return this.productService.updateProductById(id, updateProductDto, uid);
    }
    deleteProductById(id, uid) {
        return this.productService.deleteProductById(id, uid);
    }
}
exports.ProductReposotoryImpl = ProductReposotoryImpl;
