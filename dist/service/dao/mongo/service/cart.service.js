"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const entity_1 = require("../../../../domain/entity");
const custom_error_1 = require("../../../../domain/error/custom-error");
const models_1 = require("../models");
class CartService {
    async createCart() {
        try {
            const cart = new models_1.cartModel();
            const cartCreated = await cart.save();
            return entity_1.CartEntity.fromObject({
                id: cartCreated.id,
                products: cartCreated.products,
            });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
    async getCartByid(id) {
        try {
            const cart = await models_1.cartModel.findById(id);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${id}`);
            const products = cart.products.map((item) => ({
                quantity: item.quantity,
                product: typeof item.product === "object" ? item.product : null,
            }));
            return entity_1.CartEntity.fromObject({ id: cart.id, products });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async addProductToCart(cid, pid) {
        try {
            const cart = await models_1.cartModel.findById(cid);
            const product = await models_1.productModel.findById(pid);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Product con el ID ${pid}`);
            let existingProductIndex = -1;
            cart.products.forEach((item, index) => {
                if (item.product && item.product.equals(product._id)) {
                    existingProductIndex = index;
                }
            });
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++;
            }
            else {
                const newProduct = {
                    product: product ? product._id : null,
                    quantity: 1,
                };
                cart.products.push(newProduct);
            }
            const updatedCart = await cart.save();
            product.stock -= 1;
            if (!updatedCart) {
                throw custom_error_1.CustomError.internalServer(`Error al actualizar el carrito`);
            }
            await product.save();
            const cartEntity = await models_1.cartModel.findById(updatedCart.id);
            if (!cartEntity) {
                throw custom_error_1.CustomError.internalServer(`Error al actualizar el carrito`);
            }
            return entity_1.CartEntity.fromObject({
                id: cartEntity.id,
                products: cartEntity.products,
            });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async deleteProductToCart(cid, pid) {
        try {
            const cart = await models_1.cartModel.findById(cid);
            const product = await models_1.productModel.findById(pid);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${cid}`);
            if (!product)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Product con el ID ${pid}`);
            const productInCart = cart.products.find((p) => p.product?._id.toString() === pid);
            if (!productInCart)
                throw custom_error_1.CustomError.badRequest(`El producto con id ${pid} no se encuentra en el carrito`);
            const quantityToRemove = productInCart.quantity;
            const deleted = await models_1.cartModel.findByIdAndUpdate({ _id: cid }, { $pull: { products: { product: { _id: pid } } } }, { new: true });
            if (!deleted) {
                throw custom_error_1.CustomError.internalServer(`Error al eliminar el producto del carrito`);
            }
            product.stock += quantityToRemove;
            await product.save();
            const cartEntity = await models_1.cartModel.findById(cart.id);
            if (!cartEntity) {
                throw custom_error_1.CustomError.internalServer(`Error al actualizar el carrito`);
            }
            return entity_1.CartEntity.fromObject({
                id: cartEntity.id,
                products: cartEntity.products,
            });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async deleteAllProduct(id) {
        try {
            const cart = await models_1.cartModel.findById(id);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${id}`);
            while (cart.products.length !== 0) {
                cart.products.pop();
            }
            await cart.save();
            return entity_1.CartEntity.fromObject({
                id: cart.id,
                products: cart.products,
            });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async updateCartQuantity(cid, pid, quantity) {
        try {
            const cart = await models_1.cartModel.findById(cid);
            const product = await models_1.productModel.findById(pid);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontró ningún Cart con el ID ${cid}`);
            if (!product)
                throw custom_error_1.CustomError.badRequest(`No se encontró ningún Product con el ID ${pid}`);
            const existingProductInCart = cart.products.find((p) => p.product?._id.toString() === pid);
            if (!existingProductInCart) {
                const newProduct = {
                    product: product._id,
                    quantity,
                };
                product.stock -= quantity;
                cart.products.push(newProduct);
            }
            else {
                existingProductInCart.quantity += quantity;
                product.stock -= quantity;
            }
            const updatedCart = await cart.save();
            if (!updatedCart) {
                throw custom_error_1.CustomError.internalServer(`Error al actualizar el carrito`);
            }
            await product.save();
            const cartEntity = await models_1.cartModel.findById(updatedCart.id);
            if (!cartEntity) {
                throw custom_error_1.CustomError.internalServer(`Error al actualizar el carrito`);
            }
            return entity_1.CartEntity.fromObject({
                id: cartEntity.id,
                products: cartEntity.products,
            });
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async generateTicket(ticket) {
        const { amount, code, purchase_datetime, purchaser } = ticket;
        const oldTicket = await models_1.ticketModel.find({ purchaser });
        if (oldTicket && oldTicket.length > 0) {
            await Promise.all(oldTicket.map(async (ticket) => await ticket.deleteOne()));
        }
        try {
            const newTicket = new models_1.ticketModel({
                code,
                purchaser,
                purchase_datetime,
                amount,
            });
            const ticketSaved = await newTicket.save();
            return entity_1.TicketEntity.fromObject(ticketSaved);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error interno: ${error}`);
        }
    }
    async getTicket(id) {
        try {
            const user = await models_1.userModel.findById(id);
            if (!user)
                throw custom_error_1.CustomError.notFound("User by id not found");
            const findTickets = await models_1.ticketModel.find({ purchaser: user.email });
            if (!findTickets) {
                throw custom_error_1.CustomError.notFound("tickets not found");
            }
            return entity_1.TicketEntity.fromObject(findTickets[0]);
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Error retrieving tickets`);
        }
    }
}
exports.CartService = CartService;
