"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const multer_adapter_1 = require("../../../../config/multer-adapter");
const entity_1 = require("../../../../domain/entity");
const custom_error_1 = require("../../../../domain/error/custom-error");
const models_1 = require("../models");
class ProductService {
    async uploadImages(id, image) {
        try {
            const product = await models_1.productModel.findById(id);
            if (!product)
                throw custom_error_1.CustomError.notFound("product doesn't exist!");
            product.thumbnails = product.thumbnails.concat(image);
            const productUpdate = await product.save();
            return entity_1.ProductEntity.fromObject(productUpdate);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal Server ${error}`);
        }
    }
    async createProduct(productDto) {
        const ProductsExist = await models_1.productModel.findOne({
            title: productDto.title,
        });
        if (ProductsExist)
            throw custom_error_1.CustomError.badRequest("Product already exist");
        const codeExist = await models_1.productModel.findOne({ code: productDto.code });
        if (codeExist)
            throw custom_error_1.CustomError.badRequest("code already exist");
        try {
            const newProduct = new models_1.productModel(productDto);
            const productSaved = await newProduct.save();
            return entity_1.ProductEntity.fromObject(productSaved);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
    async getProducts(paginationDto) {
        const { limit, page, sort } = paginationDto;
        if (limit <= 0 || page <= 0) {
            throw custom_error_1.CustomError.badRequest("Limit and page must be greater than zero");
        }
        let query = models_1.productModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit);
        if (sort === "asc" || sort === "desc") {
            query = query.sort({ price: sort === "asc" ? 1 : -1 });
        }
        try {
            const [total, products] = await Promise.all([
                models_1.productModel.countDocuments(),
                query.exec(),
            ]);
            const totalPages = Math.ceil(total / limit);
            const prev = page - 1 > 0 && page - 1 <= totalPages
                ? `/api/products?page=${page - 1}&limit=${limit}`
                : null;
            const next = page + 1 > totalPages
                ? null
                : `/api/products?page=${page + 1}&limit=${limit}`;
            const productEntities = products.map((product) => entity_1.ProductEntity.fromObject(product));
            return {
                paginationData: {
                    products: productEntities,
                    limit,
                    next,
                    page,
                    prev,
                    total,
                    totalPages,
                },
            };
        }
        catch (error) {
            throw custom_error_1.CustomError.badRequest(`Internal error: ${error}`);
        }
    }
    async getProductById(id) {
        try {
            const product = await models_1.productModel.findById(id);
            if (!product)
                throw custom_error_1.CustomError.notFound(`No se encontro ningun producto con el ID ${id}`);
            return entity_1.ProductEntity.fromObject(product);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
    async updateProductById(id, updateProductDto, uid) {
        try {
            // Encontrar el producto y el usuario que está intentando hacer la actualización
            const findProduct = await models_1.productModel.findById(id);
            if (!findProduct)
                throw custom_error_1.CustomError.badRequest("Product does not exist!!");
            const findUser = await models_1.userModel.findById(uid);
            if (!findUser)
                throw custom_error_1.CustomError.badRequest("User does not exist!!");
            const newUpdate = findProduct.thumbnails.filter(product => (!updateProductDto.deletedFile?.includes(product)));
            if (findUser.role === "premium") {
                if (findUser.id === findProduct.owner) {
                    const updateData = {
                        title: updateProductDto.titleUpdate,
                        description: updateProductDto.descriptionUpdate,
                        code: updateProductDto.codeUpdate,
                        price: updateProductDto.priceUpdate,
                        status: updateProductDto.statusUpdate,
                        stock: updateProductDto.stockUpdate,
                        category: updateProductDto.categoryUpdate,
                        thumbnails: newUpdate
                    };
                    // Actualizar el producto en la base de datos
                    const updateProduct = await models_1.productModel.findByIdAndUpdate(id, updateData, { new: true });
                    if (!updateProduct)
                        throw custom_error_1.CustomError.badRequest(`No se encontró ningún producto con el ID ${id}`);
                    // Eliminar los archivos que fueron eliminados
                    if (updateProductDto.deletedFile && updateProductDto.deletedFile.length > 0) {
                        await Promise.all(updateProductDto.deletedFile.map(async (img) => {
                            if (typeof img === 'string') {
                                const parts = img.split('/products/')[1];
                                const fileId = `products/${parts.split('.')[0]}`;
                                await multer_adapter_1.MulterAdapter.delete(fileId);
                            }
                        }));
                    }
                    return entity_1.ProductEntity.fromObject(updateProduct);
                }
                else {
                    throw custom_error_1.CustomError.unauthorized('Este usuario no puede actualizar este objeto, porque no fue creado por él!');
                }
            }
            // Actualizar el producto en la base de datos para usuarios no premium
            const updateProduct = await models_1.productModel.findByIdAndUpdate(id, {
                title: updateProductDto.titleUpdate,
                description: updateProductDto.descriptionUpdate,
                code: updateProductDto.codeUpdate,
                price: updateProductDto.priceUpdate,
                status: updateProductDto.statusUpdate,
                stock: updateProductDto.stockUpdate,
                category: updateProductDto.categoryUpdate,
                thumbnails: newUpdate
            }, { new: true });
            if (!updateProduct)
                throw custom_error_1.CustomError.badRequest(`No se encontró ningún producto con el ID ${id}`);
            // Eliminar los archivos que fueron eliminados
            if (updateProductDto.deletedFile && updateProductDto.deletedFile.length > 0) {
                await Promise.all(updateProductDto.deletedFile.map(async (img) => {
                    if (typeof img === 'string') {
                        const parts = img.split('/products/')[1];
                        const fileId = `products/${parts.split('.')[0]}`;
                        await multer_adapter_1.MulterAdapter.delete(fileId);
                    }
                }));
            }
            return entity_1.ProductEntity.fromObject(updateProduct);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
    async deleteProductById(id, uid) {
        try {
            const findProduct = await models_1.productModel.findById(id);
            if (!findProduct)
                throw custom_error_1.CustomError.badRequest("product dont exist!!");
            const findUser = await models_1.userModel.findById(uid);
            if (!findUser)
                throw custom_error_1.CustomError.badRequest("user dont exist!!");
            if (findUser.role === "premium") {
                if (findUser.id === findProduct.owner) {
                    const deletedProduct = await models_1.productModel.findByIdAndDelete(id);
                    if (!deletedProduct)
                        throw custom_error_1.CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);
                    if (deletedProduct.thumbnails.length > 0) {
                        deletedProduct.thumbnails.forEach(async (img) => {
                            if (typeof img === "string") {
                                const parts = img.split("/products/")[1];
                                const id = `products/${parts.split(".")[0]}`;
                                await multer_adapter_1.MulterAdapter.delete(id);
                            }
                        });
                    }
                    return entity_1.ProductEntity.fromObject(deletedProduct);
                }
                else {
                    throw custom_error_1.CustomError.unauthorized("Este usuario no puede borrar este objeto, porque no fue creado por el!");
                }
            }
            const deletedProduct = await models_1.productModel.findByIdAndDelete(id);
            if (!deletedProduct)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);
            if (deletedProduct.thumbnails.length > 0) {
                deletedProduct.thumbnails.forEach(async (img) => {
                    if (typeof img === "string") {
                        const parts = img.split("/products/")[1];
                        const id = `products/${parts.split(".")[0]}`;
                        await multer_adapter_1.MulterAdapter.delete(id);
                    }
                });
            }
            return entity_1.ProductEntity.fromObject(deletedProduct);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
}
exports.ProductService = ProductService;
