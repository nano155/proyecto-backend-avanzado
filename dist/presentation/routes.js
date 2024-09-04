"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./user/routes");
const routes_2 = require("./product/routes");
const routes_3 = require("./cart/routes");
const routes_4 = require("./payment/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        router.use('/api/users', routes_1.AuthRoutes.routes);
        router.use('/api/products', routes_2.ProductRoutes.routes);
        router.use('/api/carts', routes_3.CartRoutes.routes);
        router.use('/api/payments', routes_4.PaymentsRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
