"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStripeImpl = void 0;
class PaymentStripeImpl {
    constructor(paymentStripeService) {
        this.paymentStripeService = paymentStripeService;
    }
    completedPayment(userId, ticketId) {
        return this.paymentStripeService.completedPayment(userId, ticketId);
    }
    getPaymentIntent(userId) {
        return this.paymentStripeService.getPaymentIntent(userId);
    }
    cancelPaymentIntent(userId) {
        return this.paymentStripeService.cancelPaymentIntent(userId);
    }
    CreatePaymentIntent(userId, id) {
        return this.paymentStripeService.CreatePaymentIntent(userId, id);
    }
}
exports.PaymentStripeImpl = PaymentStripeImpl;
//# sourceMappingURL=paymentStripeImpl.js.map