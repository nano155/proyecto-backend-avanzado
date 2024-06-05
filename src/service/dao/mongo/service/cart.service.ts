import { CartDatasource } from "../../../../domain/datasource";
import { CreateTicket } from "../../../../domain/dtos";
import { CartEntity, TicketEntity } from "../../../../domain/entity";
import { CustomError } from "../../../../domain/error/custom-error";
import { cartModel, productModel, ticketModel } from "../models";


export class CartService implements CartDatasource{
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
            if (!cart) throw CustomError.badRequest(`No se encontro ningun Cart con el ID ${id}`);
      
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
      
            if (!cart) throw CustomError.badRequest(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw CustomError.badRequest(`No se encontro ningun Product con el ID ${pid}`);
      
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
      
            if (!updatedCart) {
              throw CustomError.internalServer(`Error al actualizar el carrito`);
            }
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
      
            if (!cart) throw CustomError.badRequest(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw CustomError.badRequest(`No se encontro ningun Product con el ID ${pid}`);
      
            const productDeleted = cart.products.some(
              (product) => product.product?._id.toString() === pid
            );
            if (!productDeleted)
              throw CustomError.badRequest(`El producto con id ${pid} no se encuentra en el carrito`);
      
            const deleted = await cartModel.findByIdAndUpdate(
              { _id: cid },
              { $pull: { products: { product: { _id: pid } } } }
            );
      
            if (!deleted) {
              throw CustomError.internalServer(`Error al eliminar el producto del carrito`);
            }
      
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
            if (!cart) throw CustomError.badRequest(`No se encontro ningun Cart con el ID ${id}`);
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
    async updateCartQuantity(cid: string, pid: string, quantity: number): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productModel.findById(pid);
      
            if (!cart) throw CustomError.badRequest(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw CustomError.badRequest(`No se encontro ningun Product con el ID ${pid}`);
      
            const updatedCart = cart.products.find(
              (product) => product.product?._id.toString() === pid
            );
            
            if (!updatedCart)
              throw CustomError.badRequest(`no se encontro producto con id${pid} en el carrito`);
      
            cart.products.forEach((product, index) => {
              if (cart.products[index].product?.id.toString() === pid) {
                cart.products[index].quantity += quantity;
              }
            });
      
            await cart.save();
      
            return CartEntity.fromObject({
              id: cart.id,
              products: cart.products,
            });
          } catch (error) {
            throw CustomError.internalServer(`Error interno: ${error}`);
          }
    }
    async generateTicket(ticket: CreateTicket): Promise<TicketEntity> {
      const { amount, code, purchase_datetime, purchaser } = ticket;


      const newTicket = new ticketModel({
        code,
        purchaser,
        purchase_datetime, 
        amount
      });
  
      const ticketSaved = await newTicket.save()
  
      return TicketEntity.fromObject(ticketSaved);
    
    }
    
}