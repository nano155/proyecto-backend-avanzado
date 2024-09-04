"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartEntity = void 0;
class CartEntity {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
    static fromObject(cart) {
        const { id, products = [] } = cart;
        return new CartEntity(id, products);
    }
}
exports.CartEntity = CartEntity;
