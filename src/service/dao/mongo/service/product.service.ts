import { ProductDatasource } from "../../../../domain/datasource";
import {
  CreateProductDto,
  PaginationDto,
  UpdateProductDto,
} from "../../../../domain/dtos";
import { ProductEntity } from "../../../../domain/entity";
import { CustomError } from "../../../../domain/error/custom-error";
import { PaginatedData } from "../../../../domain/shared/pagination-interface";
import { productModel, userModel } from "../models";

export class ProductService implements ProductDatasource {
  async createProduct(productDto: CreateProductDto): Promise<ProductEntity> {
    const ProductsExist = await productModel.findOne({
      title: productDto.title,
    });
    if (ProductsExist) throw CustomError.badRequest("Product already exist");
    const codeExist = await productModel.findOne({ code: productDto.code });
    if (codeExist) throw CustomError.badRequest("code already exist");
    try {
      const newProduct = new productModel(productDto);
      const productSaved = await newProduct.save();

      return ProductEntity.fromObject(productSaved);
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
  async getProducts(
    paginationDto: PaginationDto
  ): Promise<{ paginationData: PaginatedData }> {
    const { limit, page, sort } = paginationDto;

    if (limit <= 0 || page <= 0) {
      throw CustomError.badRequest("Limit and page must be greater than zero");
    }

    let query = productModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (sort === "asc" || sort === "desc") {
      query = query.sort({ price: sort === "asc" ? 1 : -1 });
    }
    try {
      const [total, products] = await Promise.all([
        productModel.countDocuments(),
        query.exec(),
      ]);
      const totalPages = Math.ceil(total / limit);
      const prev =
        page - 1 > 0 && page - 1 <= totalPages
          ? `/api/products?page=${page - 1}&limit=${limit}`
          : null;
      const next =
        page + 1 > totalPages
          ? null
          : `/api/products?page=${page + 1}&limit=${limit}`;

      const productEntities = products.map((product) =>
        ProductEntity.fromObject(product)
      );

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
    } catch (error) {
      throw CustomError.badRequest(`Internal error: ${error}`);
    }
  }
  async getProductById(id: string): Promise<ProductEntity> {
    try {
      const product = await productModel.findById(id);
      if (!product)
        throw CustomError.notFound(
          `No se encontro ningun producto con el ID ${id}`
        );

      return ProductEntity.fromObject(product);
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
  async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto, uid:string
  ): Promise<ProductEntity> {
    try {
      const findProduct = await productModel.findById(id);
      if (!findProduct) throw CustomError.badRequest("product dont exist!!");
      const findUser = await userModel.findById(uid);
      if (!findUser) throw CustomError.badRequest("user dont exist!!");
      if (findUser.role === "premium") {
        if(findUser.id === findProduct.owner){
          
          const updateProduct = await productModel.findByIdAndUpdate(id, updateProductDto, {new:true});
          if (!updateProduct)
            throw CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);
    
          return ProductEntity.fromObject(updateProduct);
        }else{
          throw CustomError.unauthorized('Este usuario no puede actualizar este objeto, porque no fue creado por el!')
        }
      }
      const updateProduct = await productModel.findByIdAndUpdate(id, updateProductDto, {new:true});
      if (!updateProduct)
        throw CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);
  
      return ProductEntity.fromObject(updateProduct);
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
  async deleteProductById(id: string, uid: string): Promise<ProductEntity> {
    try {
      const findProduct = await productModel.findById(id);
      if (!findProduct) throw CustomError.badRequest("product dont exist!!");
      const findUser = await userModel.findById(uid);
      if (!findUser) throw CustomError.badRequest("user dont exist!!");
      if (findUser.role === "premium") {
        if(findUser.id === findProduct.owner){
          
          const deletedProduct = await productModel.findByIdAndDelete(id);
          if (!deletedProduct)
            throw CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);
    
          return ProductEntity.fromObject(deletedProduct);
        }else{
          throw CustomError.unauthorized('Este usuario no puede borrar este objeto, porque no fue creado por el!')
        }
      }
      const deletedProduct = await productModel.findByIdAndDelete(id);
      if (!deletedProduct)
        throw CustomError.badRequest(`No se encontro ningun producto con el ID ${id}`);

      return ProductEntity.fromObject(deletedProduct);
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
}
