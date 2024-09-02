import { CartDatasource } from "../../../../domain/datasource";
import { CreateTicket } from "../../../../domain/dtos";
import { CartEntity, TicketEntity } from "../../../../domain/entity";
import { CustomError } from "../../../../domain/error/custom-error";
import { cartModel, productModel, ticketModel, userModel } from "../models";

export class CartService implements CartDatasource {
  async createCart(): Promise<CartEntity> {
    try {
      const cart = new cartModel();
      const cartCreated = await cart.save();
      return CartEntity.fromObject({
        id: cartCreated.id,
        products: cartCreated.products,
      });
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
  async getCartByid(id: string): Promise<CartEntity> {
    try {
      const cart = await cartModel.findById(id);
      if (!cart)
        throw CustomError.badRequest(
          `No se encontro ningun Cart con el ID ${id}`
        );

      const products = cart.products.map((item: any) => ({
        quantity: item.quantity,
        product: typeof item.product === "object" ? item.product : null,
      }));

      return CartEntity.fromObject({ id: cart.id, products });
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }
  async addProductToCart(cid: string, pid: string): Promise<CartEntity> {
    try {
      const cart = await cartModel.findById(cid);
      const product = await productModel.findById(pid);

      if (!cart)
        throw CustomError.badRequest(
          `No se encontro ningun Cart con el ID ${cid}`
        );
      if (!product)
        throw CustomError.badRequest(
          `No se encontro ningun Product con el ID ${pid}`
        );

      let existingProductIndex = -1;

      cart.products.forEach((item, index) => {
        if (item.product && item.product.equals(product._id)) {
          existingProductIndex = index;
        }
      });
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        const newProduct = {
          product: product ? product._id : null,
          quantity: 1,
        };
        cart.products.push(newProduct);
      }
      const updatedCart = await cart.save();
      product.stock -= 1;

      if (!updatedCart) {
        throw CustomError.internalServer(`Error al actualizar el carrito`);
      }
      await product.save();

      const cartEntity = await cartModel.findById(updatedCart.id);
      if (!cartEntity) {
        throw CustomError.internalServer(`Error al actualizar el carrito`);
      }
      return CartEntity.fromObject({
        id: cartEntity.id,
        products: cartEntity.products,
      });
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }
  async deleteProductToCart(cid: string, pid: string): Promise<CartEntity> {
    try {
      const cart = await cartModel.findById(cid);
      const product = await productModel.findById(pid);

      if (!cart)
        throw CustomError.badRequest(
          `No se encontro ningun Cart con el ID ${cid}`
        );
      if (!product)
        throw CustomError.badRequest(
          `No se encontro ningun Product con el ID ${pid}`
        );

      const productInCart = cart.products.find(
        (p) => p.product?._id.toString() === pid
      );

      if (!productInCart)
        throw CustomError.badRequest(
          `El producto con id ${pid} no se encuentra en el carrito`
        );

      const quantityToRemove = productInCart.quantity;

      const deleted = await cartModel.findByIdAndUpdate(
        { _id: cid },
        { $pull: { products: { product: { _id: pid } } } },
        { new: true }
      );

      if (!deleted) {
        throw CustomError.internalServer(
          `Error al eliminar el producto del carrito`
        );
      }

      product.stock += quantityToRemove;
      await product.save();

      const cartEntity = await cartModel.findById(cart.id);
      if (!cartEntity) {
        throw CustomError.internalServer(`Error al actualizar el carrito`);
      }
      return CartEntity.fromObject({
        id: cartEntity.id,
        products: cartEntity.products,
      });
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }
  async deleteAllProduct(id: string): Promise<CartEntity> {
    try {
      const cart = await cartModel.findById(id);
      if (!cart)
        throw CustomError.badRequest(
          `No se encontro ningun Cart con el ID ${id}`
        );
      while (cart.products.length !== 0) {
        cart.products.pop();
      }
      await cart.save();

      return CartEntity.fromObject({
        id: cart.id,
        products: cart.products,
      });
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }
  async updateCartQuantity(
    cid: string,
    pid: string,
    quantity: number
  ): Promise<CartEntity> {
    try {
      const cart = await cartModel.findById(cid);
      const product = await productModel.findById(pid);

      if (!cart)
        throw CustomError.badRequest(
          `No se encontró ningún Cart con el ID ${cid}`
        );
      if (!product)
        throw CustomError.badRequest(
          `No se encontró ningún Product con el ID ${pid}`
        );

      const existingProductInCart = cart.products.find(
        (p) => p.product?._id.toString() === pid
      );

      if (!existingProductInCart) {
        const newProduct = {
          product: product._id,
          quantity,
        };
        product.stock -= quantity;
        cart.products.push(newProduct);
      } else {
        existingProductInCart.quantity += quantity;
        product.stock -= quantity;
      }

      const updatedCart = await cart.save();
      if (!updatedCart) {
        throw CustomError.internalServer(`Error al actualizar el carrito`);
      }
      await product.save();

      const cartEntity = await cartModel.findById(updatedCart.id);
      if (!cartEntity) {
        throw CustomError.internalServer(`Error al actualizar el carrito`);
      }

      return CartEntity.fromObject({
        id: cartEntity.id,
        products: cartEntity.products,
      });
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }
  
  async generateTicket(ticket: CreateTicket): Promise<TicketEntity> {    
    const { amount, code, purchase_datetime, purchaser } = ticket;
    const oldTicket = await ticketModel.find({purchaser})

    if(oldTicket && oldTicket.length >0) {
      await Promise.all(
        oldTicket.map(async ticket => await ticket.deleteOne())
      )
    }
    
    try {
      const newTicket = new ticketModel({
        code,
        purchaser,
        purchase_datetime,
        amount,
      });
      const ticketSaved = await newTicket.save();
      return TicketEntity.fromObject(ticketSaved);
    } catch (error) {
      throw CustomError.internalServer(`Error interno: ${error}`);
    }
  }

  async getTicket(id: string): Promise<TicketEntity> {
    try {
      const user = await userModel.findById(id);

      if (!user) throw CustomError.notFound("User by id not found");

      const findTickets = await ticketModel.find({ purchaser: user.email });
      
      if(!findTickets){
        throw CustomError.notFound("tickets not found");
      }

      return TicketEntity.fromObject(findTickets[0]);
    } catch (error) {
      throw CustomError.internalServer(`Error retrieving tickets`);
    }
  }
}
