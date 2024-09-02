import { Request, Response } from "express";
import { Role } from "../../domain/entity";
import { ProductRepository } from "../../domain/repository/product.repository";
import { AuthenticatedRequest } from "../../middleware/auth-required";
import {
  CreateProductDto,
  PaginationDto,
  UpdateProductDto,
} from "../../domain/dtos";

export class ProductController {
  constructor(public readonly productRepository: ProductRepository) {}

  public createProduct = (req: AuthenticatedRequest, res: Response) => {
    const userAuthorized = req.user?.payload;
    if (userAuthorized?.role !== Role.admin && userAuthorized?.role !== Role.premium)
      return res.status(401).json({ message: "Unauthorized operation" });
    const thumb:string[] = []

    if(req.file !== undefined) {
      thumb.push(req.file.path)
    }
  
    if(req.files !== undefined && Array.isArray(req.files)){
     req.files.forEach(img =>(thumb.push(img.path)))
    }  
    
    console.log(req.body.status);
    
    const precio= +req.body.price
    const statusB = typeof req.body.status === 'boolean'
    ? req.body.status
    : req.body.status === 'true';
    const stockP = +req.body.stock
    const {price, status, stock, ...rest} = req.body
    
    console.log(statusB);
    const [error, createDto] = CreateProductDto.create({
      owner:userAuthorized.role === 'premium'?userAuthorized?.id:null, price:precio, status:statusB, stock:stockP,
       ...rest
      });

    if (error) return res.status(400).json({ error: error });

    this.productRepository
      .createProduct(createDto!)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).send(error.message));
  };

  public uploadImages = (req:Request, res:Response) =>{
    const images:string[] = []
    const id = req.params.id
    if(!id) return res.status(400).send("Bad request");
    
    if(req.file !== undefined ){
      images.push(req.file.path)
    }
    if(req.files !== undefined && Array.isArray(req.files)){
      req.files.forEach(image =>(images.push(image.path)))
    }

    this.productRepository.uploadImages(id, images)
    .then(product =>(res.json(product)))
    .catch((error) => res.status(400).send(error.message));
  }

  public getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort } = req.query;

    try {
      const [error, paginationDto] = PaginationDto.create(+page, +limit, sort);

      if (error) return res.status(400).json({ error: error });

      this.productRepository
        .getProducts(paginationDto!)
        .then((product) => res.json(product))
        .catch((error) => res.status(400).send(error.message));
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  public getProductById = (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) return res.status(400).send("Bad request");
    this.productRepository
      .getProductById(id)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).json({ error: error.message }));
  };

  public deleteProductById = (req: AuthenticatedRequest, res: Response) => {
    const userAuthorized = req.user?.payload;
    
    if (userAuthorized?.role !== Role.admin && userAuthorized?.role !== Role.premium)
      return res.status(401).json({ message: "Unauthorized operation" });


    const id = req.params.id;
    if (!id) return res.status(400).send("Bad request");

    this.productRepository
      .deleteProductById(id, userAuthorized.id)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).json({ error: error.message }));
  };

  public updateProductById = (req: AuthenticatedRequest, res: Response) => {
    const userAuthorized = req.user?.payload;
    if (userAuthorized?.role !== Role.admin && userAuthorized?.role !== Role.premium)
      return res.status(401).json({ message: "Unauthorized operation" });

    console.log(req.body);
    

    const {stock, price, ...rest} = req.body

    

    const [error, updateProduct] = UpdateProductDto.create({stock:+stock, price:+price, ...rest});
    if (error) return res.status(400).json({ error: error });

    

    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "ID is required." });

    this.productRepository
      .updateProductById(id, updateProduct!, userAuthorized.id)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).send(error.message));
  };
}
