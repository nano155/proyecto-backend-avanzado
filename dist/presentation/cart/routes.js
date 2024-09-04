"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = require("express");
const repository_1 = require("../../service/repository");
const controller_1 = require("./controller");
const mongo_1 = require("../../service/dao/mongo");
const auth_required_1 = require("../../middleware/auth-required");
class CartRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const cartService = new mongo_1.CartService();
        const cartRepository = new repository_1.CartRepositoryImpl(cartService);
        const cartController = new controller_1.CartController(cartRepository);
        router.post('/', cartController.createCart);
        router.get('/:id', cartController.getCartById);
        router.post('/:cid/products/:pid', auth_required_1.AuthRequired.authRequired, cartController.addProductToCart);
        router.delete('/:cid/products/:pid', cartController.deleteProductToCart);
        router.delete('/:id', cartController.deleteAllProduct);
        router.put('/:cid/products/:pid', cartController.updateCartQuantity);
        router.post('/:cid/purchase', cartController.generateTicket);
        router.get('/tickets/:id', cartController.getTicket);
        return router;
    }
}
exports.CartRoutes = CartRoutes;
