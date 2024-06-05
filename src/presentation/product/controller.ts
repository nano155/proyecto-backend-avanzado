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
    


    const [error, createDto] = CreateProductDto.create({
      owner:userAuthorized.role === 'premium'?userAuthorized?.id:null,
       ...req.body 
      });

    if (error) return res.status(400).json({ error: error });

    this.productRepository
      .createProduct(createDto!)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).send(error.message));
  };

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
    if (!id) res.status(400).send("Bad request");
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
    if (!id) res.status(400).send("Bad request");

    this.productRepository
      .deleteProductById(id, userAuthorized.id)
      .then((product) => res.json(product))
      .catch((error) => res.status(400).json({ error: error.message }));
  };

  public updateProductById = (req: AuthenticatedRequest, res: Response) => {
    const userAuthorized = req.user?.payload.role;
    if (userAuthorized !== Role.admin)
      return res.status(401).json({ message: "Unauthorized operation" });

    const [error, updateProduct] = UpdateProductDto.create(req.body);
    const id = req.params.id;

    if (error) return res.status(400).json({ error: error });

    if (!id) return res.status(400).json({ error: "ID is required." });

  //   this.productRepository
  //     .updateProductById(id, updateProduct!)
  //     .then((product) => res.json(product))
  //     .catch((error) => res.status(400).send(error.message));
  };
}
