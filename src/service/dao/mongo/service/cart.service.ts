import { CartDatasource } from "../../../../domain/datasource";
import { CreateTicket } from "../../../../domain/dtos";
import { CartEntity, TicketEntity } from "../../../../domain/entity";
import { cartModel, productModel } from "../models";


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
            throw Error(`Internal error ${error}`);
          }
    }
    async getCartByid(id: string): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) throw new Error(`No se encontro ningun Cart con el ID ${id}`);
      
            const products = cart.products.map((item: any) => ({
              quantity: item.quantity,
              product: typeof item.product === "object" ? item.product : null, // Comprobamos si product es un objeto antes de llamar a toObject()
            }));
      
            return CartEntity.fromObject({ id: cart.id, products });
          } catch (error) {
            throw new Error(`Error interno: ${error}`);
          }
    }
    async addProductToCart(cid: string, pid: string): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productModel.findById(pid);
      
            if (!cart) throw new Error(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw new Error(`No se encontro ningun Product con el ID ${pid}`);
      
            let existingProductIndex = -1;
      
            // Buscar si el producto ya está en el carrito
            cart.products.forEach((item, index) => {
              if (item.product && item.product.equals(product._id)) {
                existingProductIndex = index;
              }
            });
            if (existingProductIndex !== -1) {
              // Si el producto ya está en el carrito, aumentar la cantidad
              cart.products[existingProductIndex].quantity++;
            } else {
              // Si el producto no está en el carrito, agregarlo
              const newProduct = {
                product: product ? product._id : null, // Si product existe, usar su _id; de lo contrario, usar null
                quantity: 1,
              };
              cart.products.push(newProduct);
            }
            // Guardar el carrito actualizado en la base de datos
            const updatedCart = await cart.save();
      
            if (!updatedCart) {
              throw new Error(`Error al actualizar el carrito`);
            }
            const cartEntity = await cartModel.findById(updatedCart.id);
            if (!cartEntity) {
              throw new Error(`Error al actualizar el carrito`);
            }
            return CartEntity.fromObject({
              id: cartEntity.id,
              products: cartEntity.products,
            });
          } catch (error) {
            throw new Error(`Error interno: ${error}`);
          }
    }
    async deleteProductToCart(cid: string, pid: string): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productModel.findById(pid);
      
            if (!cart) throw new Error(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw new Error(`No se encontro ningun Product con el ID ${pid}`);
      
            const productDeleted = cart.products.some(
              (product) => product.product?._id.toString() === pid
            );
            if (!productDeleted)
              throw Error(`El producto con id ${pid} no se encuentra en el carrito`);
      
            const deleted = await cartModel.findByIdAndUpdate(
              { _id: cid },
              { $pull: { products: { product: { _id: pid } } } }
            );
      
            if (!deleted) {
              throw new Error(`Error al eliminar el producto del carrito`);
            }
      
            const cartEntity = await cartModel.findById(cart.id);
            if (!cartEntity) {
              throw new Error(`Error al actualizar el carrito`);
            }
            return CartEntity.fromObject({
              id: cartEntity.id,
              products: cartEntity.products,
            });
          } catch (error) {
            throw new Error(`Error interno: ${error}`);
          }
    }
    async deleteAllProduct(id: string): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) throw new Error(`No se encontro ningun Cart con el ID ${id}`);
            while (cart.products.length !== 0) {
              cart.products.pop();
            }
            await cart.save();
      
            return CartEntity.fromObject({
              id: cart.id,
              products: cart.products,
            });
          } catch (error) {
            throw new Error(`Error interno: ${error}`);
          }
    }
    async updateCartQuantity(cid: string, pid: string, quantity: number): Promise<CartEntity> {
        try {
            const cart = await cartModel.findById(cid);
            const product = await productModel.findById(pid);
      
            if (!cart) throw new Error(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
              throw new Error(`No se encontro ningun Product con el ID ${pid}`);
      
            const updatedCart = cart.products.find(
              (product) => product.product?._id.toString() === pid
            );
            
            if (!updatedCart)
              throw new Error(`no se encontro producto con id${pid} en el carrito`);
      
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
            throw new Error(`Error interno: ${error}`);
          }
    }
    generateTicket(ticket: CreateTicket): Promise<TicketEntity> {
        throw new Error("Method not implemented.");
    }
    
}