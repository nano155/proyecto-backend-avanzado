"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const custom_error_1 = require("../../../../domain/error/custom-error");
const models_1 = require("../models");
const config_1 = require("../../../../config");
class PaymentStripeService {
    constructor() {
        this.stripe = new stripe_1.default(config_1.envs.STRIPE_APP_SECRET_KEY);
    }
    getPaymentIntent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPayment = yield models_1.userModel.findById(userId);
                if (!userPayment) {
                    throw custom_error_1.CustomError.notFound('User not found!');
                }
                // Recuperar el PaymentIntent desde Stripe usando el ID almacenado
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(userPayment.payment_intentId);
                return paymentIntent; // Aquí devuelves todo el objeto del PaymentIntent
            }
            catch (error) {
                // Manejo de errores
                console.error('Error fetching PaymentIntent:', error);
                throw custom_error_1.CustomError.internalServer('Unable to fetch PaymentIntent');
            }
        });
    }
    CreatePaymentIntent(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield models_1.ticketModel.findById(id);
                console.log(ticket);
                if (!ticket)
                    throw custom_error_1.CustomError.notFound("No se encontro ticket para hacer el pago");
                if (typeof ticket.amount !== 'number')
                    throw custom_error_1.CustomError.badRequest('type amount must be a number!');
                const ticketStripe = {
                    amount: ticket.amount * 100,
                    currency: 'usd'
                };
                const stripe = yield this.stripe.paymentIntents.create(ticketStripe);
                yield models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: stripe.id });
                return stripe;
            }
            catch (error) {
                throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
            }
        });
    }
    cancelPaymentIntent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.userModel.findById(userId);
                if (!user || !user.payment_intentId) {
                    throw custom_error_1.CustomError.notFound("No payment intent found for user");
                }
                yield this.stripe.paymentIntents.cancel(user.payment_intentId);
                yield models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
                }
                throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
            }
        });
    }
    completedPayment(userId, ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.userModel.findById(userId);
                if (!user || !user.payment_intentId) {
                    throw custom_error_1.CustomError.notFound("No payment intent found for user");
                }
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(user.payment_intentId);
                if (paymentIntent.status !== 'succeeded') {
                    throw custom_error_1.CustomError.badRequest("PaymentIntent has not been completed successfully");
                }
                yield models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
                const cart = yield models_1.cartModel.findById(user.cart);
                if (!cart)
                    throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${user.cart}`);
                cart.products.splice(0, cart.products.length);
                yield cart.save();
                yield models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
                yield models_1.ticketModel.findOneAndDelete({ _id: ticket });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
                }
                throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
            }
        });
    }
}
exports.PaymentStripeService = PaymentStripeService;
//# sourceMappingURL=paymentStripe.service.js.map