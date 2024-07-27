import { Request, Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth-required";

import { v4 as uuidv4 } from "uuid";
import { userModel } from "../../service/dao/mongo/models/user.model";
import { CartRepository } from "../../domain/repository";
import { Role } from "../../domain/entity";
import { CreateTicket } from "../../domain/dtos";

interface ProductInfo {
  product: {
    title: string;
    description: string;
    code: string;
    price: number;
    status: boolean;
    stock: number;
    category: string;
    thumbnails: string[];
    id: string;
  };
  quantity: number;
  _id: string;
  id: string;
}

export class CartController {
  constructor(public readonly cartRepository: CartRepository) {}

  createCart = async (req: Request, res: Response) => {
    this.cartRepository
      .createCart()
      .then((cart) => res.json(cart))
      .catch((error) => res.status(400).send(error.message));
  };
  getCartById = (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) return res.status(400).send("Id don't received.");

    this.cartRepository
      .getCartByid(id)
      .then((cart) => res.json(cart))
      .catch((error) => res.status(400).send(error.message));
  };

  addProductToCart = (req: AuthenticatedRequest, res: Response) => {
    const cartUser = req.user?.payload;

    if (!cartUser)
      return res.status(401).json({ message: "Unauthorized operation!" });
    const cid = req.params.cid;
    if (!cid) return res.status(400).send("Id from cart don't received.");
    const pid = req.params.pid;
    if (!pid) return res.status(400).send("Id from product don't received.");

    if (cartUser?.role === Role.user && cartUser.cart === cid) {
      return this.cartRepository
        .addProductToCart(cid, pid)
        .then((cart) => res.json(cart))
        .catch((error) => res.status(400).send(error.message));
    }
    return res.status(401).json({ message: "Unauthorized operation!" });
  };

  deleteProductToCart = (req: Request, res: Response) => {
    const cid = req.params.cid;
    if (!cid) return res.status(400).send("Id from cart don't received.");
    const pid = req.params.pid;
    if (!pid) return res.status(400).send("Id from product don't received.");

    this.cartRepository
      .deleteProductToCart(cid, pid)
      .then((cart) => res.json(cart))
      .catch((error) => res.status(400).send(error.message));
  };

  deleteAllProduct = (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) return res.status(400).send("Id from cart don't received.");

    this.cartRepository
      .deleteAllProduct(id)
      .then((cart) => res.json(cart))
      .catch((error) => res.status(400).send(error.message));
  };

  updateCartQuantity = (req: Request, res: Response) => {
    const { pid, cid } = req.params;
    const { quantity } = req.body;
    if (!cid) return res.status(400).send("Id from cart don't received.");
    if (!pid) return res.status(400).send("Id from product don't received.");
    if (!quantity) return res.status(400).send("Quantity don't received.");

    this.cartRepository
      .updateCartQuantity(cid, pid, quantity)
      .then((cart) => res.json(cart))
      .catch((error) => res.status(400).send(error.message));
  };

  generateTicket = async (req: Request, res: Response) => {
    const { cid } = req.params;
    if (!cid) return res.status(404).json({ error: "Id not found!!" });

    const user = await userModel.findOne({ cart: cid });

    if (!user) return res.status(404).json({ error: "User not found" });

    this.cartRepository
      .getCartByid(cid)
      .then(async (cart: any) => {
        let totalPrice = 0; // Inicializar el precio total
        console.log(cart);

        const newCart = cart.products
          .map((productInfo: ProductInfo) => {

            const quantity = productInfo.quantity;
            const product = productInfo.product;

            if (!product || !product.price || !quantity) return null; // Verificar si hay valores nulos o si el stock es menor que la cantidad

            const productTotalPrice = product.price * quantity;

            totalPrice += productTotalPrice; // Agregar el precio total del producto al precio total general

            return {
              quantity: quantity,
              product: product,
              totalPrice: productTotalPrice, // Incluir el precio total del producto individual en el resultado
            };
          })
          .filter((item: any) => item !== null); // Filtrar los elementos nulos

        const [error, createTicket] = CreateTicket.create({
          code: uuidv4(),
          amount: totalPrice,
          purchase_datetime: new Date(),
          purchaser: user.email,
        });

        if (error) return res.status(500).json({ error: error });

        return this.cartRepository
          .generateTicket(createTicket!)
          .then((ticket) => res.json(ticket))
          .catch((error) => res.status(400).send(error.message));
      })
      .catch((error: any) => res.status(500).json(error));
  };

  getTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ error: "Id not found!!" });

    return this.cartRepository
      .getTicket(id)
      .then((ticket) => res.json(ticket))
      .catch((error) => res.status(400).send(error.message));
  };
}
