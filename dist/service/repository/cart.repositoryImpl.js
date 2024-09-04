"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepositoryImpl = void 0;
class CartRepositoryImpl {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getTicket(id) {
        return this.cartService.getTicket(id);
    }
    createCart() {
        return this.cartService.createCart();
    }
    getCartByid(id) {
        return this.cartService.getCartByid(id);
    }
    addProductToCart(cid, pid) {
        return this.cartService.addProductToCart(cid, pid);
    }
    deleteProductToCart(cid, pid) {
        return this.cartService.deleteProductToCart(cid, pid);
    }
    deleteAllProduct(id) {
        return this.cartService.deleteAllProduct(id);
    }
    updateCartQuantity(cid, pid, quantity) {
        return this.cartService.updateCartQuantity(cid, pid, quantity);
    }
    generateTicket(ticket) {
        return this.cartService.generateTicket(ticket);
    }
}
exports.CartRepositoryImpl = CartRepositoryImpl;
