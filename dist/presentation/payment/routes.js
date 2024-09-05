"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsRoutes = void 0;
const express_1 = require("express");
const paymentStripeImpl_1 = require("../../service/repository/paymentStripeImpl");
const paymentStripe_service_1 = require("../../service/dao/mongo/service/paymentStripe.service");
const controller_1 = require("./controller");
const auth_required_1 = require("../../middleware/auth-required");
class PaymentsRoutes {
    static get routes() {
        const paymentStripeService = new paymentStripe_service_1.PaymentStripeService();
        const paymentStripeRepository = new paymentStripeImpl_1.PaymentStripeImpl(paymentStripeService);
        const paymentStripeController = new controller_1.PaymentStripeController(paymentStripeRepository);
        const router = (0, express_1.Router)();
        router.get('/payment-intent', [auth_required_1.AuthRequired.authRequired], paymentStripeController.getPaymentIntent);
        router.post('/payment-intent/:id', [auth_required_1.AuthRequired.authRequired], paymentStripeController.CreatePaymentIntent);
        router.delete('/payment-deleted', [auth_required_1.AuthRequired.authRequired], paymentStripeController.cancelPaymentIntent);
        router.post('/payment-completed/:id', [auth_required_1.AuthRequired.authRequired], paymentStripeController.completedPayment);
        return router;
    }
}
exports.PaymentsRoutes = PaymentsRoutes;
//# sourceMappingURL=routes.js.map